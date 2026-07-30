import { LocalStorageProvider } from "./local-provider";
import type { StorageProvider } from "./types";

export type { StorageProvider, StoredFile } from "./types";

/**
 * The active storage provider. Swap this single line to move to S3/Drive/Dropbox later.
 */
export const storage: StorageProvider = new LocalStorageProvider();
