import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { documents, type DocumentRecord } from "./documents";

/** A download is offered only if the file really exists (no dead links). */
export function isDownloadable(d: DocumentRecord): boolean {
  return existsSync(path.join(process.cwd(), "public", "documents", d.file));
}

export function publishedDocuments(): DocumentRecord[] {
  return documents.filter(isDownloadable).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
