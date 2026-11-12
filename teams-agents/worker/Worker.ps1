# Worker.ps1 - runs on the always-on VM.
#
# It watches the "requests" folder of the synced queue library. Each request is a small
# JSON file that a Teams agent created. The worker does the job on the firm network and
# writes the answer to the "results" folder, where the agent reads it back.
#
# Written for Windows PowerShell 5.1 in Constrained Language mode:
# cmdlets and operators only. No .NET calls, no modules, no COM, no classes.
param(
    [string]$ConfigPath = (Join-Path $PSScriptRoot 'config.json'),
    [switch]$Once
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$MediaIdPattern     = '^[A-Za-z0-9-]{1,40}$'
$DescriptionPattern = '^[A-Za-z0-9]([A-Za-z0-9 _.-]{0,78}[A-Za-z0-9])?$'
$ClientMatterPattern = '^[A-Za-z0-9.-]{1,40}$'
$UsernamePattern    = '^[A-Za-z0-9._-]{1,64}$'

# ---------------------------------------------------------------- settings

function Read-Config([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path)) {
        throw "Settings file not found: $Path. Copy config.sample.json to config.json and fill it in."
    }
    $config = Get-Content -LiteralPath $Path -Raw -Encoding UTF8 | ConvertFrom-Json
    foreach ($name in 'QueueRoot', 'ArchiveRoot', 'ZipRoot', 'TarExe', 'DateFormat', 'PollSeconds') {
        if ($config.PSObject.Properties.Name -notcontains $name) { throw "Settings file is missing '$name'." }
    }
    foreach ($name in 'QueueRoot', 'ArchiveRoot', 'ZipRoot', 'TarExe') {
        if (-not (Test-Path -LiteralPath $config.$name)) { throw "Settings value '$name' points to a path that does not exist: $($config.$name)" }
    }
    $config
}

# ---------------------------------------------------------------- request fields

function Get-Field($Request, [string]$Name, [string]$Pattern) {
    if ($Request.PSObject.Properties.Name -notcontains $Name) { throw "The request is missing '$Name'." }
    $value = "$($Request.$Name)".Trim()
    if ($value -notmatch $Pattern) { throw "The '$Name' value '$value' is not allowed." }
    $value
}

# ---------------------------------------------------------------- media ID jobs

function Find-MediaFolder($Config, [string]$MediaId) {
    Get-ChildItem -LiteralPath $Config.ArchiveRoot -Directory | Where-Object { $_.Name -match "^[^_]+_${MediaId}_" }
}

function New-MediaFolder($Config, $Request) {
    $mediaId     = Get-Field $Request 'mediaId' $MediaIdPattern
    $description = Get-Field $Request 'description' $DescriptionPattern

    $existing = @(Find-MediaFolder $Config $mediaId)
    if ($existing.Count -gt 0) { throw "Media ID $mediaId already has a folder: $($existing[0].FullName)" }

    $name   = '{0}_{1}_{2}' -f (Get-Date -Format $Config.DateFormat), $mediaId, $description
    $folder = New-Item -ItemType Directory -Path (Join-Path $Config.ArchiveRoot $name)
    @{ message = 'Folder created.'; folderPath = $folder.FullName }
}

function New-MediaZip($Config, $Request) {
    $mediaId = Get-Field $Request 'mediaId' $MediaIdPattern

    $folders = @(Find-MediaFolder $Config $mediaId)
    if ($folders.Count -ne 1) { throw "Expected exactly one folder for media ID $mediaId but found $($folders.Count)." }
    $folder = $folders[0]

    $files = @(Get-ChildItem -LiteralPath $folder.FullName -Recurse -File)
    if ($files.Count -eq 0) { throw "The folder is empty, so there is nothing to zip: $($folder.FullName)" }

    $zipPath = Join-Path $Config.ZipRoot ($folder.Name + '.zip')
    if (Test-Path -LiteralPath $zipPath) { throw "A zip already exists: $zipPath (its fingerprint is in the .sha256.txt file next to it)" }

    & $Config.TarExe -a -c -f $zipPath -C $Config.ArchiveRoot $folder.Name
    if ($LASTEXITCODE -ne 0) {
        throw "Zipping failed (tar exit code $LASTEXITCODE). Delete the partial zip before retrying: $zipPath"
    }

    $hash = (Get-FileHash -LiteralPath $zipPath -Algorithm SHA256).Hash
    "$hash  $($folder.Name).zip" | Set-Content -LiteralPath "$zipPath.sha256.txt" -Encoding ASCII

    @{
        message     = 'Zip created.'
        zipPath     = $zipPath
        sha256      = $hash
        zipBytes    = (Get-Item -LiteralPath $zipPath).Length
        fileCount   = $files.Count
        sourceBytes = ($files | Measure-Object -Property Length -Sum).Sum
    }
}

