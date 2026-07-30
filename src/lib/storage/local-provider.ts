import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { StorageProvider, StoredFile } from "./types";

/**
 * Local-disk storage. Files live under STORAGE_DIR (default ./storage), namespaced by
 * project. `path` is stored relative to STORAGE_DIR so the DB stays portable if the base
 * directory moves.
 */
export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor(baseDir = process.env.STORAGE_DIR || "./storage") {
    this.baseDir = path.resolve(baseDir);
  }

  private safeName(fileName: string): string {
    const base = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, "_");
    return `${randomBytes(6).toString("hex")}-${base || "file"}`;
  }

  async save(input: {
    projectId: string;
    fileName: string;
    mimeType: string;
    data: Buffer;
  }): Promise<StoredFile> {
    const relDir = path.join(input.projectId);
    const absDir = path.join(this.baseDir, relDir);
    await fs.mkdir(absDir, { recursive: true });

    const name = this.safeName(input.fileName);
    const relPath = path.join(relDir, name);
    await fs.writeFile(path.join(this.baseDir, relPath), input.data);

    return { path: relPath, size: input.data.length, mimeType: input.mimeType };
  }

  async read(relPath: string): Promise<Buffer> {
    return fs.readFile(this.resolveWithin(relPath));
  }

  async remove(relPath: string): Promise<void> {
    try {
      await fs.unlink(this.resolveWithin(relPath));
    } catch {
      // Already gone — ignore.
    }
  }

  /** Resolve a stored relative path and guard against traversal outside baseDir. */
  private resolveWithin(relPath: string): string {
    const abs = path.resolve(this.baseDir, relPath);
    if (!abs.startsWith(this.baseDir + path.sep) && abs !== this.baseDir) {
      throw new Error("Invalid storage path");
    }
    return abs;
  }
}
