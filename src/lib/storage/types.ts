/**
 * Storage abstraction. Uploaded source assets go through a StorageProvider so the rest of
 * the app never touches the filesystem directly. Swapping local disk for S3 / Google Drive /
 * Dropbox later means writing one new provider — no caller changes.
 */
export interface StoredFile {
  /** Opaque path/key the provider uses to retrieve the file later. */
  path: string;
  size: number;
  mimeType: string;
}

export interface StorageProvider {
  save(input: {
    projectId: string;
    fileName: string;
    mimeType: string;
    data: Buffer;
  }): Promise<StoredFile>;

  read(path: string): Promise<Buffer>;

  remove(path: string): Promise<void>;
}
