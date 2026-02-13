/**
 * Offline storage utilities for caching lesson content and syncing quiz results.
 * Uses IndexedDB via simple wrappers and Cache API for media assets.
 */

const OFFLINE_SYNC_KEY = "sc_offline_sync_queue";
const DOWNLOADED_TOPICS_KEY = "sc_downloaded_topics";

/* ─── Sync Queue ─── */

export interface SyncItem {
  id: string;
  type: "practice_attempt" | "concept_attempt" | "progress_update";
  payload: Record<string, unknown>;
  createdAt: string;
}

export function getSyncQueue(): SyncItem[] {
  try {
    const raw = localStorage.getItem(OFFLINE_SYNC_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToSyncQueue(item: Omit<SyncItem, "id" | "createdAt">) {
  const queue = getSyncQueue();
  queue.push({
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(OFFLINE_SYNC_KEY, JSON.stringify(queue));
}

export function removeSyncItem(id: string) {
  const queue = getSyncQueue().filter((item) => item.id !== id);
  localStorage.setItem(OFFLINE_SYNC_KEY, JSON.stringify(queue));
}

export function clearSyncQueue() {
  localStorage.removeItem(OFFLINE_SYNC_KEY);
}

/* ─── Downloaded Topics ─── */

export function getDownloadedTopics(): number[] {
  try {
    const raw = localStorage.getItem(DOWNLOADED_TOPICS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markTopicDownloaded(moduleId: number) {
  const topics = getDownloadedTopics();
  if (!topics.includes(moduleId)) {
    topics.push(moduleId);
    localStorage.setItem(DOWNLOADED_TOPICS_KEY, JSON.stringify(topics));
  }
}

export function isTopicDownloaded(moduleId: number): boolean {
  return getDownloadedTopics().includes(moduleId);
}

/* ─── Media Pre-caching ─── */

const MEDIA_CACHE_NAME = "lesson-images-cache";

export async function cacheMediaUrls(urls: string[], onProgress?: (done: number, total: number) => void): Promise<void> {
  const cache = await caches.open(MEDIA_CACHE_NAME);
  let done = 0;
  const total = urls.length;

  const tasks = urls.map(async (url) => {
    try {
      const existing = await cache.match(url);
      if (!existing) {
        const response = await fetch(url, { mode: "cors" });
        if (response.ok) {
          await cache.put(url, response);
        }
      }
    } catch {
      // Silently skip failed downloads
    } finally {
      done++;
      onProgress?.(done, total);
    }
  });

  // Download 3 at a time to avoid overwhelming the connection
  for (let i = 0; i < tasks.length; i += 3) {
    await Promise.all(tasks.slice(i, i + 3));
  }
}
