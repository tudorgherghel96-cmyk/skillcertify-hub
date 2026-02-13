/**
 * Background sync: flushes queued offline actions to Supabase when online.
 */

import { supabase } from "@/integrations/supabase/client";
import { getSyncQueue, removeSyncItem } from "./offlineStorage";

let syncing = false;

export async function flushSyncQueue(): Promise<number> {
  if (syncing || !navigator.onLine) return 0;
  syncing = true;

  const queue = getSyncQueue();
  let synced = 0;

  for (const item of queue) {
    try {
      switch (item.type) {
        case "practice_attempt": {
          const { error } = await supabase.from("practice_attempts").insert(item.payload as any);
          if (!error) {
            removeSyncItem(item.id);
            synced++;
          }
          break;
        }
        case "concept_attempt": {
          const { error } = await supabase.from("concept_attempts").insert(item.payload as any);
          if (!error) {
            removeSyncItem(item.id);
            synced++;
          }
          break;
        }
        case "progress_update": {
          const { error } = await supabase
            .from("progress")
            .upsert(item.payload as any, { onConflict: "user_id,module_id,lesson_id" });
          if (!error) {
            removeSyncItem(item.id);
            synced++;
          }
          break;
        }
      }
    } catch {
      // Network error — stop trying, will retry later
      break;
    }
  }

  syncing = false;
  return synced;
}

/** Register online listener to auto-sync */
export function registerAutoSync() {
  window.addEventListener("online", () => {
    // Small delay to let connection stabilize
    setTimeout(() => flushSyncQueue(), 2000);
  });

  // Also try on app load if online
  if (navigator.onLine) {
    setTimeout(() => flushSyncQueue(), 3000);
  }
}
