import { AppDataSource } from '../main/data-source'
import { injectable } from 'tsyringe'
import { ImageMappingEntity } from '../entity/imageMappingEntity'
import { In } from 'typeorm'

@injectable()
export class ImageMappingRepo {
  imageMappingRepository = AppDataSource.getRepository(ImageMappingEntity)

  async findById(id: number): Promise<ImageMappingEntity | null> {
    return await this.imageMappingRepository.findOneBy({ id: id })
  }

  async save(imageMapping: ImageMappingEntity): Promise<ImageMappingEntity> {
    return await this.imageMappingRepository.save(imageMapping)
  }

  async saveAll(imageMappings: ImageMappingEntity[]): Promise<ImageMappingEntity[]> {
    return await this.imageMappingRepository.save(imageMappings)
  }

  async findByIds(ids: number[]): Promise<ImageMappingEntity[]> {
    return await this.imageMappingRepository.findBy({ id: In(ids) })
  }

  async findAll(): Promise<ImageMappingEntity[]> {
    return await this.imageMappingRepository.find()
  }

  async deleteById(id: number): Promise<void> {
    await this.imageMappingRepository.delete({ id: id })
  }
}
