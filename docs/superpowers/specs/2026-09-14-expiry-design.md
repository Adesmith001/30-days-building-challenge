# Expiry — Day 14 Design

## Summary

Expiry is a privacy-focused web application for sharing encrypted text through temporary links. Creators authenticate with Google, create named secrets, choose an expiration rule, and retain a private metadata history. Recipients do not need an account. The central product rule is: **the history survives; the secret does not.**

The implementation will recreate `day-14-expiry` as a React 19, Vite, and TypeScript application consistent with the surrounding 30-days repository. Vercel-compatible API routes will isolate privileged Appwrite access from the browser. A local demo adapter will keep the complete interface usable without credentials while making its same-browser limitation explicit.

## Scope

### Included

- Google OAuth through Appwrite for production creators
- A credential-free local demo sign-in for development and review
- Auth-protected create and history experiences
- Public recipient links with no login requirement
- Named text secrets up to 10,000 characters
- Browser-side AES-GCM encryption
- One-view and time-based expiration
- Custom date/time expiration
- Native Web Share API with a safe desktop fallback
- Persistent metadata history with all, active, and expired filters
- Active and expired history details
- Re-sharing active links
- Recreating an expired secret with only its title prefilled
- Manual secret destruction and history deletion
- Copy deterrence within the revealed-secret surface
- Responsive desktop and mobile layouts
- Automated unit, component, API-contract, and browser-flow tests
- Appwrite provisioning documentation and a schema setup script

### Excluded

- File uploads
- Email/password authentication
- Recipient authentication
- Teams, workspaces, folders, profiles, analytics, or statistics
- Recovery of expired or destroyed plaintext
- Claims that browser-delivered text is impossible to extract
- A durable production rate limiter outside Appwrite/platform limits

## Product Experience

### Visual direction

The application uses an editorial, nearly monochrome visual language: warm off-white background, white working surfaces, near-black text, neutral secondary text, hairline borders, muted green for active states, and muted red for destructive states. It uses no gradients, glass effects, decorative illustrations, dashboard card grids, or sidebar. Typography, whitespace, and clear state transitions carry the interface.

The content column remains narrow enough to feel private and focused. Controls are tactile but restrained, with modest corner radii and little or no shadow. Motion is limited to 150–250 ms transitions that explain changes such as create-to-success and reveal-to-message. Reduced-motion preferences are respected.

### Authentication

Unauthenticated creators see the minimal login screen from the PRD with the Expiry wordmark, product statement, and `Continue with Google`. When Appwrite is not configured in development, the same screen shows a clearly labeled `Continue in demo mode` action. Demo mode is never presented as production authentication.

Appwrite OAuth returns to the create route. The application restores the Appwrite session on load, exposes the creator's name and email in a compact avatar menu, and supports sign-out. Authentication failures return to the login screen with a calm inline error.

### Create flow

The authenticated home route is the creation interface. It contains a message textarea, live `0 / 10,000` counter, required name, expiry selector, custom date/time field when selected, create button, and browser-encryption note.

Submitting validates trimmed message and title, validates that a custom expiry is in the future, creates a random AES-GCM key and IV in the browser, encrypts the message, and sends only ciphertext and metadata to the API. The generated link has the form `/s/{secretId}#{base64urlKey}`. The key is never sent in the request body, stored in Appwrite, written to history, or logged by application code.

The success state shows the title, expiration explanation, visible link, `Share link`, `Show link`, and `Create another`. Native sharing is used when available. The fallback reveals/selects the URL and provides a deliberate copy action only where the browser cannot share; the product does not pretend that links can be shared without exposing them.

### History

History is a vertical list separated by fine rules, not a dashboard. Filters are `All`, `Active`, and `Expired`. Active includes records whose backing secret is still revealable; expired includes consumed, expired, and manually destroyed records.

An active detail page shows title, status, creation date, expiration rule, views, share URL, share action, and `Destroy now`. It never fetches or displays the plaintext. An expired detail page explains that the contents cannot be recovered and offers `Create new link` and `Delete from history`.

Recreating from history navigates to Create with only the title prefilled. The textarea is empty and the expiry resets to `After opening`.

### Recipient flow

Opening `/s/{id}#{key}` shows a pre-reveal screen. No API reveal call occurs during route loading, preventing link-preview requests from consuming the message. Only pressing `Reveal message` sends the reveal request.

