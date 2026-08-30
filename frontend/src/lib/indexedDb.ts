/**
 * indexedDb.ts — local emergency storage for HALADHAR Blackout resilience.
 *
 * Stores:
 *  farmer          — latest verified farmer profile (no Aadhaar, no tokens)
 *  crop            — current crop info
 *  advisories      — last 5 advisory texts (content + metadata)
 *  snapshots       — advisory snapshots (versioned)
 *  pendingOps      — operations queued while Supabase was unavailable
 *  metadata        — last sync timestamp + recovery state flags
 */

const DB_NAME    = 'haladhar_recovery';
const DB_VERSION = 1;

const STORES = [
  'farmer',
  'crop',
  'advisories',
  'snapshots',
  'pendingOps',
  'metadata',
] as const;

export type StoreName = (typeof STORES)[number];

/* ── Open database ───────────────────────────────────────────────── */
let _db: IDBDatabase | null = null;

export async function openRecoveryDB(): Promise<IDBDatabase> {
  if (_db) return _db;

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      for (const name of STORES) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: 'id', autoIncrement: true });
        }
      }
    };

    req.onsuccess  = () => { _db = req.result; resolve(req.result); };
    req.onerror    = () => reject(req.error);
    req.onblocked  = () => reject(new Error('IDB blocked'));
  });
}

/* ── Generic get all ─────────────────────────────────────────────── */
export async function idbGetAll<T>(store: StoreName): Promise<T[]> {
  const db = await openRecoveryDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror   = () => reject(req.error);
  });
}

/* ── Get single by key ───────────────────────────────────────────── */
export async function idbGet<T>(store: StoreName, key: IDBValidKey): Promise<T | undefined> {
  const db = await openRecoveryDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror   = () => reject(req.error);
  });
}

/* ── Put (upsert by keyPath) ─────────────────────────────────────── */
export async function idbPut<T extends object>(store: StoreName, value: T): Promise<IDBValidKey> {
  const db = await openRecoveryDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).put(value);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

/* ── Delete by key ───────────────────────────────────────────────── */
export async function idbDelete(store: StoreName, key: IDBValidKey): Promise<void> {
  const db = await openRecoveryDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).delete(key);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

/* ── Clear entire store ──────────────────────────────────────────── */
export async function idbClear(store: StoreName): Promise<void> {
  const db = await openRecoveryDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).clear();
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

/* ── Metadata helpers ────────────────────────────────────────────── */
export async function setMeta(key: string, value: unknown): Promise<void> {
  await idbPut('metadata', { id: key, value, updatedAt: new Date().toISOString() });
}

export async function getMeta<T>(key: string): Promise<T | undefined> {
  const row = await idbGet<{ id: string; value: T }>('metadata', key);
  return row?.value;
}

/* ── Advisories: keep only last 5 ───────────────────────────────── */
export async function saveAdvisoryLocally(advisory: {
  id: string;
  operationId: string;
  farmerId: string;
  content: string;
  checksum: string;
  timestamp: string;
}): Promise<void> {
  await idbPut('advisories', advisory);

  // Trim to last 5
  const all = await idbGetAll<{ id: string; timestamp: string }>('advisories');
  if (all.length > 5) {
    all.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const toDelete = all.slice(0, all.length - 5);
    for (const item of toDelete) await idbDelete('advisories', item.id);
  }
}

export async function getLocalAdvisories() {
  return idbGetAll<{
    id: string;
    operationId: string;
    farmerId: string;
    content: string;
    checksum: string;
    timestamp: string;
  }>('advisories');
}
