import { AppDataSource } from '../main/data-source'
import { ItemEntity } from '../entity/itemEntity'
import { injectable } from 'tsyringe'

@injectable()
export class ItemRepo {
  ItemRepository = AppDataSource.getRepository(ItemEntity)

  async findAll(): Promise<ItemEntity[]> {
    return await this.ItemRepository.find()
  }

  async findById(id: number): Promise<ItemEntity | null> {
    return await this.ItemRepository.findOneBy({ id: id })
  }

  async findByTitle(title: string): Promise<ItemEntity[]> {
    return await this.ItemRepository.findBy({ title: title })
  }

  async findByDescription(description: string): Promise<ItemEntity[]> {
    return await this.ItemRepository.findBy({ description: description })
  }

  async save(Item: ItemEntity): Promise<ItemEntity> {
    return await this.ItemRepository.save(Item)
  }
}
