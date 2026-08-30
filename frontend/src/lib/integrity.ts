/**
 * integrity.ts — deterministic checksum for advisory records.
 *
 * Uses the Web Crypto API (SHA-256) which is available in all modern
 * browsers and in Vite's build target. Falls back to a fast djb2 hash
 * when SubtleCrypto is unavailable (e.g. non-secure context in tests).
 */

/** Async SHA-256 checksum (preferred). Returns lowercase hex string. */
export async function checksumAsync(content: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data    = encoder.encode(content);
    const hashBuf = await crypto.subtle.digest('SHA-256', data);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback to synchronous djb2
    return checksumSync(content);
  }
}

/** Synchronous djb2 checksum — fast, used as fallback and in tests. */
export function checksumSync(content: string): string {
  let hash = 5381;
  for (let i = 0; i < content.length; i++) {
    hash = (((hash << 5) + hash) ^ content.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

/** Validate a record: recalculate checksum and compare. */
export async function validateIntegrity(
  content: string,
  storedChecksum: string
): Promise<'VERIFIED' | 'CORRUPTED' | 'MISSING'> {
  if (!content) return 'MISSING';
  if (!storedChecksum) return 'MISSING';
  const computed = await checksumAsync(content);
  return computed === storedChecksum ? 'VERIFIED' : 'CORRUPTED';
}