On success, the API atomically consumes or updates the secret and returns its ciphertext and IV. The browser decrypts them using the fragment key and holds plaintext only in component memory. Refreshing cannot retrieve a consumed one-view secret. Invalid, consumed, expired, destroyed, and nonexistent identifiers share the same generic gone state.

Time-based secrets are not burned on first view and remain revealable until their deadline. Their successful view count is incremented. The screen shows a quiet human-readable remaining duration rather than a gamified countdown.

The revealed content is rendered as text, never HTML. Its container disables text selection and dragging, blocks copy/cut/context-menu events, and intercepts normal Ctrl/Cmd+C shortcuts while focused. Buttons, links, scrolling, keyboard navigation, and normal page interaction remain available. The UI states plainly that this is deterrence, not guaranteed copy prevention.

## Architecture

### Frontend

The frontend remains a small Vite SPA. Route selection uses the browser History API through a compact internal router because the product has only a handful of static route shapes; React Router is unnecessary. Screens are split by user-visible state, while encryption, formatting, API access, authentication, and demo persistence remain independent modules with small typed interfaces.

Primary route shapes:

- `/` — login or authenticated Create
- `/history` — creator history
- `/history/{historyId}` — creator history detail
- `/s/{secretId}` — public recipient flow; fragment contains the key

The application shell owns session restoration and navigation. Creator APIs obtain a fresh Appwrite JWT and pass it as a Bearer token. The public reveal API requires no creator session.

### Server API

Vercel-compatible handlers expose:

- `POST /api/secrets` — authenticated creation
- `GET /api/history` — authenticated history listing
- `GET /api/history/{id}` — authenticated history detail
- `DELETE /api/history/{id}` — authenticated history deletion; destroys an active secret first
- `POST /api/secrets/{id}/reveal` — public reveal and consumption
- `POST /api/secrets/{id}/destroy` — authenticated manual destruction

Shared server utilities parse and validate JSON, enforce body limits, normalize responses, validate Appwrite JWTs, avoid leaking resource existence, and map expected errors to stable status codes. Secret IDs are generated with Appwrite's unique ID facility or equivalent cryptographically random bytes.

The public reveal endpoint uses an Appwrite transaction. It reads the current secret state in transaction context, rejects unavailable or elapsed records, stages the secret mutation/deletion and matching history update, and commits. Transaction conflicts retry once; a second conflict returns the generic unavailable response. A one-view reveal removes encrypted content as part of the committed operation. Time-based reveal increments `viewCount` and preserves ciphertext until expiry or manual destruction.

### Appwrite data model

The implementation uses one database and two tables.

`secrets` columns:

- `$id`: string identifier
- `ownerId`: required string
- `ciphertext`: required string
- `iv`: required string
- `expiresAt`: nullable datetime
- `expiryType`: required enum-like string (`after_opening`, `time`)
- `maxViews`: nullable integer; `1` for after-opening
- `viewCount`: required integer, default `0`
- `status`: required enum-like string (`active`, `consumed`, `expired`, `destroyed`)
- `consumedAt`: nullable datetime
- `$createdAt`: Appwrite timestamp

`history` columns:

- `$id`: string identifier
- `secretId`: required string, indexed
- `ownerId`: required string, indexed
- `title`: required string, maximum 120 characters
- `expiryType`: required string
- `expiresAt`: nullable datetime
- `status`: required string
- `viewCount`: required integer, default `0`
- `consumedAt`: nullable datetime
- `$createdAt`: Appwrite timestamp

Secret rows are server-only. History rows receive creator-specific read/update/delete permissions and are queried through a JWT-scoped Appwrite client where practical. The API key is used only for public reveal and maintenance operations and is never exposed through a `VITE_` variable.

Expired encrypted payloads are deleted lazily when encountered by reveal/history operations. The setup documentation also describes an optional scheduled cleanup function for production hygiene, but the Day 14 application does not require a scheduler to enforce expiry because reveal always checks the server-side deadline.

### Demo adapter

When the public Appwrite configuration is absent, the frontend uses a demo repository backed by localStorage. It implements the same domain operations and enforces the same expiry rules in the current browser. Demo links are explicitly labeled `This-browser demo link`; they cannot be opened on another device or browser profile. This adapter exists for local development and visual review, not as a production fallback.

The domain layer does not branch throughout the UI. It selects either the remote API adapter or the demo adapter once at startup.

## Environment and Setup

The gitignored `.env` and committed `.env.example` contain:

