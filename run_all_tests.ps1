Write-Host "=== Starting All k6 Tests ==="
$k6 = 'C:\Program Files\k6\k6.exe'
$influx = 'influxdb=http://localhost:8086/k6'

Write-Host "`n[1/4] Running Smoke Test..."
Write-Host "=== Starting All k6 Tests ==="
$k6 = 'C:\Program Files\k6\k6.exe'
$influx = 'influxdb=http://localhost:8086/k6'

# Ensure report directories exist
New-Item -ItemType Directory -Force -Path "reports/html" | Out-Null
New-Item -ItemType Directory -Force -Path "reports/xml" | Out-Null

$runId = Get-Date -Format "yyyyMMdd-HHmmss"
Write-Host "Starting Test Suite with Run ID: $runId"

$tests = @("smoke", "load", "spike", "stress")

# Enable Native Web Dashboard
$env:K6_WEB_DASHBOARD = "true"

foreach ($test in $tests) {
    Write-Host "Running $test test..."
    
    # Set export path for this specific test
    $reportFile = "reports/html/report-${test}.html"
    $env:K6_WEB_DASHBOARD_EXPORT = $reportFile
    
    & $k6 run --out $influx --tag run_id=$runId ./src/${test}_test.js
}

Write-Host "`n=== All tests completed! ==="
Write-Host "Opening reports..."

foreach ($test in $tests) {
    if (Test-Path "reports/html/report-${test}.html") {
        Invoke-Item "reports/html/report-${test}.html"
    }
}
