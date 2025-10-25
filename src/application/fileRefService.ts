import { inject, injectable } from 'tsyringe'
import { FileRefRepo } from '../infrastructure/fileRefRepo'
import { FileService } from './fileService'
import { FileRefEntity } from '../entity/fileRefEntity'

@injectable()
export class FileRefService {
  constructor(
    @inject(FileRefRepo) private fileRefRepo: FileRefRepo,
    @inject(FileService) private fileService: FileService
  ) {}

  async findById(id: number | null): Promise<FileRefEntity | null> {
    if (id == null) return null
    return this.fileRefRepo.findById(id)
  }

  async save(fileRef: FileRefEntity): Promise<FileRefEntity> {
    return this.fileRefRepo.save(fileRef)
  }

  async saveAll(fileRefs: FileRefEntity[]): Promise<FileRefEntity[]> {
    return this.fileRefRepo.saveAll(fileRefs)
  }

  async saveByPath(path: string): Promise<FileRefEntity> {
    const copyPath = await this.fileService.generateFileLinkToAppFolder(path, 'link')
    return await this.save({
      id: null,
      linkFilePath: copyPath,
      realPath: path
    })
  }

  async openFileById(id: number): Promise<string | null> {
    const entity = await this.findById(id)
    if (!entity) return null

    return await this.fileService.openLinkFile(entity.linkFilePath)
  }

  async deleteById(id: number | null): Promise<void> {
    if (id == null) return
    await this.fileRefRepo.deleteById(id)
  }
}
