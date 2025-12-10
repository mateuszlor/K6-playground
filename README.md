# k6 Performance Testing Playground

> **Purpose**: This repository is a **playground** designed to evaluate and demonstrate the capabilities of **k6**, **InfluxDB**, and **Grafana** for performance testing.

This project is a comprehensive performance testing suite, showing how to integrate these tools into a modern workflow.

## 🤖 AI Assisted Development

This project was created with the assistance of **Antigravity**, an agentic AI coding assistant developed by **Google Deepmind**.

---

## 📂 Project Structure

- **Scripts** (`src/`):
  - `src/smoke_test.js`: Validates system availability (1 VU).
  - `src/load_test.js`: Standard load test (ramp up to ~20 VUs).
  - `src/stress_test.js`: Finds system breaking point (ramp up to 100 VUs).
  - `src/spike_test.js`: Tests stability under sudden bursts (0 -> 100 VUs instantly).
- **Configuration**:
  - `config.json`: Centralized configuration for all tests (URLs, stages, thresholds).
- **Visualization (Docker)**:
  - `docker-compose.yml`: Stack with InfluxDB and Grafana.
  - `grafana/`: Provisioning configs and dashboards.
- **Reporting**:
  - `lib/junit.js`: Local reporter for generating CI/CD compatible XMLs.
  - `run_all_tests.ps1`: Helper script to run the full suite.
  - `validate_tests.ps1`: CI validation script (syntax check).

## 🚀 Getting Started

### Prerequisites

1. **k6**: [Install k6](https://k6.io/docs/get-started/installation/) (e.g., `winget install k6`).
2. **Docker**: Required for dashboard and history.

### Configuration

Customize the tests by editing `config.json`:
- **baseUrl**: Target URL.
- **tags**: Used for dashboard filtering (e.g., `"test_type": "smoke"`).
- **thresholds**: Pass/Fail criteria (e.g., `p(95)<500`).

## 🏃 Running Tests

> [!NOTE]
> If `k6` is not in your PATH, use the full path: `& 'C:\Program Files\k6\k6.exe' ...`

### 1. CI Validation (Build Step)
Run this to check script syntax without executing tests (useful for CI "Build" step).
```powershell
./validate_tests.ps1
```

### 2. Run All Sequentially (Recommended)
This script runs Smoke -> Load -> Spike -> Stress tests one by one, sends metrics to InfluxDB, and generates XML reports.
```powershell
./run_all_tests.ps1
```

### 3. Run Manually
You can run individual tests using k6 directly (mind the `src/` path).

```powershell
# Run smoke test
k6 run src/smoke_test.js

# Run with output to InfluxDB (for Dashboard)
k6 run --out influxdb=http://localhost:8086/k6 src/load_test.js
```

#### 📄 HTML Reports (Optional)

The native k6 web dashboard can export an HTML report. To generate it, set the following environment variables before running a test:

```powershell
$env:K6_WEB_DASHBOARD = "true"
$env:K6_WEB_DASHBOARD_EXPORT = "reports/html/report-${test}.html"
```

Then run the test as usual, e.g.:

```powershell
k6 run src/smoke_test.js
```

The HTML file will be saved to `reports/html/`. You can open it in a browser to view the full results.

**Note:** HTML export is only available in k6 versions >= 0.49. If your k6 version is older, this feature is unavailable.

## 📊 Dashboard (Grafana + InfluxDB)

A pre-configured Grafana dashboard is available to visualize test results.

1. **Start the stack**:
   ```powershell
   docker-compose up -d
   ```
2. **Open Grafana**:
   - URL: [http://localhost:3000](http://localhost:3000)
   - Go to **Dashboards** -> **k6 Load Testing Results**.
3. **Features**:
   - **Filtering**: Use **Test Type** (smoke, load, etc.) to view specific metrics.
   - **Comparison**: Use **Run ID** to select multiple test runs and compare them side-by-side in the "Comparison" row.

## 🤖 CI/CD Integration (TeamCity)

The project is ready for TeamCity integration.
Every test execution generates a **JUnit XML** report in the `reports/xml/` directory:
- `reports/xml/result-smoke.xml`
- `reports/xml/result-load.xml`
- etc.

**Setup in TeamCity**:
1. Add the **XML Report Processing** build feature.
2. Select **Ant/JUnit** report type.
3. Monitor pattern: `reports/xml/result-*.xml`.

TeamCity will display pass/fail statistics based on the **thresholds** defined in `config.json`.
