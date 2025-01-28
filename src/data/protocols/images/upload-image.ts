export interface UploadImageRepository {
  upload(image: { file: File }): Promise<void>
}