# ---------------------------------------------------------------- matter team job

function Add-MatterTeamUser($Config, $Request) {
    $clientMatter = Get-Field $Request 'clientMatter' $ClientMatterPattern
    $username     = Get-Field $Request 'username' $UsernamePattern
    throw "The matter team app is not connected to Intapp yet, so $username was NOT added to $clientMatter. See HANDOVER.md, 'Finishing the matter team app'."
}

# ---------------------------------------------------------------- one request

function Invoke-Request($Config, $Request) {
    $action = Get-Field $Request 'action' '^[a-z-]{1,30}$'
    switch ($action) {
        'ping'            { @{ message = "The worker is running on $env:COMPUTERNAME." } }
        'media-folder'    { New-MediaFolder $Config $Request }
        'media-zip'       { New-MediaZip $Config $Request }
        'matter-add-user' { Add-MatterTeamUser $Config $Request }
        default           { throw "Unknown action '$action'." }
    }
}

function Complete-Request($Config, $Folders, $File) {
    # Claim the request by moving it. If the move fails, another worker window took it
    # or the file is still syncing; it is tried again on the next pass.
    $workingPath = Join-Path $Folders.working $File.Name
    try { Move-Item -LiteralPath $File.FullName -Destination $workingPath }
    catch { Write-Host "Skipped $($File.Name): $($_.Exception.Message)"; return }

    $result = [ordered]@{ requestId = $File.BaseName; action = ''; requestedBy = ''; status = 'ok'; message = '' }
    try {
        $request            = Get-Content -LiteralPath $workingPath -Raw -Encoding UTF8 | ConvertFrom-Json
        $result.action      = Get-Field $request 'action' '^.{1,30}$'
        $result.requestedBy = Get-Field $request 'requestedBy' '^.{1,100}$'
        $data = Invoke-Request $Config $request
        foreach ($key in $data.Keys) { $result[$key] = $data[$key] }
    }
    catch {
        $result.status  = 'error'
        $result.message = $_.Exception.Message
    }
    $result.completedAt = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'

    $result | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $Folders.results "$($File.BaseName).txt") -Encoding UTF8

    New-Object psobject -Property ([ordered]@{
        completedAt = $result.completedAt
        requestId   = $result.requestId
        action      = $result.action
        requestedBy = $result.requestedBy
        status      = $result.status
        message     = $result.message
    }) | Export-Csv -LiteralPath $Folders.log -Append -NoTypeInformation -Encoding UTF8

    $doneName = '{0}_{1}' -f (Get-Date -Format 'yyyyMMdd-HHmmss-fff'), $File.Name
    Move-Item -LiteralPath $workingPath -Destination (Join-Path $Folders.done $doneName)

    Write-Host "$($result.completedAt)  $($result.requestId)  $($result.status)  $($result.message)"
}

# ---------------------------------------------------------------- main loop

$config  = Read-Config $ConfigPath
$folders = @{
    requests = Join-Path $config.QueueRoot 'requests'
    working  = Join-Path $config.QueueRoot 'working'
    results  = Join-Path $config.QueueRoot 'results'
    done     = Join-Path $config.QueueRoot 'done'
    log      = Join-Path $config.QueueRoot 'request-log.csv'
}
foreach ($name in 'requests', 'working', 'results', 'done') {
    if (-not (Test-Path -LiteralPath $folders[$name])) { New-Item -ItemType Directory -Path $folders[$name] | Out-Null }
}

Write-Host "Worker started. Watching $($folders.requests). Leave this window open."
do {
    Get-ChildItem -LiteralPath $folders.requests -File -Filter '*.json' |
        Sort-Object LastWriteTime |
        ForEach-Object { Complete-Request $config $folders $_ }
    if (-not $Once) { Start-Sleep -Seconds $config.PollSeconds }
} until ($Once)
