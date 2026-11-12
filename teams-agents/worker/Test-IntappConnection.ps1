# Test-IntappConnection.ps1 - step one for the matter team app. READ-ONLY.
#
# It signs in to the Intapp address in config.json with the service account and asks the
# service to describe itself. It changes nothing in Intapp. The description is saved to
# intapp-wsdl.xml, which is what an assistant needs to finish the matter team app.
#
# Assumption to be proven by this script: the firm's Intapp Walls exposes the SOAP web
# service usually named APIService.svc. If the script fails, the error text is the answer
# to bring to IT.
param(
    [string]$ConfigPath = (Join-Path $PSScriptRoot 'config.json')
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$config = Get-Content -LiteralPath $ConfigPath -Raw -Encoding UTF8 | ConvertFrom-Json
if ($config.PSObject.Properties.Name -notcontains 'IntappServiceUrl') { throw "Settings file is missing 'IntappServiceUrl'." }
if ($config.IntappServiceUrl -notmatch '^https://' -or $config.IntappServiceUrl -match 'YOUR-') {
    throw "Set 'IntappServiceUrl' in config.json to the real https address of the Intapp service first."
}

# The password is stored encrypted by Windows for your account on this machine only.
$credentialPath = Join-Path $PSScriptRoot 'intapp-credential.xml'
if (-not (Test-Path -LiteralPath $credentialPath)) {
    Get-Credential -Message 'Enter the Intapp service account' | Export-Clixml -LiteralPath $credentialPath
    Write-Host "Saved the service account to $credentialPath"
}
$credential = Import-Clixml -LiteralPath $credentialPath

$wsdlPath = Join-Path $PSScriptRoot 'intapp-wsdl.xml'
Invoke-WebRequest -Uri ($config.IntappServiceUrl + '?singleWsdl') -Credential $credential -UseBasicParsing -OutFile $wsdlPath

$operations = @(Select-Xml -LiteralPath $wsdlPath -XPath "//*[local-name()='portType']/*[local-name()='operation']/@name" |
    ForEach-Object { $_.Node.Value } | Sort-Object -Unique)
if ($operations.Count -eq 0) {
    throw "The address answered, but the reply does not describe a web service. Open $wsdlPath to see what came back."
}

Write-Host "Connected. The service offers $($operations.Count) operations:"
$operations | ForEach-Object { Write-Host "  $_" }
Write-Host "Saved the full description to $wsdlPath"
