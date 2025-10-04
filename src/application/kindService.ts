import { inject, injectable } from 'tsyringe'
import { KindRepo } from '../infrastructure/kindRepo'
import { KindEntity } from '../entity/kindEntity'

@injectable()
export class KindService {
  constructor(@inject(KindRepo) private kindRepo: KindRepo) {}

  async findAll(): Promise<KindEntity[]> {
    return await this.kindRepo.findAll()
  }

  async findById(id: number): Promise<KindEntity | null> {
    return await this.kindRepo.findById(id)
  }

  async findByName(name: string): Promise<KindEntity | null> {
    return await this.kindRepo.findByName(name)
  }

  async save(kind: KindEntity): Promise<KindEntity> {
    return await this.kindRepo.save(kind)
  }

  async saveByName(name: string): Promise<KindEntity> {
    console.log('create target category : ', name)
    const lowerName = name.toLowerCase()
    const existCheckCategory = await this.kindRepo.findByName(lowerName)
    if (existCheckCategory) {
      return existCheckCategory
    }

    return await this.kindRepo.save({
      id: null,
      name: lowerName,
      imgId: null,
      deleted: false
    })
  }
}
