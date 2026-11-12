# Test-Worker.ps1 - a safe self-test. It builds a throwaway queue and a throwaway
# "archive" in your temp folder, feeds the worker sample requests, and checks the answers.
# It never touches the real archive, SharePoint or Intapp. Every line should say PASS.
param(
    [string]$TarExe   = 'C:\Windows\System32\tar.exe',
    [string]$TestRoot = (Join-Path $env:TEMP ('worker-test-' + (Get-Date -Format 'yyyyMMdd-HHmmss')))
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$queue   = Join-Path $TestRoot 'queue'
$archive = Join-Path $TestRoot 'archive'
foreach ($path in $queue, $archive, (Join-Path $queue 'requests')) { New-Item -ItemType Directory -Path $path | Out-Null }

$configPath = Join-Path $TestRoot 'config.json'
@{ QueueRoot = $queue; ArchiveRoot = $archive; ZipRoot = $archive; TarExe = $TarExe; DateFormat = 'yyyyMMdd'; PollSeconds = 1 } |
    ConvertTo-Json | Set-Content -LiteralPath $configPath -Encoding UTF8

$script:failures = 0

function Send-Request([string]$Id, $Body) {
    $Body | ConvertTo-Json | Set-Content -LiteralPath (Join-Path (Join-Path $queue 'requests') "$Id.json") -Encoding UTF8
    & (Join-Path $PSScriptRoot 'Worker.ps1') -ConfigPath $configPath -Once | Out-Null
    Get-Content -LiteralPath (Join-Path (Join-Path $queue 'results') "$Id.txt") -Raw -Encoding UTF8 | ConvertFrom-Json
}

function Assert([string]$Name, [bool]$Condition) {
    if ($Condition) { Write-Host "PASS  $Name" }
    else { Write-Host "FAIL  $Name"; $script:failures++ }
}

Write-Host "Language mode: $($ExecutionContext.SessionState.LanguageMode)"

$r = Send-Request 'ping' @{ action = 'ping'; requestedBy = 'Self Test' }
Assert 'ping is answered' ($r.status -eq 'ok')

$r = Send-Request 'media-1001' @{ action = 'media-folder'; mediaId = 1001; description = 'Custodian laptop Smith'; requestedBy = 'Self Test' }
$expected = Join-Path $archive ((Get-Date -Format 'yyyyMMdd') + '_1001_Custodian laptop Smith')
Assert 'media folder is created with date_mediaID_description' ($r.status -eq 'ok' -and $r.folderPath -eq $expected -and (Test-Path -LiteralPath $expected))

$r = Send-Request 'media-1001' @{ action = 'media-folder'; mediaId = 1001; description = 'Second try'; requestedBy = 'Self Test' }
Assert 'a second folder for the same media ID is refused' ($r.status -eq 'error' -and $r.message -like '*already has a folder*')

$r = Send-Request 'media-1002' @{ action = 'media-folder'; mediaId = 1002; description = '..\outside'; requestedBy = 'Self Test' }
Assert 'a description with path characters is refused' ($r.status -eq 'error' -and @(Get-ChildItem -LiteralPath $archive).Count -eq 1)

$r = Send-Request 'zip-1001' @{ action = 'media-zip'; mediaId = 1001; requestedBy = 'Self Test' }
Assert 'zipping an empty folder is refused' ($r.status -eq 'error' -and $r.message -like '*empty*')

'sample evidence file' | Set-Content -LiteralPath (Join-Path $expected 'sample.txt')
$r = Send-Request 'zip-1001' @{ action = 'media-zip'; mediaId = 1001; requestedBy = 'Self Test' }
Assert 'zip is created' ($r.status -eq 'ok' -and (Test-Path -LiteralPath $r.zipPath))
Assert 'zip fingerprint matches the file on disk' ($r.status -eq 'ok' -and $r.sha256 -eq (Get-FileHash -LiteralPath $r.zipPath -Algorithm SHA256).Hash)
Assert 'fingerprint file is written next to the zip' ($r.status -eq 'ok' -and (Test-Path -LiteralPath "$($r.zipPath).sha256.txt"))

$r = Send-Request 'zip-1001' @{ action = 'media-zip'; mediaId = 1001; requestedBy = 'Self Test' }
Assert 'a second zip of the same media ID is refused' ($r.status -eq 'error' -and $r.message -like '*already exists*')

$r = Send-Request 'matter-012345-0001-jsmith' @{ action = 'matter-add-user'; clientMatter = '012345-0001'; username = 'jsmith'; requestedBy = 'Self Test' }
Assert 'matter team request fails loudly until Intapp is connected' ($r.status -eq 'error' -and $r.message -like '*not connected to Intapp*')

$r = Send-Request 'nonsense' @{ action = 'delete-everything'; requestedBy = 'Self Test' }
Assert 'an unknown action is refused' ($r.status -eq 'error')

'this is not json' | Set-Content -LiteralPath (Join-Path (Join-Path $queue 'requests') 'broken.json')
& (Join-Path $PSScriptRoot 'Worker.ps1') -ConfigPath $configPath -Once | Out-Null
$r = Get-Content -LiteralPath (Join-Path (Join-Path $queue 'results') 'broken.txt') -Raw -Encoding UTF8 | ConvertFrom-Json
Assert 'an unreadable request is reported, and the worker keeps going' ($r.status -eq 'error')

$logRows = @(Import-Csv -LiteralPath (Join-Path $queue 'request-log.csv'))
Assert 'every request is in the log' ($logRows.Count -eq 10)
Assert 'no request is left unprocessed' (@(Get-ChildItem -LiteralPath (Join-Path $queue 'requests')).Count -eq 0 -and @(Get-ChildItem -LiteralPath (Join-Path $queue 'working')).Count -eq 0)

Write-Host "Test files are in $TestRoot"
if ($script:failures -gt 0) { throw "$($script:failures) check(s) failed." }
Write-Host 'All checks passed.'
