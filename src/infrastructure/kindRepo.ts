import { AppDataSource } from '../main/data-source'
import { KindEntity } from '../entity/kindEntity'
import { injectable } from 'tsyringe'

@injectable()
export class KindRepo {
  kindRepository = AppDataSource.getRepository(KindEntity)

  async findByName(name: string): Promise<KindEntity | null> {
    return await this.kindRepository.findOneBy({ name: name })
  }

  async findById(id: number): Promise<KindEntity | null> {
    return await this.kindRepository.findOneBy({ id: id })
  }

  async findAll(): Promise<KindEntity[]> {
    return await this.kindRepository.find()
  }

  async save(Kind: KindEntity): Promise<KindEntity> {
    return await this.kindRepository.save(Kind)
  }
}
