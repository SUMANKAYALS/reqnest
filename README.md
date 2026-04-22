<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0ea5e9,100:6366f1&height=200&section=header&text=Reqnest&fontSize=80&fontColor=ffffff&fontAlignY=38&desc=A%20Middleware-Driven%20HTTP%20Client%20for%20JavaScript&descAlignY=60&descSize=18" width="100%" />

<br/>

[![npm version](https://img.shields.io/npm/v/reqnest?color=0ea5e9&label=npm&style=flat-square)](https://www.npmjs.com/package/reqnest)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-f59e0b?style=flat-square)](CONTRIBUTING.md)
[![Made in India](https://img.shields.io/badge/Made%20in-India%20🇮🇳-ff9933?style=flat-square)](https://github.com/SUMANKAYALS)

<br/>

**Build, control, and extend HTTP requests like a backend engineer.**

*Reqnest gives you full ownership over the request lifecycle —*
*nothing is hidden, everything is composable.*

<br/>

[**Getting Started**](#-installation) · [**Plugins**](#-plugins) · [**API Docs**](#-api-reference) · [**vs Axios**](#-reqnest-vs-axios) · [**Roadmap**](#-roadmap)

<br/>

</div>

---

## 🤔 Why Reqnest?

Most HTTP clients treat the request lifecycle as an implementation detail. You get a black box that *usually works* — until you need something custom, and then you're monkey-patching interceptors and praying nothing breaks.

**Reqnest is different.** It exposes the full pipeline through a clean middleware system, so you can add caching, retries, deduplication, and rate limiting as composable layers — without touching the core.

```
Your App  →  [dedupe]  →  [cache]  →  [rateLimit]  →  [dispatch]  →  Network
         ←  [dedupe]  ←  [cache]  ←  [rateLimit]  ←  [dispatch]  ←
```

---

## ✨ Features

<table>
  <tr>
    <td>🌐 <b>Fetch-based</b></td>
    <td>Works natively in Node.js 18+ and all modern browsers</td>
  </tr>
  <tr>
    <td>🔗 <b>Middleware pipeline</b></td>
    <td>Koa-inspired <code>async (ctx, next)</code> composition</td>
  </tr>
  <tr>
    <td>🔁 <b>Auto-retry</b></td>
    <td>Retry failed requests N times automatically</td>
  </tr>
  <tr>
    <td>🧠 <b>Smart caching</b></td>
    <td>In-memory cache — skip redundant network calls</td>
  </tr>
  <tr>
    <td>🔄 <b>Deduplication</b></td>
    <td>Identical concurrent requests collapsed into one</td>
  </tr>
  <tr>
    <td>🚦 <b>Rate limiting</b></td>
    <td>Cap concurrent requests to protect your API</td>
  </tr>
  <tr>
    <td>⏱ <b>Timeout & cancellation</b></td>
    <td>Auto-abort slow requests, or cancel manually via <code>AbortSignal</code></td>
  </tr>
  <tr>
    <td>🔌 <b>Plugin architecture</b></td>
    <td>Register composable plugins per instance</td>
  </tr>
</table>

---

## 📦 Installation

```bash
npm install reqnest
# or
yarn add reqnest
# or
pnpm add reqnest
```

> Requires **Node.js 18+** or a modern browser with native `fetch` support.

---

## 🚀 Quick Start

```js
import reqnest from "reqnest";

const res = await reqnest.get("https://jsonplaceholder.typicode.com/posts");

console.log(res.data);    // parsed JSON
console.log(res.status);  // 200
```

---

## ⚙️ Custom Instance

Create isolated client instances with their own base URL, headers, and middleware stack.

```js
import { create, dispatch } from "reqnest";

const api = create({
  baseURL: "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_TOKEN",
  },
  timeout: 8000,
});

// dispatch must always be the LAST middleware — it sends the actual request
api.use(dispatch);

const res = await api.get("/users");
```

> ⚠️ **Always register `dispatch` last.** It is the terminal handler that performs the real HTTP call.

---

## 🔌 Plugins

Plugins are the superpower of Reqnest. Chain them in any order — each one is a focused, reusable middleware.

```js
import { create, dispatch, cachePlugin, dedupe, rateLimit } from "reqnest";

const api = create({ baseURL: "https://api.example.com" });

api.use(dedupe);        // 🔄 collapse identical concurrent requests into one
api.use(cachePlugin);   // 🧠 cache responses, skip repeat network calls
api.use(rateLimit(3));  // 🚦 max 3 concurrent requests at any time
api.use(dispatch);      // 📡 send the request (always last)
```

### Plugin Execution Order

Middleware runs **top-to-bottom** on the way out, and **bottom-to-top** on the way back:

```
Request  →  dedupe  →  cache  →  rateLimit  →  dispatch  →  🌐
Response ←  dedupe  ←  cache  ←  rateLimit  ←  dispatch  ←  🌐
```

---

## 📡 Request Methods

```js
// GET
await api.get("/posts");

// POST
await api.post("/posts", {
  title: "Hello Reqnest",
  body: "Middleware is everything.",
});

// PUT — full replacement
await api.put("/posts/1", { id: 1, title: "New Title", body: "New body" });

// PATCH — partial update
await api.patch("/posts/1", { title: "Just the title" });

// DELETE
await api.delete("/posts/1");
```

---

## 📘 API Reference

### Request Config

```js
api.get("/users", {
  params: { page: 1, limit: 10 },       // → appended as ?page=1&limit=10
  headers: { Authorization: "Bearer token" },
  timeout: 5000,                         // abort after 5 seconds
  retry: 3,                              // retry up to 3 times on failure
  cache: true,                           // use cachePlugin if registered
  signal: controller.signal,            // manual AbortSignal
  transformRequest: (data) => data,      // transform outgoing body
  transformResponse: (data) => data,     // transform incoming response
});
```

### Full Config Type

```ts
interface ReqnestConfig {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
  baseURL?: string;

  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;

  timeout?: number;
  signal?: AbortSignal;
  retry?: number;
  cache?: boolean;

  transformRequest?: (data: any) => any;
  transformResponse?: (data: any) => any;
}
```

### Response Format

```ts
interface ReqnestResponse<T = any> {
  data: T;                          // parsed JSON body
  status: number;                   // e.g. 200
  statusText: string;               // e.g. "OK"
  headers: Record<string, string>;  // response headers
  raw: Response;                    // original fetch Response object
}
```

---

## ❌ Error Handling

Reqnest throws structured errors on all non-2xx responses. No more manually checking `response.ok`.

```js
try {
  await api.get("/not-found");
} catch (err) {
  console.log(err.message);  // "Not Found"
  console.log(err.status);   // 404
  console.log(err.data);     // server error body (if any)
}
```

---

## 🧩 Middleware System

Write your own middleware to hook into any part of the request lifecycle.

```ts
// Signature
type Middleware = (ctx: Context, next: () => Promise<void>) => Promise<void>;

interface Context {
  config: ReqnestConfig;        // outgoing request config (mutate to modify)
  response?: ReqnestResponse;   // set after dispatch runs
}
```

### Auth Middleware

```js
api.use(async (ctx, next) => {
  const token = localStorage.getItem("token");
  if (token) {
    ctx.config.headers = {
      ...ctx.config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  await next();
});
```

### Logging Middleware

```js
api.use(async (ctx, next) => {
  const start = Date.now();
  console.log(`→ ${ctx.config.method} ${ctx.config.url}`);

  await next();

  const ms = Date.now() - start;
  console.log(`← ${ctx.response.status} in ${ms}ms`);
});
```

### Error Reporting Middleware

```js
api.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    myErrorTracker.capture({ url: ctx.config.url, status: err.status });
    throw err; // always re-throw so callers still receive the error
  }
});
```

---

## 🔬 Plugin Deep Dives

### 🔁 Retry

Auto-retries on network error or 5xx. Won't retry 4xx client errors.

```js
// Retry up to 3 times before throwing
await api.get("/flaky-endpoint", { retry: 3 });
```

---

### 🧠 Cache

Caches responses in-memory by URL + query params. Second identical request is instant — zero network.

```js
api.use(cachePlugin);

const a = await api.get("/posts");  // → network call
const b = await api.get("/posts");  // → cache hit ⚡ (no network)
```

---

### 🔄 Deduplication

Collapses simultaneous identical requests into a single network call. All callers resolve with the same data.

```js
api.use(dedupe);

// 3 requests fire at the same time
const [a, b, c] = await Promise.all([
  api.get("/posts"),
  api.get("/posts"),
  api.get("/posts"),
]);
// ☝️ Only ONE network request was made
```

---

### 🚦 Rate Limiting

Queues requests and enforces a concurrency cap to protect your server or stay within API limits.

```js
api.use(rateLimit(2)); // max 2 in-flight at a time

await Promise.all([
  api.get("/item/1"),  // ← starts immediately
  api.get("/item/2"),  // ← starts immediately
  api.get("/item/3"),  // ← queued
  api.get("/item/4"),  // ← queued
]);
```

---

## ⚖️ Reqnest vs Axios

| Feature | Reqnest | Axios |
|---|:---:|:---:|
| Middleware pipeline | ✅ | ❌ |
| Plugin system | ✅ | ❌ |
| Full lifecycle control | ✅ | ❌ |
| Built on Fetch API | ✅ | ❌ (XHR) |
| Request deduplication | ✅ | ❌ |
| Smart caching | ✅ | ❌ |
| Rate limiting | ✅ | ❌ |
| TypeScript support | ✅ | ✅ |
| Extensibility | 🔥 High | ⚠️ Limited |

---

## 🏗 Architecture

Reqnest is inspired by three ideas:

| Inspiration | What it contributes |
|---|---|
| **Koa.js** | Async middleware composition with `next()` |
| **Fetch API** | Native, modern transport layer |
| **Redux middleware** | Predictable, composable pipeline |

The core engine is intentionally tiny. Every advanced feature lives in its own isolated plugin — you only pay the cost of what you register.

---

## 📂 Project Structure

```
reqnest/
├── src/
│   ├── core/
│   │   ├── client.ts        # create() factory and instance logic
│   │   ├── compose.ts       # middleware composition engine
│   │   ├── dispatch.ts      # fetch-based terminal middleware
│   │   └── context.ts       # Context type definitions
│   │
│   ├── plugins/
│   │   ├── cache.ts         # in-memory caching
│   │   ├── dedupe.ts        # request deduplication
│   │   ├── rateLimit.ts     # concurrency limiting
│   │   └── retry.ts         # auto-retry logic
│   │
│   ├── types/
│   │   └── index.ts         # shared TypeScript interfaces
│   │
│   └── utils/
│       ├── buildURL.ts      # URL + query param serialization
│       └── parseResponse.ts # response parsing helpers
│
├── tests/
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗺 Roadmap

- [ ] 🔥 **Interceptors** — request/response hooks (cleaner than Axios)
- [ ] 🔥 **GraphQL support** — first-class `gql()` helper
- [ ] 🔥 **SSR support** — cookie forwarding for server-side rendering
- [ ] 🔥 **Devtools** — browser extension for request inspection
- [ ] 🔥 **Persistent cache** — IndexedDB / localStorage adapter
- [ ] 🔥 **npm publish** — official release on the npm registry

---

## 👨‍💻 Author

<div align="center">

**Suman Kayal** · *Sky*

Full-Stack Developer · MERN Stack · Real-time Systems · AI Tooling

[![GitHub](https://img.shields.io/badge/GitHub-SUMANKAYALS-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SUMANKAYALS)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Suman%20Kayal-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com)
[![Instagram](https://img.shields.io/badge/Instagram-Sky-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com)

*Built in Kolkata, India 🇮🇳*

</div>

---

## ⭐ Support

If Reqnest saved you time or taught you something:

- ⭐ **Star** this repo
- 🍴 **Fork** it and build something cool
- 📣 **Share** it with your dev community
- 🐛 **Open issues** for bugs or feature ideas
- 🤝 **Contribute** — PRs are always welcome

---

## 📄 License

MIT © [Suman Kayal](https://github.com/SUMANKAYALS)

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366f1,100:0ea5e9&height=100&section=footer" width="100%" />

*Built with obsession. Designed for control. Made to be extended.*

</div>