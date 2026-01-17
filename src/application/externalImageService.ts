export interface ExternalImageService {
  search(query: string): Promise<string[]>
}
