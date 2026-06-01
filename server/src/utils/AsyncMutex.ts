/**
 * Simple async mutex to serialise all read-modify-write operations on the JSON
 * file. Without this, concurrent requests can interleave their reads and writes,
 * causing earlier changes to be silently lost.
 */
export class AsyncMutex {
  private queue: Promise<void> = Promise.resolve();

  run<T>(fn: () => Promise<T>): Promise<T> {
    let release!: () => void;
    const next = new Promise<void>((resolve) => {
      release = resolve;
    });
    const current = this.queue;
    this.queue = this.queue.then(() => next);

    return current.then(async () => {
      try {
        return await fn();
      } finally {
        release();
      }
    });
  }
}
