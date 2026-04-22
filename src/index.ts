// import { create } from "./create.js";
// import { dispatch } from "./core/dispatch.js";

// // 🔥 create default instance (with safe defaults)
// // const reqnest = create({
// //     timeout: 10000, // ✅ fix timeout issue
// // });

// const reqnest = create({
//     timeout: undefined, // 🔥 important
// });

// reqnest.use(dispatch);

// // ✅ default export
// export default reqnest;

// // ✅ named exports
// export { create } from "./create.js";
// export { dispatch } from "./core/dispatch.js";

// // plugins
// export { retry } from "./plugins/retry.js";
// export { cachePlugin } from "./plugins/cache.js";
// export { dedupe } from "./plugins/dedupe.js";
// export { rateLimit } from "./plugins/rateLimit.js";


import { create } from "./create.js";
import { dispatch } from "./core/dispatch.js";

const reqnest = create();

reqnest.use(dispatch);

export default reqnest;

export { create } from "./create.js";
export { dispatch } from "./core/dispatch.js";

export { cachePlugin } from "./plugins/cache.js";
export { dedupe } from "./plugins/dedupe.js";
export { rateLimit } from "./plugins/rateLimit.js";