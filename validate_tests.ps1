$k6 = 'C:\Program Files\k6\k6.exe'
$files = Get-ChildItem -Path "./src" -Filter "*.js"

$exitCode = 0

foreach ($file in $files) {
    Write-Host "Validating $($file.Name)..." -NoNewline
    
    # Run k6 inspect to check syntax without executing
    & $k6 inspect $file.FullName | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host " [OK]" -ForegroundColor Green
    }
    else {
        Write-Host " [FAIL]" -ForegroundColor Red
        $exitCode = 1
    }
}

exit $exitCode
