
import { inject, injectable } from 'tsyringe'
import type { ExternalImageService } from './externalImageService'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'
import { v4 as uuidv4 } from 'uuid'

@injectable()
export class ImageRecommendationService {
  constructor(
    @inject('ExternalImageService') private externalImageService: ExternalImageService
  ) {}

  async searchImages(query: string): Promise<string[]> {
    return this.externalImageService.search(query)
  }

  async downloadImage(url: string): Promise<string> {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const extension = path.extname(new URL(url).pathname) || '.jpg'
    const fileName = `${uuidv4()}${extension}`
    const tempPath = path.join(os.tmpdir(), fileName)
    
    await fs.promises.writeFile(tempPath, buffer)
    
    // Return absolute temp path so ImageMappingService can process it normally
    return tempPath
  }
}
