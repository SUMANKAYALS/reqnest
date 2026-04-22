import { Reqnest } from "./core/Reqnest.js";

export function create(config?: any) {
    return new Reqnest(config);
}