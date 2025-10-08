import { AppDataSource } from '../main/data-source'
import { injectable } from 'tsyringe'
import { In } from 'typeorm'
import { ItemAndCategory } from '../entity/itemEntity'

@injectable()
export class ItemAndCategoryRepo {
  ItemAndCategoryRepository = AppDataSource.getRepository(ItemAndCategory)

  async findById(id: number): Promise<ItemAndCategory | null> {
    return await this.ItemAndCategoryRepository.findOneBy({ id: id })
  }

  async save(ItemAndCategory: ItemAndCategory): Promise<ItemAndCategory> {
    return await this.ItemAndCategoryRepository.save(ItemAndCategory)
  }

  async saveAll(ItemAndCategories: ItemAndCategory[]): Promise<ItemAndCategory[]> {
    return await this.ItemAndCategoryRepository.save(ItemAndCategories)
  }

  async findByIds(ids: number[]): Promise<ItemAndCategory[]> {
    return await this.ItemAndCategoryRepository.findBy({ id: In(ids) })
  }

  async findByItemId(itemId: number): Promise<ItemAndCategory[]> {
    return await this.ItemAndCategoryRepository.findBy({ itemId: itemId })
  }

  async findByItemIds(itemIds: number[]): Promise<ItemAndCategory[]> {
    return await this.ItemAndCategoryRepository.findBy({ itemId: In(itemIds) })
  }

  async findAll(): Promise<ItemAndCategory[]> {
    return await this.ItemAndCategoryRepository.find()
  }
}
