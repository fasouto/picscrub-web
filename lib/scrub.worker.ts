import { processImage, type RemoveOptions } from "./picscrub";

export interface ScrubWorkerRequest {
  id: number;
  file: File;
  options: RemoveOptions;
}

export type ScrubWorkerResponse =
  | { id: number; ok: true; result: Awaited<ReturnType<typeof processImage>> }
  | { id: number; ok: false; error: string };

self.addEventListener("message", async (event: MessageEvent<ScrubWorkerRequest>) => {
  const { id, file, options } = event.data;
  try {
    const result = await processImage(file, options);
    (self as unknown as Worker).postMessage({ id, ok: true, result } satisfies ScrubWorkerResponse, [
      result.original.buffer,
      result.cleaned.buffer,
    ]);
  } catch (error) {
    (self as unknown as Worker).postMessage({
      id,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    } satisfies ScrubWorkerResponse);
  }
});
