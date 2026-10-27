param(
    [ValidateSet('install', 'dev', 'build', 'preview', 'test', 'test:e2e')]
    [string]$Action = 'dev'
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$previousLocation = Get-Location
try {
    Set-Location -LiteralPath $projectRoot
    $pnpmCommand = Get-Command pnpm -ErrorAction SilentlyContinue
    $bundledPnpm = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pnpm/bin/pnpm.cjs'
    $arguments = if ($Action -eq 'install') { @('install', '--frozen-lockfile') } else { @('run', $Action) }
    if ($pnpmCommand) {
        & $pnpmCommand.Source @arguments
    } elseif (Test-Path -LiteralPath $bundledPnpm) {
        & node $bundledPnpm @arguments
    } else {
        throw 'pnpm was not found. Install Node.js and pnpm, reopen the terminal, then try again.'
    }
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
    Set-Location -LiteralPath $previousLocation
}
