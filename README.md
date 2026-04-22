<div align="center">

<br/>

```
██████╗ ███████╗ ██████╗ ███╗   ██╗███████╗███████╗████████╗
██╔══██╗██╔════╝██╔═══██╗████╗  ██║██╔════╝██╔════╝╚══██╔══╝
██████╔╝█████╗  ██║   ██║██╔██╗ ██║█████╗  ███████╗   ██║   
██╔══██╗██╔══╝  ██║▄▄ ██║██║╚██╗██║██╔══╝  ╚════██║   ██║   
██║  ██║███████╗╚██████╔╝██║ ╚████║███████╗███████║   ██║   
╚═╝  ╚═╝╚══════╝ ╚══▀▀═╝ ╚═╝  ╚═══╝╚══════╝╚══════╝   ╚═╝   
```

### A Middleware-Driven HTTP Client for JavaScript

<br/>

[![npm version](https://img.shields.io/npm/v/reqnest?color=0ea5e9&label=npm&style=for-the-badge)](https://www.npmjs.com/package/reqnest)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-f59e0b?style=for-the-badge)](CONTRIBUTING.md)
[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-ef4444?style=for-the-badge)](https://github.com/SUMANKAYALS)

<br/>

> **Build, control, and extend HTTP requests like a backend engineer.**  
> Reqnest gives you *full ownership* over the request lifecycle — nothing is hidden, everything is composable.

<br/>

[Installation](#-installation) · [Quick Start](#-quick-start) · [Plugins](#-plugins) · [API Reference](#-api-reference) · [Comparison](#-reqnest-vs-axios) · [Roadmap](#-roadmap)

</div>

---

## 🧭 Table of Contents

- [Why Reqnest?](#-why-reqnest)
- [Core Concept](#-core-concept)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Custom Instances](#-creating-a-custom-instance)
- [Plugins](#-plugins)
- [Request Methods](#-request-methods)
- [Configuration Options](#-configuration-options)
- [Response Format](#-response-format)
- [Error Handling](#-error-handling)
- [Middleware System](#-middleware-system)
- [Plugin Deep Dives](#-plugin-deep-dives)
- [Use Cases](#-use-cases)
- [Reqnest vs Axios](#-reqnest-vs-axios)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Author](#-author)
- [License](#-license)

---

## 🤔 Why Reqnest?

Most HTTP clients abstract away the request lifecycle and give you no real control. You get a black box that *usually* works — until you need something custom, and then you're hacking around interceptors and praying.

| Problem with existing clients | How Reqnest solves it |
|---|---|
| ❌ Black-box abstractions | ✅ Full request/response lifecycle exposed |
| ❌ Hard-to-extend internals | ✅ Composable middleware pipeline |
| ❌ No plugin system | ✅ First-class plugin architecture |
| ❌ Fetch API not utilized | ✅ Built natively on `fetch` |
| ❌ Tight coupling | ✅ Each concern is a separate, swappable module |

> Reqnest is built for developers who want to **understand and own** what happens inside their HTTP layer.

---

## 🧠 Core Concept

Every request in Reqnest flows through a **middleware pipeline** — just like Koa, but for HTTP clients.

```
┌────────────────────────────────────────────────────┐
│                   YOUR APPLICATION                  │
└──────────────────────┬─────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────┐
│              MIDDLEWARE PIPELINE                    │
│                                                    │
│   [dedupe] → [rateLimit] → [cache] → [dispatch]    │
│                                                    │
│   Each middleware can:                             │
│   ✦ Modify the request before it goes out         │
│   ✦ Short-circuit the chain (cache hit)           │
│   ✦ Transform the response on the way back        │
└──────────────────────┬─────────────────────────────┘
                       │
                       ▼
                  HTTP NETWORK
```

This pattern gives you:
- 🧩 **Composability** — mix and match behaviors
- 🔁 **Reusability** — write a middleware once, use everywhere
- 🧪 **Testability** — mock or swap any layer

---

## ✨ Features

### 🔥 Core Features

| Feature | Description |
|---|---|
| 🌐 Fetch-based | Works natively in Node.js and the browser |
| 🔗 Middleware pipeline | Koa-inspired `async (ctx, next)` pattern |
| ⚙️ Full lifecycle control | Hook into every phase of a request |
| 🧠 Transformers | Transform request body and response data |
| ⏱ Timeout support | Auto-abort requests that take too long |
| 🚫 Cancellation | Cancel in-flight requests via `AbortSignal` |
| ❌ Structured errors | Rich error objects with status, data, and message |

### ⚡ Advanced Features

| Feature | Description |
|---|---|
| 🔁 Retry mechanism | Auto-retry failed requests N times |
| 🧠 Smart caching | Cache responses, skip redundant network calls |
| 🔄 Request deduplication | Multiple identical requests → one network call |
| 🚦 Rate limiting | Cap concurrent requests at any limit |
| 📦 Raw response access | Access the raw `fetch` Response object |
| 🔌 Plugin architecture | Register composable plugins per instance |

---

## 📦 Installation

```bash
# Using npm
npm install reqnest

# Using yarn
yarn add reqnest

# Using pnpm
pnpm add reqnest
```

> **Requirements:** Node.js 18+ or any modern browser with `fetch` support.

---

## 🚀 Quick Start

```js
import reqnest from "reqnest";

const res = await reqnest.get("https://jsonplaceholder.typicode.com/posts");

console.log(res.data);     // parsed JSON body
console.log(res.status);   // 200
```

That's it. Zero configuration needed to get started.

---

## ⚙️ Creating a Custom Instance

Create isolated client instances — each with their own base URL, headers, and middleware stack.

```js
import { create, dispatch } from "reqnest";

const api = create({
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_TOKEN",
  },
  timeout: 8000,
});

// dispatch is required — it's the middleware that actually sends the request
api.use(dispatch);

const res = await api.get("/posts");
console.log(res.data);
```

> ⚠️ **Important:** Always register `dispatch` as the **last** middleware. It is the terminal handler that performs the actual HTTP call.

---

## 🔌 Plugins

Plugins are the superpower of Reqnest. They're just middleware — but purpose-built.

```js
import { create, dispatch, cachePlugin, dedupe, rateLimit } from "reqnest";

const api = create({
  baseURL: "https://api.example.com",
});

api.use(dedupe);        // 🔄 Collapse identical concurrent requests
api.use(cachePlugin);   // 🧠 Cache responses in-memory
api.use(rateLimit(3));  // 🚦 Max 3 concurrent requests at a time
api.use(dispatch);      // 📡 Send the request (always last)
```

### Plugin Execution Order

The order you register middleware **matters**:

```
Request →  dedupe  →  cache  →  rateLimit  →  dispatch  → Network
Response ←  dedupe  ←  cache  ←  rateLimit  ←  dispatch  ← Network
```

---

## 📡 Request Methods

Reqnest supports all standard HTTP methods:

```js
// GET
const posts = await api.get("/posts");

// POST
const newPost = await api.post("/posts", {
  title: "Hello Reqnest",
  body: "Middleware FTW",
  userId: 1,
});

// PUT (full replacement)
const updated = await api.put("/posts/1", {
  id: 1,
  title: "Updated Title",
  body: "Updated body",
  userId: 1,
});

// PATCH (partial update)
const patched = await api.patch("/posts/1", {
  title: "Just the Title Changed",
});

// DELETE
await api.delete("/posts/1");
```

---

## 📘 Configuration Options

Pass a config object as the second argument to any request method:

```js
api.get("/users", {
  params: { page: 1, limit: 10 },       // ?page=1&limit=10
  headers: {
    Authorization: "Bearer token",
  },
  timeout: 5000,                         // abort after 5 seconds
  retry: 3,                              // retry 3 times on failure
  cache: true,                           // use cachePlugin if registered
  signal: controller.signal,            // custom AbortSignal
  transformRequest: (data) => {
    return JSON.stringify(data);         // transform outgoing body
  },
  transformResponse: (data) => {
    return data.results;                 // unwrap a nested field
  },
});
```

### Full Config Type Reference

```ts
interface ReqnestConfig {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
  baseURL?: string;

  headers?: Record<string, string>;
  params?: Record<string, any>;        // Appended as query string
  data?: any;                          // Request body

  timeout?: number;                    // ms before auto-abort
  signal?: AbortSignal;                // For manual cancellation

  transformRequest?: (data: any) => any;
  transformResponse?: (data: any) => any;

  retry?: number;                      // Number of retry attempts
  cache?: boolean;                     // Enable response caching
}
```

---

## 📥 Response Format

Every successful response returns a consistent object:

```ts
interface ReqnestResponse<T = any> {
  data: T;                             // Parsed JSON body
  status: number;                      // HTTP status code (e.g. 200)
  statusText: string;                  // Status message (e.g. "OK")
  headers: Record<string, string>;     // Response headers
  raw: Response;                       // Original fetch Response object
}
```

**Example:**

```js
const res = await api.get("/posts/1");

console.log(res.data);        // { id: 1, title: "...", ... }
console.log(res.status);      // 200
console.log(res.statusText);  // "OK"
console.log(res.headers);     // { "content-type": "application/json", ... }
console.log(res.raw);         // Raw fetch Response
```

---

## ❌ Error Handling

Reqnest throws structured errors — no more manually checking `response.ok`.

```js
try {
  await api.get("/not-found");
} catch (err) {
  console.log(err.message);   // "Not Found"
  console.log(err.status);    // 404
  console.log(err.data);      // Server error body (if any)
}
```

### Error Object Shape

```ts
interface ReqnestError extends Error {
  message: string;
  status: number;
  data: any;
}
```

> Reqnest throws on **any non-2xx response** by default, keeping your `try/catch` logic simple and predictable.

---

## 🧩 Middleware System

This is where Reqnest gets powerful. Write your own middleware to hook into any part of the request lifecycle.

### Middleware Signature

```ts
type Middleware = (ctx: Context, next: () => Promise<void>) => Promise<void>;
```

### Context Object

```ts
interface Context {
  config: ReqnestConfig;           // The outgoing request config
  response?: ReqnestResponse;      // Set after dispatch runs
}
```

### Example: Logging Middleware

```js
api.use(async (ctx, next) => {
  const start = Date.now();
  console.log(`➡️  ${ctx.config.method} ${ctx.config.url}`);

  await next(); // call the rest of the pipeline

  const duration = Date.now() - start;
  console.log(`⬅️  ${ctx.response.status} — ${duration}ms`);
});
```

### Example: Auth Middleware

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

### Example: Error Reporting Middleware

```js
api.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // Send to your error tracking service
    reportError({ url: ctx.config.url, status: err.status });
    throw err; // re-throw so the caller still gets the error
  }
});
```

---

## 🔬 Plugin Deep Dives

### 🔁 Retry

Automatically retries the request on failure. Works great for flaky APIs and network hiccups.

```js
const res = await api.get("/unstable-endpoint", {
  retry: 3, // will retry up to 3 times before throwing
});
```

> Retries only happen on network errors or 5xx responses, not 4xx client errors.

---

### 🧠 Cache

Caches responses in-memory. The next identical request returns the cached result instantly — zero network call.

```js
api.use(cachePlugin);

// First call — hits the network
const res1 = await api.get("/posts");

// Second call — returns instantly from cache ⚡
const res2 = await api.get("/posts");
```

Cache keys are based on the full URL + query params.

---

### 🔄 Request Deduplication

When multiple parts of your app fire the same request simultaneously, Reqnest collapses them into one.

```js
api.use(dedupe);

// These fire at the exact same time
const [a, b, c] = await Promise.all([
  api.get("/posts"),
  api.get("/posts"),
  api.get("/posts"),
]);

// 👆 Only ONE network request was made. All three resolve with the same data.
```

This is a game-changer for dashboards, React renders, and any event-driven UI.

---

### 🚦 Rate Limiting

Cap the number of concurrent requests to protect your server or stay within API quotas.

```js
api.use(rateLimit(2)); // max 2 in-flight requests at a time

// If 5 requests fire at once, they'll queue up 2 at a time
await Promise.all([
  api.get("/item/1"),
  api.get("/item/2"),
  api.get("/item/3"),
  api.get("/item/4"),
  api.get("/item/5"),
]);
```

---

## 🎯 Use Cases

Reqnest is a great fit for:

| Scenario | Why Reqnest? |
|---|---|
| 🏗 Scalable frontend apps | Middleware keeps concerns cleanly separated |
| 🖧 Backend API clients | Full control with Node.js fetch support |
| 📦 SDK development | Plugin architecture makes it extensible by design |
| 🔗 Microservices communication | Rate limiting + retry out of the box |
| 🎓 Learning HTTP internals | The source code is readable and educational |

---

## ⚖️ Reqnest vs Axios

| Feature | Reqnest | Axios |
|---|---|---|
| Middleware pipeline | ✅ Yes | ❌ No |
| Plugin system | ✅ Yes | ❌ No |
| Full lifecycle control | ✅ Yes | ❌ No |
| Built on Fetch API | ✅ Yes | ❌ (XHR) |
| Request deduplication | ✅ Built-in plugin | ❌ No |
| Smart caching | ✅ Built-in plugin | ❌ No |
| Rate limiting | ✅ Built-in plugin | ❌ No |
| Extensibility | 🔥 High | ⚠️ Limited |
| Bundle size | ⚡ Lightweight | 🧱 Heavier |
| TypeScript support | ✅ Yes | ✅ Yes |

> Axios is a great library. Reqnest is a different philosophy — it's for when you want to **own** your HTTP layer.

---

## 🛠 Architecture

Reqnest draws inspiration from three key ideas:

```
┌─────────────────────────────────────────┐
│  Koa.js          → Middleware system    │
│  Fetch API       → Transport layer      │
│  Redux middleware → Composable pipeline │
└─────────────────────────────────────────┘
```

The core engine is tiny. Every advanced feature (caching, retry, deduplication, rate limiting) lives in its own isolated plugin. You only pay the cost of what you actually use.

---

## 📂 Project Structure

```
reqnest/
├── src/
│   ├── core/
│   │   ├── client.ts          # create() and instance logic
│   │   ├── compose.ts         # Middleware composition engine
│   │   ├── dispatch.ts        # The fetch-based terminal middleware
│   │   └── context.ts         # Context type definitions
│   │
│   ├── plugins/
│   │   ├── cache.ts           # In-memory caching plugin
│   │   ├── dedupe.ts          # Request deduplication plugin
│   │   ├── rateLimit.ts       # Concurrency limiting plugin
│   │   └── retry.ts           # Auto-retry plugin
│   │
│   ├── types/
│   │   └── index.ts           # Shared TypeScript interfaces
│   │
│   └── utils/
│       ├── buildURL.ts        # URL + params serialization
│       └── parseResponse.ts   # Response parsing helpers
│
├── tests/
│   ├── core.test.ts
│   └── plugins.test.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Roadmap

Track what's coming next:

- [ ] 🔥 **Interceptors** — request/response interceptors (like Axios, but cleaner)
- [ ] 🔥 **GraphQL support** — first-class `gql()` helper
- [ ] 🔥 **SSR support** — cookie forwarding and server-side session handling
- [ ] 🔥 **Devtools integration** — browser extension for request inspection
- [ ] 🔥 **npm publish** — official release on the npm registry
- [ ] 🔥 **Persistent cache** — IndexedDB / localStorage cache adapter
- [ ] 🔥 **WebSocket support** — unified transport abstraction

---

## 👨‍💻 Author

<div align="center">

**Suman Kayal** *(a.k.a. Sky)*

Full-Stack Developer · MERN Stack · Real-time Systems · AI Tooling

[![GitHub](https://img.shields.io/badge/GitHub-SUMANKAYALS-181717?style=for-the-badge&logo=github)](https://github.com/SUMANKAYALS)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Suman%20Kayal-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/suman-kayal10/)
[![Instagram](https://img.shields.io/badge/Instagram-Sky-E4405F?style=for-the-badge&logo=instagram)](https://www.instagram.com/sumankayal_/)

*Built in Kolkata, India 🇮🇳*

</div>

---

## ⭐ Support the Project

If Reqnest saves you time or teaches you something:

- ⭐ **Star** the repository
- 🍴 **Fork** it and build something cool
- 📣 **Share** it with your dev network
- 🐛 **Open issues** for bugs or ideas
- 🤝 **Contribute** — PRs are welcome!

Your support helps keep this project alive and growing.

---

## 📄 License

```
MIT License

Copyright (c) 2025 Suman Kayal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

See [LICENSE](LICENSE) for the full text.

---

<div align="center">

**Built with obsession. Designed for control. Made to be extended.**

*Reqnest — because your HTTP client should work for you, not against you.*

</div>#   r e q n e s t  
 