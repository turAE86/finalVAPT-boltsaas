# 📖 Code Documentation — VAPT SaaS Platform (BoltSaaS)

This document provides a detailed walkthrough of every major source file, class, function, and component in the project.

---

## Table of Contents

1. [Project Architecture](#1-project-architecture)
2. [Backend](#2-backend)
   - [Entry Points](#21-entry-points)
   - [Configuration](#22-configuration)
   - [Middleware](#23-middleware)
   - [Models (Database Schemas)](#24-models-database-schemas)
   - [Controllers](#25-controllers)
   - [Services](#26-services)
   - [Utilities](#27-utilities)
   - [Routes](#28-routes)
3. [Frontend](#3-frontend)
   - [Entry Points & Routing](#31-entry-points--routing)
   - [Auth Context](#32-auth-context)
   - [API Service](#33-api-service)
   - [Pages](#34-pages)
   - [Components](#35-components)
4. [Scanner (Python)](#4-scanner-python)
   - [Engine Orchestrator](#41-engine-orchestrator)
   - [Crawler](#42-crawler)
   - [Vulnerability Scanners](#43-vulnerability-scanners)
   - [PDF Report Generator](#44-pdf-report-generator)
5. [API Endpoint Reference](#5-api-endpoint-reference)
6. [Authentication & Security Flow](#6-authentication--security-flow)
7. [Scan & Credit Flow](#7-scan--credit-flow)
8. [Payment Flow](#8-payment-flow)
9. [Environment Variables](#9-environment-variables)
10. [How to Run the Project](#10-how-to-run-the-project)

---

## 1. Project Architecture

```
finalVAPT-boltsaas/
├── backend/          # Node.js / Express API server (port 5000)
│   └── src/
│       ├── server.js          # Process entry point
│       ├── app.js             # Express app + route mounting
│       ├── config/            # DB, Passport, Razorpay, Pricing
│       ├── controllers/       # Route handler functions
│       ├── middlewares/       # JWT auth middleware
│       ├── models/            # Mongoose schemas (User, Scan, Contact)
│       ├── routes/            # Express router definitions
│       ├── services/          # Business logic (email, scanner, PDF, OWASP)
│       └── utils/             # OTP generator
├── frontend/         # React 19 + Vite SPA (port 5173)
│   └── src/
│       ├── main.jsx           # React bootstrap
│       ├── App.jsx            # Router + PrivateRoute
│       ├── context/           # AuthContext (global auth state)
│       ├── services/          # Axios instance + authService
│       ├── pages/             # Full-page React components
│       └── components/        # Reusable UI components
└── scanner/          # Python vulnerability scanner
    ├── engine.py              # Main scan orchestrator
    ├── generate_pdf.py        # PDF generation entry point
    ├── report_generator.py    # ReportLab PDF builder
    └── core/                  # Individual scanner modules
        ├── crawler.py
        ├── xss_scan.py
        ├── sqli_scan.py
        ├── command_injection_scan.py
        ├── directory_traversal_scan.py
        ├── open_redirect_scan.py
        ├── ssrf_scan.py
        └── headers_scan.py
```

**Data flow summary:**

```
Browser (React)
  │  HTTP/REST (Axios + Bearer token)
  ▼
Express API (Node.js, port 5000)
  │  child_process.execFile
  ▼
Python Scanner (engine.py)
  │  JSON to stdout
  ▼
Express API — maps findings to OWASP, stores in MongoDB
  │  PDF generation (Python reportlab)
  ▼
Browser — downloads PDF report
```

---

## 2. Backend

### 2.1 Entry Points

#### `backend/src/server.js`

The process entry point. Connects to MongoDB before starting the HTTP server so that requests are never served against an unconnected database.

| Symbol | Type | Description |
|--------|------|-------------|
| `startServer()` | `async function` | Calls `connectDB()`, then `app.listen(PORT)`. Exits the process on failure. |
| `PORT` | `const` | Reads `process.env.PORT`, defaults to `5000`. |

```js
const startServer = async () => {
  await connectDB();          // throws if MongoDB unreachable
  app.listen(PORT, ...);
};
startServer();
```

---

#### `backend/src/app.js`

Creates and configures the Express application. All route prefixes are defined here.

| Route prefix | Router module |
|---|---|
| `/api` | `scanRoutes`, `reportRoutes`, `contactRoutes` |
| `/api/auth` | `authRoutes`, `passwordRoutes`, `googleAuthRoutes`, `otpRoutes` |
| `/api/payment` | `paymentRoutes` |
| `/api/health` | Inline health-check handler |

Notable settings:
- `cors()` — allows all origins (suitable for development; restrict in production).
- `express.json()` — parses JSON request bodies.
- `passport.initialize()` — required for Google OAuth strategy.

---

### 2.2 Configuration

#### `backend/src/config/db.js`

Exports `connectDB()` — a thin Mongoose wrapper that connects to `process.env.MONGO_URI` and logs success or throws on failure.

---

#### `backend/src/config/passport.js`

Configures the **Google OAuth 2.0** strategy using `passport-google-oauth20`.

**Strategy callback** (runs after Google redirect):

1. Looks up the user by `googleId` **or** email (handles existing email/password accounts).
2. If not found → creates a new `User` document with `isVerified: true` (Google accounts skip OTP).
3. If found but `googleId` missing → links the Google ID to the existing account.
4. Calls `done(null, user)` to pass the user to the route handler.

---

#### `backend/src/config/pricing.js`

Defines the subscription plan catalogue consumed by the payment controller.

```js
export const PLANS = {
  BASIC_10: { credits: 10, amount: 19900 },  // ₹199
  PRO_20:   { credits: 20, amount: 34900 },  // ₹349
  ADV_30:   { credits: 30, amount: 49900 },  // ₹499
};
```

`amount` is in **paise** (smallest INR unit) as required by Razorpay.

---

#### `backend/src/config/razorpay.js`

Creates and exports a `razorpay` instance (Razorpay SDK) using `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` from the environment.

---

### 2.3 Middleware

#### `backend/src/middlewares/authMiddleware.js`

**`protect(req, res, next)`** — Express middleware that guards every protected route.

Steps:
1. Reads the `Authorization` header and strips the `Bearer ` prefix.
2. Returns `401` if the header is missing or malformed.
3. Calls `jwt.verify(token, process.env.JWT_SECRET)` — returns `401` for expired/invalid tokens.
4. Fetches the user from MongoDB by `decoded.id`, excluding the password field.
5. Returns `401` if the user no longer exists.
6. Returns `403` if `user.isVerified` is `false`.
7. Attaches `user` to `req.user` and calls `next()`.

---

### 2.4 Models (Database Schemas)

#### `backend/src/models/User.js`

```
User {
  name            String  (required)
  email           String  (required, unique)
  password        String  (bcrypt hash; required unless googleId present)
  googleId        String  (optional; set for OAuth users)
  scanCredits     Number  (default: 5 — the free tier allowance)
  role            Enum    ("FREE" | "PAID", default: "FREE")
  otp             String  (6-digit code, cleared after verification)
  otpExpiry       Date    (10 min TTL)
  isVerified      Boolean (default: false; becomes true after OTP or Google OAuth)
  resetToken      String  (hex token for password reset)
  resetTokenExpiry Date   (15 min TTL)
  scannerAgreementAccepted  Boolean (default: false)
  scannerAgreementAcceptedAt Date
  scannerAgreementVersion   String  (default: "1.0")
  createdAt / updatedAt     Date    (Mongoose timestamps)
}
```

Key behaviour: `password` is only required when `googleId` is absent, so OAuth users can be stored without a password.

---

#### `backend/src/models/Scan.js`

```
Scan {
  user     ObjectId  (ref → User, required)
  target   String    (scanned URL, required)
  results  Object    (raw JSON output from Python engine)
  findings Array     (processed vulnerability objects — see owaspMapper)
  createdAt / updatedAt Date
}

Finding (embedded, no _id) {
  type        String  (e.g. "XSS", "SQLI", "Command Injection")
  owasp       String  (OWASP 2021 category, e.g. "A03:2021 – Injection")
  severity    String  ("CRITICAL" | "HIGH" | "MEDIUM" | "LOW")
  description String
  evidence    Mixed   (payload string, array of payloads, or object)
}
```

---

#### `backend/src/models/Contact.js`

```
Contact {
  name    String
  email   String
  message String
  createdAt / updatedAt Date
}
```

Stores contact-form submissions with no authentication required.

---

### 2.5 Controllers

Controllers hold request-handling logic. Each function receives `(req, res)` and is async.

---

#### `backend/src/controllers/authController.js`

| Function | Method | Description |
|---|---|---|
| `signup(req, res)` | POST | Validates fields, checks for duplicate email, hashes password with bcrypt (10 rounds), generates OTP, saves `User`, sends OTP email. Returns `201` with a prompt to verify. |
| `login(req, res)` | POST | Looks up user by email, checks `isVerified`, compares password with `bcrypt.compare`, signs a 7-day JWT, returns `{ user, token }`. |
| `getCurrentUser(req, res)` | GET | Returns the authenticated user document (password and OTP fields excluded). Requires `protect` middleware. |
| `acceptScannerAgreement(req, res)` | POST | Updates `scannerAgreementAccepted`, `scannerAgreementAcceptedAt`, and `scannerAgreementVersion` on the user document. |

**Internal helper:**

```js
const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
```

---

#### `backend/src/controllers/otpController.js`

| Function | Description |
|---|---|
| `verifyOTP(req, res)` | Finds a user matching `{ email, otp, otpExpiry: { $gt: now } }`. Sets `isVerified = true`, clears OTP fields, issues a JWT, returns `{ token, user }`. |
| `resendOTP(req, res)` | Generates a fresh OTP, updates `otpExpiry`, saves, and re-sends the email. |

---

#### `backend/src/controllers/passwordController.js`

| Function | Description |
|---|---|
| `forgotPassword(req, res)` | Generates a 32-byte hex `resetToken` (valid 15 min), saves it on the user, emails a `FRONTEND_URL/reset-password/<token>` link. Returns a generic success message even if the email is not found (prevents email enumeration). |
| `resetPassword(req, res)` | Finds user by `{ resetToken, resetTokenExpiry: { $gt: now } }`, hashes the new password, clears reset fields, saves. |

---

#### `backend/src/controllers/scanController.js`

| Function | Description |
|---|---|
| `startScan(req, res)` | Validates `target`, blocks if `scanCredits <= 0`, calls `runPythonScan(target)`, maps results with `mapFindings`, persists a `Scan` document, deducts one credit from `req.user`, returns the scan object. |
| `getScans(req, res)` | Returns all scans for `req.user._id`, sorted newest-first. |

---

#### `backend/src/controllers/reportController.js`

| Function | Description |
|---|---|
| `downloadReport(req, res)` | Fetches the scan by `{ _id: req.params.id, user: req.user._id }` (ownership check). Prepends any `open_ports` finding. Calls `generatePDF(scanData)`. Streams the resulting PDF file to the response with `Content-Disposition: attachment`. Deletes the temporary PDF after sending. |

---

#### `backend/src/controllers/paymentController.js`

| Function | Description |
|---|---|
| `createOrder(req, res)` | Validates the `plan` key against `PLANS`, calls `razorpay.orders.create` with the plan's amount in paise. Returns `{ orderId, amount, currency, plan }`. |
| `verifyPayment(req, res)` | Reconstructs the expected HMAC-SHA256 signature (`orderId|paymentId`) using `RAZORPAY_KEY_SECRET`. Compares with `razorpay_signature`. On match, adds `PLANS[plan].credits` to the user and sets `role = "PAID"`. |

---

#### `backend/src/controllers/contactController.js`

| Function | Description |
|---|---|
| `submitContact(req, res)` | Creates a `Contact` document from `{ name, email, message }`. Returns `201`. |

---

### 2.6 Services

Services encapsulate business logic that is reused across controllers or involves external systems.

---

#### `backend/src/services/emailService.js`

**`sendEmail({ to, subject, html })`** — Creates a Nodemailer transporter using Gmail SMTP (app-specific password), and sends the email. Used for OTP delivery, password-reset links, and any other transactional email.

---

#### `backend/src/services/scannerService.js`

**`runPythonScan(target)`** → `Promise<Object>`

Spawns the Python scanner as a child process:

```
python -m scanner.engine <target>
       ^--- run from project root so imports resolve
```

- Timeout: **10 minutes** (complex sites can take time).
- Max buffer: **100 MB** (large scan outputs).
- Parses `stdout` as JSON and resolves the promise.
- On `SIGKILL` (timeout), attempts to parse whatever partial JSON was printed before rejecting.
- Streams `stderr` lines to the Node.js console in real time for debugging.

---

#### `backend/src/services/owaspMapper.js`

**`mapFindings(results)`** → `Array<Finding>`

Translates raw Python scanner output into normalised finding objects with OWASP 2021 classifications.

Handles three source formats:

| Source | Condition | Action |
|---|---|---|
| Legacy `open_ports` array | `results.open_ports.length > 0` | Adds `OPEN_PORTS` finding (A05 – Security Misconfiguration) |
| Missing HTTPS | Port 443 not in `open_ports` | Adds `NO_HTTPS` finding (A02 – Cryptographic Failures) |
| Flat findings list | `results.findings` is an array | Maps each item using `vulnTypeMap` for OWASP/severity defaults |
| Legacy header results | `results.headers.missing_headers` | Adds `MISSING_SECURITY_HEADERS` finding |
| Legacy XSS result | `results.xss.vulnerable` | Adds XSS finding |
| Legacy SQLI result | `results.sqli.vulnerable` | Adds SQLI finding |

**`vulnTypeMap`** — lookup table mapping vulnerability type strings to `{ owasp, severity }`:

| Type | OWASP | Severity |
|---|---|---|
| XSS | A03:2021 – Injection | HIGH |
| SQLI / SQL Injection | A03:2021 – Injection | CRITICAL |
| Command Injection | A03:2021 – Injection | CRITICAL |
| Directory Traversal | A01:2021 – Broken Access Control | HIGH |
| Open Redirect | A03:2021 – Injection | MEDIUM |
| SSRF | A10:2021 – SSRF | HIGH |

---

#### `backend/src/services/reportService.js`

**`generatePDF(scan)`** → `Promise<filePath>`

1. Serialises the `scan` object to a temporary JSON file in `os.tmpdir()`.
2. Runs `generate_pdf.py <tempFile>` via `execFile`.
3. Tries `python3`, then `python` (platform-aware) until one succeeds.
4. Reads the absolute file path printed to `stdout` by the Python script.
5. Validates the file exists, deletes the temp JSON file, and resolves with the PDF path.

---

### 2.7 Utilities

#### `backend/src/utils/otp.js`

**`generateOTP()`** → `String`

Generates a uniformly random 6-digit string (`100000`–`999999`) using `Math.random`.

```js
export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
```

> ⚠️ **Security note:** `Math.random()` is **not cryptographically secure**. For production use, replace this with `crypto.randomInt(100000, 1000000).toString()` (Node.js built-in `crypto` module) to prevent predictable OTPs that could be exploited for account takeover.

---

### 2.8 Routes

All routes follow REST conventions. Protected routes include the `protect` middleware.

| File | Prefix | Key routes |
|---|---|---|
| `authRoutes.js` | `/api/auth` | `POST /signup`, `POST /login`, `GET /me` (protected), `POST /accept-scanner-agreement` (protected) |
| `otpRoutes.js` | `/api/auth` | `POST /verify-otp`, `POST /resend-otp` |
| `passwordRoutes.js` | `/api/auth` | `POST /forgot-password`, `POST /reset-password` |
| `googleAuthRoutes.js` | `/api/auth` | `POST /google` (redirect), `GET /google/callback` |
| `scanRoutes.js` | `/api` | `POST /scan` (protected), `GET /scans` (protected) |
| `reportRoutes.js` | `/api` | `GET /report/:id` (protected) |
| `paymentRoutes.js` | `/api/payment` | `POST /create-order` (protected), `POST /verify` (protected) |
| `contactRoutes.js` | `/api` | `POST /contact` |

---

## 3. Frontend

### 3.1 Entry Points & Routing

#### `frontend/src/main.jsx`

Wraps the app in `<BrowserRouter>` and `<AuthProvider>` before mounting to `#root`.

---

#### `frontend/src/App.jsx`

Declares all client-side routes using React Router v7.

| Symbol | Purpose |
|---|---|
| `PrivateRoute` | HOC — redirects unauthenticated users to `/login` |
| `ScrollToTop` | Utility component — scrolls the window to the top on every route change using multiple timer strategies to catch async renders |
| `App` (default export) | Renders `<ScrollToTop>` and the full `<Routes>` tree |

Protected routes (wrapped in `<PrivateRoute>`):
- `/scanner`

Public routes include home, login, signup, forgot/reset password, OTP verification, OAuth success, pricing, services, contact, terms, and privacy pages.

---

### 3.2 Auth Context

#### `frontend/src/context/AuthContext.jsx`

Provides global authentication state to the entire app via React Context.

**`AuthProvider`** — wraps the component tree; initialises `user` from `localStorage` so login persists across page reloads.

| Function | Signature | Description |
|---|---|---|
| `login(data)` | `(data: { token?, user? }) => void` | Persists `token` and `user` to `localStorage`; updates `user` state |
| `logout()` | `() => void` | Removes `token` and `user` from `localStorage`; sets `user` to `null` |
| `updateCredits(credits)` | `(credits: number) => void` | Updates only `scanCredits` on the stored user; used after a scan or payment |
| `updateUser(userData)` | `(userData: object) => void` | Replaces the full user object in state and `localStorage` |

**`useAuth()`** — custom hook that returns `{ user, login, logout, updateCredits, updateUser }`. Import and call this anywhere in the component tree.

---

### 3.3 API Service

#### `frontend/src/services/api.js`

Creates an Axios instance pre-configured with:

- `baseURL: "http://localhost:5000"`
- **Request interceptor** — reads `token` from `localStorage` and injects `Authorization: Bearer <token>` on every outgoing request automatically.

Import this instance (`import api from "../services/api"`) instead of plain `axios` for all backend calls.

---

#### `frontend/src/services/authService.js`

Thin wrappers around the `api` instance for authentication endpoints:

| Function | API call |
|---|---|
| `loginUser(email, password)` | `POST /api/auth/login` |
| `signupUser(name, email, password)` | `POST /api/auth/signup` |

---

### 3.4 Pages

| File | Route | Description |
|---|---|---|
| `Home.jsx` | `/` | Landing page — hero section, features overview, methodology, call-to-action |
| `Login.jsx` | `/login` | Email/password login form; Google OAuth button; links to signup and forgot password |
| `Signup.jsx` | `/signup` | Registration form; on success redirects to `/verify-otp` |
| `VerifyOTP.jsx` | `/verify-otp` | Accepts the 6-digit OTP; calls `POST /api/auth/verify-otp`; on success logs the user in |
| `ForgotPassword.jsx` | `/forgot-password` | Sends `POST /api/auth/forgot-password` with the email |
| `ResetPassword.jsx` | `/reset-password/:token` | Reads `:token` from URL, posts new password to `POST /api/auth/reset-password` |
| `OAuthSuccess.jsx` | `/oauth-success` | Handles the Google OAuth redirect; extracts token from URL query params and calls `login()` |
| `Scanner.jsx` | `/scanner` | **Main scanner page** — shows `ClickwrapAgreement` on first visit; accepts target URL; calls `POST /api/scan`; displays severity chart and findings table; lists scan history |
| `ScanHistory.jsx` | (embedded in Scanner) | Lists previous scans; download PDF via `GET /api/report/:id` |
| `Pricing.jsx` | `/pricing` | Shows the three subscription plans; loads Razorpay checkout on purchase button click; calls `createOrder` then `verifyPayment` |
| `Contact.jsx` | `/contact` | Contact form; calls `POST /api/contact` |
| `Services.jsx` | `/services` | Lists security service offerings |

---

### 3.5 Components

| Component | File | Description |
|---|---|---|
| `Navigation` | `components/Navigation.jsx` | Top navigation bar — shows user name, scan credits badge, and logout; uses `useAuth()` |
| `ClickwrapAgreement` | `components/ClickwrapAgreement.jsx` | Modal requiring users to read and accept scanner usage terms before the first scan; persists acceptance via `POST /api/auth/accept-scanner-agreement` |
| `SeverityChart` | (inside `Scanner.jsx`) | Chart.js doughnut chart visualising finding counts by severity level (CRITICAL / HIGH / MEDIUM / LOW) |
| `Footer` | `components/Footer.jsx` | Site footer with navigation links |

---

## 4. Scanner (Python)

### 4.1 Engine Orchestrator

#### `scanner/engine.py`

Entry point for the Python scanner. Invoked by the Node.js backend as:
```
python -m scanner.engine <target_url>
```

**`port_scan(target)`** → `List[int]`

Attempts TCP connections to ports `80` and `443` on the target host (2-second timeout). Returns a list of open ports.

**`run_scan(target)`** → `dict`

Main orchestration function:

1. Normalises the URL scheme.
2. Calls `discover_endpoints(base_url)` to find up to 20 reachable pages.
3. Calls `scan_headers(base_url)` and adds any missing security headers to `findings`.
4. Iterates every discovered endpoint and runs all six vulnerability scanners:
   - `scan_xss`, `scan_sqli`, `scan_directory_traversal`
   - `scan_command_injection`, `scan_open_redirect`, `scan_ssrf`
5. Collects all `details` arrays from each scanner result into a flat `findings` list.
6. Returns `{ open_ports: [...], findings: [...] }` as JSON printed to `stdout`.

Errors per scanner are caught individually so one failing module does not abort the whole scan.

---

### 4.2 Crawler

#### `scanner/core/crawler.py`

**`discover_endpoints(base_url)`** → `List[str]`

1. Fetches the base URL and parses HTML with BeautifulSoup.
2. Collects all `<a href>` and `<form action>` values that begin with `/` (internal links only).
3. Resolves them to absolute URLs with `urljoin`.
4. If the target looks like DVWA, appends the six standard vulnerability page paths automatically.
5. Returns a de-duplicated list of discovered endpoint URLs.

---

### 4.3 Vulnerability Scanners

Each scanner follows the same pattern:
- Accepts a `url` string.
- Parses its query parameters.
- Falls back to a sensible default parameter set for known DVWA page paths.
- Injects payloads and checks responses.
- Returns `{ vulnerable: bool, details: [ { type, severity, url, param, payload, description }, ... ] }`.

---

#### `scanner/core/xss_scan.py` — **`scan_xss(url)`**

Payloads:
```
<script>alert(1)</script>
"><svg/onload=alert(1)>
';alert(1);//
<img src=x onerror=alert(1)>
```

Detection: **reflection-based** — checks whether the injected payload string appears verbatim in the HTTP response body.

Severity: `HIGH`

---

#### `scanner/core/sqli_scan.py` — **`scan_sqli(target)`**

Payloads:
```
' OR '1'='1
" OR "1"="1
' OR 1=1--
```

Detection: **response-based** — flags a 200 response with body length > 100 characters as potentially vulnerable. (Heuristic; produces false positives on stable pages.)

> ⚠️ **Known limitation:** This detection method has a high false-positive rate because most healthy pages return a 200 status with substantial body content. A more accurate approach would compare the baseline response length against the injected response length, look for database error strings (e.g. `mysql_fetch`, `ORA-01756`, `syntax error`), or use a time-delay payload (e.g. `' AND SLEEP(3)--`) for blind detection.

Severity: `CRITICAL`

---

#### `scanner/core/command_injection_scan.py` — **`scan_command_injection(target)`**

Payloads (time-delay based):
```
; sleep 3;
& ping -c 3 127.0.0.1 &
| sleep 2
`sleep 2`
```

Detection: **time-based** — if response time exceeds 2 seconds, the command may have executed. Timeouts are also treated as positive indicators.

Severity: `CRITICAL`

---

#### `scanner/core/directory_traversal_scan.py` — **`scan_directory_traversal(url)`**

Payloads:
```
../../etc/passwd
../../../etc/passwd
....//....//etc/passwd
```

Detection: checks whether the string `root:` appears in the response body (indicative of `/etc/passwd` content being returned).

Severity: `HIGH`

---

#### `scanner/core/open_redirect_scan.py` — **`scan_open_redirect(url)`**

Payloads:
```
http://evil.com
//evil.com
https://evil.com
```

Detection: checks whether the response `Location` header (after redirect) points to the injected external domain.

Severity: `MEDIUM`

---

#### `scanner/core/ssrf_scan.py` — **`scan_ssrf(url)`**

Payloads: internal addresses such as `http://127.0.0.1`, `http://localhost`, `http://169.254.169.254` (AWS metadata endpoint).

Detection: checks whether the response contains strings typical of internal service responses (`root:`, `AWS`, `127.0.0.1`, etc.).

Severity: `HIGH`

---

#### `scanner/core/headers_scan.py` — **`scan_headers(target: str)`**

Checks for the following security headers in both `http://` and `https://` responses:

| Header | Purpose |
|---|---|
| `Content-Security-Policy` | Restricts resource loading sources |
| `X-Frame-Options` | Prevents clickjacking |
| `X-Content-Type-Options` | Prevents MIME-sniffing |
| `Strict-Transport-Security` | Enforces HTTPS |
| `Referrer-Policy` | Controls referrer information |
| `Permissions-Policy` | Restricts browser feature access |
| `Expect-CT` | Enforces Certificate Transparency |

Returns `{ missing: [...], weak: [...], score: int }`.

---

### 4.4 PDF Report Generator

#### `scanner/generate_pdf.py`

CLI entry point for PDF generation. Called by `reportService.js` with a path to a temporary JSON file.

Steps:
1. Reads and parses the scan JSON from the temporary file.
2. Normalises the `findings` list (maps raw scanner output to structured finding objects with `owasp` and `severity` defaults).
3. Calls `generate_report(scan_data)` from `report_generator.py`.
4. Prints the absolute output file path to `stdout` (read back by Node.js).

---

#### `scanner/report_generator.py`

**`generate_report(scan_data)`** → `str (file_path)`

Uses **ReportLab** to build a professional PDF report including:
- Cover page with target URL, scan date, and overall risk rating.
- Executive summary section.
- Per-finding pages: vulnerability type, OWASP category, severity badge, description, affected URL, parameter, and payload evidence.
- Saves output to `scanner/reports/scan-report-<scanId>.pdf`.

---

## 5. API Endpoint Reference

### Authentication (`/api/auth`)

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/signup` | ❌ | `{ name, email, password }` | `{ message }` |
| POST | `/login` | ❌ | `{ email, password }` | `{ user, token }` |
| GET | `/me` | ✅ | — | `User` object |
| POST | `/accept-scanner-agreement` | ✅ | — | `{ message, user }` |
| POST | `/verify-otp` | ❌ | `{ email, otp }` | `{ token, user }` |
| POST | `/resend-otp` | ❌ | `{ email }` | `{ message }` |
| POST | `/forgot-password` | ❌ | `{ email }` | `{ message }` |
| POST | `/reset-password` | ❌ | `{ token, password }` | `{ message }` |
| GET | `/google` | ❌ | — | Redirect to Google |
| GET | `/google/callback` | ❌ | — | Redirect to frontend with token |

### Scanner (`/api`)

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/scan` | ✅ | `{ target }` | `Scan` document |
| GET | `/scans` | ✅ | — | `Scan[]` |
| GET | `/report/:id` | ✅ | — | PDF file download |

### Payment (`/api/payment`)

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/create-order` | ✅ | `{ plan }` | `{ orderId, amount, currency, plan }` |
| POST | `/verify` | ✅ | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, plan }` | `{ message, scanCredits }` |

### Other (`/api`)

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/contact` | ❌ | `{ name, email, message }` | `{ message }` |
| GET | `/health` | ❌ | — | `{ status }` |

---

## 6. Authentication & Security Flow

```
Signup
──────
1. POST /api/auth/signup  →  hash password, generate OTP, send email
2. POST /api/auth/verify-otp  →  validate OTP, mark isVerified=true, return JWT

Login (email/password)
──────────────────────
1. POST /api/auth/login  →  check isVerified, compare bcrypt hash, return JWT

Login (Google OAuth)
────────────────────
1. GET /api/auth/google  →  redirect to Google consent page
2. GET /api/auth/google/callback  →  Passport creates/finds user, redirects to
   FRONTEND_URL/oauth-success?token=<jwt>
3. OAuthSuccess.jsx reads the token from URL and calls AuthContext.login()

Protected API calls
───────────────────
1. Frontend attaches  Authorization: Bearer <token>  via Axios interceptor
2. protect() middleware verifies token, loads user, checks isVerified
3. req.user is available in every controller

Password Reset
──────────────
1. POST /api/auth/forgot-password  →  generate 32-byte hex token (15 min TTL), email link
2. POST /api/auth/reset-password   →  validate token, re-hash password, clear token
```

---

## 7. Scan & Credit Flow

```
1. User opens /scanner page
2. ClickwrapAgreement modal shown if scannerAgreementAccepted is false
   → POST /api/auth/accept-scanner-agreement
3. User enters a target URL, clicks "Scan"
4. POST /api/scan
   a. protect() verifies JWT
   b. scanCredits <= 0  →  403 "Scan limit reached"
   c. runPythonScan(target)  →  spawns Python engine, parses JSON output
   d. mapFindings(results)   →  enriches findings with OWASP metadata
   e. Scan document saved to MongoDB
   f. scanCredits -= 1, user saved
   g. Scan document returned to frontend
5. Frontend renders findings table + severity doughnut chart
6. User clicks "Download Report"
   → GET /api/report/:id
   → generatePDF(scanData) via Python reportlab
   → PDF streamed to browser
```

---

## 8. Payment Flow

```
1. User visits /pricing, selects a plan
2. POST /api/payment/create-order  →  Razorpay order created (amount in paise)
3. Frontend opens Razorpay checkout modal (using VITE_RAZORPAY_KEY_ID)
4. User completes payment inside Razorpay's hosted UI
5. Razorpay calls success handler with { orderId, paymentId, signature }
6. POST /api/payment/verify
   a. protect() verifies JWT
   b. HMAC-SHA256 of "orderId|paymentId" computed with RAZORPAY_KEY_SECRET
   c. Compared against razorpay_signature  →  400 on mismatch
   d. scanCredits += plan.credits, role = "PAID", user saved
   e. Returns { message, scanCredits }
7. Frontend calls updateCredits() to reflect new credit balance in the UI
```

---

## 9. Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | HTTP port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 Client Secret |
| `EMAIL_USER` | Gmail address used by Nodemailer |
| `EMAIL_PASS` | Gmail app-specific password |
| `FRONTEND_URL` | Frontend origin for CORS and redirect links (e.g. `http://localhost:5173`) |
| `RAZORPAY_KEY_ID` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key (used server-side for signature verification) |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key exposed to the browser (must start with `VITE_`) |

---

## 10. How to Run the Project

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+ and pip
- A running MongoDB instance or MongoDB Atlas account
- Google Cloud project with OAuth 2.0 credentials
- Razorpay test account
- Gmail account with an app-specific password

### Setup

```bash
# 1. Install backend dependencies
cd backend && npm install

# 2. Install Python scanner dependencies
cd ../scanner && pip install -r requirements.txt

# 3. Install frontend dependencies
cd ../frontend && npm install

# 4. Create backend environment file
cp backend/.env.example backend/.env
# Edit backend/.env and fill in all variables listed above

# 5. Create frontend environment file
echo "VITE_RAZORPAY_KEY_ID=<your_key>" > frontend/.env
```

### Running in Development

```bash
# Terminal 1 — Backend API (with nodemon auto-reload)
cd backend && npm run dev

# Terminal 2 — Frontend dev server (Vite HMR)
cd frontend && npm run dev
```

### Building for Production

```bash
cd frontend && npm run build   # outputs to frontend/dist/
cd frontend && npm run preview # preview the production build locally
```

### Running the Scanner Directly

```bash
cd <project-root>
python -m scanner.engine http://target-url.com
```

### Running the Linter

```bash
cd frontend && npm run lint
```

### Health Check

```
GET http://localhost:5000/api/health
→ { "status": "Backend is healthy 🚀" }
```
