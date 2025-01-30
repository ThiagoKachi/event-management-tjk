export interface UploadImageRepository {
  upload(image: { file: Buffer, filename: string }): Promise<void>
}
