import { injectable, inject } from 'tsyringe'
import { ImageMappingEntity } from '../entity/imageMappingEntity'
import { ImageMappingRepo } from '../infrastructure/imageMappingRepo'
import { FileService } from './fileService'

@injectable()
export class ImageMappingService {
  constructor(
    @inject(ImageMappingRepo) private imageMappingRepo: ImageMappingRepo,
    @inject(FileService) private fileService: FileService
  ) {}

  async findById(id: number | null): Promise<ImageMappingEntity | null> {
    if (id == null) return null
    return this.imageMappingRepo.findById(id)
  }

  async save(imageMapping: ImageMappingEntity): Promise<ImageMappingEntity> {
    return this.imageMappingRepo.save(imageMapping)
  }

  async saveAll(imageMappings: ImageMappingEntity[]): Promise<ImageMappingEntity[]> {
    return this.imageMappingRepo.saveAll(imageMappings)
  }

  async saveByPath(path: string): Promise<ImageMappingEntity> {
    const copyPath = await this.fileService.copyFileToAppFolder(path, 'image')
    return await this.save({
      id: null,
      realPath: path,
      copyPath: copyPath
    })
  }
}
