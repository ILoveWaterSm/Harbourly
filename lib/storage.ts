/**
 * S3-compatible storage interface with filesystem mock for development.
 */
import path from 'path'
import fs from 'fs/promises'
import crypto from 'crypto'

export interface StorageFile {
  key: string
  url: string
  contentType: string
  sizeBytes: number
}

export interface StorageProvider {
  upload(
    key: string,
    data: Buffer | Uint8Array,
    contentType: string
  ): Promise<StorageFile>
  getUrl(key: string): string
  delete(key: string): Promise<void>
}

class FilesystemStorageProvider implements StorageProvider {
  private readonly uploadDir: string
  private readonly baseUrl: string

  constructor() {
    this.uploadDir = path.join(process.cwd(), '.uploads')
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  }

  async upload(
    key: string,
    data: Buffer | Uint8Array,
    contentType: string
  ): Promise<StorageFile> {
    await fs.mkdir(this.uploadDir, { recursive: true })
    const filePath = path.join(this.uploadDir, key.replace(/\//g, '_'))
    await fs.writeFile(filePath, data)
    return {
      key,
      url: this.getUrl(key),
      contentType,
      sizeBytes: data.length,
    }
  }

  getUrl(key: string): string {
    return `${this.baseUrl}/api/uploads/${encodeURIComponent(key)}`
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key.replace(/\//g, '_'))
    await fs.unlink(filePath).catch(() => undefined)
  }
}

export function generateKey(folder: string, filename: string): string {
  const ext = path.extname(filename)
  const uid = crypto.randomBytes(16).toString('hex')
  return `${folder}/${uid}${ext}`
}

export const storage: StorageProvider = new FilesystemStorageProvider()
