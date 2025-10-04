import { AppDataSource } from '../main/data-source'
import { injectable } from 'tsyringe'
import { In } from 'typeorm'
import { FileRefEntity } from '../entity/fileRefEntity'

@injectable()
export class FileRefRepo {
  fileRefRepository = AppDataSource.getRepository(FileRefEntity)

  async findById(id: number): Promise<FileRefEntity | null> {
    return await this.fileRefRepository.findOneBy({ id: id })
  }

  async save(FileRef: FileRefEntity): Promise<FileRefEntity> {
    return await this.fileRefRepository.save(FileRef)
  }

  async saveAll(FileRefs: FileRefEntity[]): Promise<FileRefEntity[]> {
    return await this.fileRefRepository.save(FileRefs)
  }

  async findByIds(ids: number[]): Promise<FileRefEntity[]> {
    return await this.fileRefRepository.findBy({ id: In(ids) })
  }

  async findAll(): Promise<FileRefEntity[]> {
    return await this.fileRefRepository.find()
  }
}
