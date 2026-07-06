import {
  processImage,
  type ProcessedImage,
  type RemoveOptions,
} from "./picscrub";
import type { ScrubWorkerResponse } from "./scrub.worker";

// Processing large files (TIFF, RAW) on the main thread freezes the page, so
// we run picscrub in a Web Worker and fall back to the main thread if the
// worker can't be created or crashes.

class WorkerUnavailableError extends Error {}

let worker: Worker | null = null;
let workerBroken = false;
let nextRequestId = 0;
const pending = new Map<
  number,
  { resolve: (result: ProcessedImage) => void; reject: (error: Error) => void }
>();

function getWorker(): Worker | null {
  if (workerBroken || typeof Worker === "undefined") return null;
  if (worker) return worker;

  try {
    worker = new Worker(new URL("./scrub.worker.ts", import.meta.url));
  } catch {
    workerBroken = true;
    worker = null;
    return null;
  }

  worker.addEventListener("message", (event: MessageEvent<ScrubWorkerResponse>) => {
    const response = event.data;
    const entry = pending.get(response.id);
    if (!entry) return;
    pending.delete(response.id);
    if (response.ok) {
      entry.resolve(response.result);
    } else {
      entry.reject(new Error(response.error));
    }
  });

  worker.addEventListener("error", () => {
    workerBroken = true;
    worker?.terminate();
    worker = null;
    const entries = [...pending.values()];
    pending.clear();
    entries.forEach((entry) => entry.reject(new WorkerUnavailableError()));
  });

  return worker;
}

export async function scrubImage(
  file: File,
  options: RemoveOptions,
): Promise<ProcessedImage> {
  const activeWorker = getWorker();
  if (!activeWorker) return processImage(file, options);

  try {
    return await new Promise<ProcessedImage>((resolve, reject) => {
      const id = nextRequestId++;
      pending.set(id, { resolve, reject });
      activeWorker.postMessage({ id, file, options });
    });
  } catch (error) {
    if (error instanceof WorkerUnavailableError) {
      return processImage(file, options);
    }
    throw error;
  }
}