```text
VITE_APPWRITE_ENDPOINT=
VITE_APPWRITE_PROJECT_ID=
VITE_APP_URL=http://localhost:5173
APPWRITE_ENDPOINT=
APPWRITE_PROJECT_ID=
APPWRITE_API_KEY=
APPWRITE_DATABASE_ID=expiry
APPWRITE_SECRETS_TABLE_ID=secrets
APPWRITE_HISTORY_TABLE_ID=history
```

Real credentials cannot be fabricated. Empty values intentionally activate demo mode. The README will document Google provider configuration, allowed web origins, OAuth success/failure URLs, required API key scopes, schema provisioning, local development, testing, and Vercel deployment.

## Validation and Error Handling

- Title: trimmed, 1–120 characters
- Message: trimmed content required, maximum 10,000 characters
- Expiry: supported preset or valid future custom timestamp
- Request bodies: reject malformed JSON, unknown expiry values, and oversized strings
- Ciphertext/IV: validate base64url shape and conservative maximum size server-side
- Authentication: return 401 without distinguishing user lookup details
- Reveal: return the same 404-style unavailable response for missing, expired, consumed, destroyed, or unauthorized records
- Decryption: show a specific local error explaining that the link key is missing or invalid without claiming the secret exists
- Network errors: preserve entered create-form values and offer retry
- Empty history: explain the state and link back to Create

## Security and Privacy Boundaries

- Plaintext exists only in the creator's browser before encryption and the recipient's browser after decryption.
- The URL fragment key is not sent by browsers in HTTP requests, but it can still leak through screenshots, extensions, client-side analytics, or deliberate sharing. No analytics SDK is included.
- The API never accepts plaintext and application logging excludes request bodies.
- Ciphertext alone remains sensitive metadata and is readable only by privileged server code.
- All production traffic must use HTTPS.
- API validation and platform rate limits provide baseline abuse resistance. A globally durable rate limiter is deferred until real traffic justifies an external rate-limit store.
- Copy blocking is a usability deterrent only. Recipients can still use developer tools, accessibility tooling, screenshots, cameras, or modified clients.

## Testing Strategy

Implementation follows test-first development for domain behavior.

Unit tests cover:

- AES-GCM encryption/decryption round trips
- different keys failing to decrypt
- base64url key serialization
- preset and custom expiry calculation
- active/expired/consumed status derivation
- form validation and 10,000-character limits
- fragment parsing and missing-key behavior
- human-readable expiry labels

Repository/API contract tests cover:

- creator identity being attached to new records
- plaintext and encryption keys never appearing in persistence payloads
- one-view reveal succeeding once and then returning unavailable
- time-based reveal remaining available before its deadline
- elapsed secrets returning the generic gone response
- history retaining metadata after secret destruction
- recreation prefilling title only
- owner isolation for history actions

Component/browser tests cover:

- demo sign-in to create flow
- create to generated-link transition
- recipient pre-reveal not consuming a secret
- reveal, refresh, and gone state
- history filtering, details, destruction, deletion, and recreation
- native-share fallback behavior
- copy/context-menu deterrence on revealed content
- keyboard navigation and mobile layouts around 375 px

Final verification runs type checking, tests, lint, production build, browser interaction checks, console-error inspection, and screenshot review at desktop and mobile sizes.

## Acceptance Criteria

The build is complete when:

1. A user can enter demo mode without credentials and exercise every core screen in one browser.
2. With documented Appwrite credentials, a creator can sign in through Google and create a secret whose plaintext and key never reach Appwrite.
3. A recipient can open a shared link without authentication, explicitly reveal it, and decrypt it locally.
4. An after-opening secret cannot be successfully revealed twice, including competing reveal attempts.
5. A time-based secret becomes unavailable when its deadline passes regardless of client clock display.
6. Creator history retains title and lifecycle metadata but never plaintext or encryption keys.
7. Active links can be re-shared and destroyed; expired entries can be recreated with title only or removed from history.
8. Invalid and unavailable public links do not disclose whether a secret previously existed.
9. The interface is polished and fully usable at 375 px and desktop widths.
10. Automated checks, lint, type checking, production build, and critical browser flows pass without console errors.

## Implementation Order

1. Recreate the Vite scaffold and test harness.
2. Build and test domain types, validation, expiry, routing, and encryption.
3. Build and test the demo repository for credential-free end-to-end behavior.
4. Implement the visual shell and all creator/recipient states against the repository interface.
5. Add Appwrite authentication and the remote API adapter.
6. Add Vercel API handlers, Appwrite transactions, and provisioning tooling.
7. Complete responsive, accessibility, and copy-deterrence behavior.
8. Run the full verification and visual QA loop.
