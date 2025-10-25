import { AppDataSource } from '../main/data-source'
import { injectable } from 'tsyringe'
import { In } from 'typeorm'
import { ItemAndKind } from '../entity/itemEntity'

@injectable()
export class ItemAndKindRepo {
  ItemAndKindRepository = AppDataSource.getRepository(ItemAndKind)

  async findById(id: number): Promise<ItemAndKind | null> {
    return await this.ItemAndKindRepository.findOneBy({ id: id })
  }

  async save(ItemAndKind: ItemAndKind): Promise<ItemAndKind> {
    return await this.ItemAndKindRepository.save(ItemAndKind)
  }

  async saveAll(ItemAndKinds: ItemAndKind[]): Promise<ItemAndKind[]> {
    return await this.ItemAndKindRepository.save(ItemAndKinds)
  }

  async findByIds(ids: number[]): Promise<ItemAndKind[]> {
    return await this.ItemAndKindRepository.findBy({ id: In(ids) })
  }

  async findByItemId(itemId: number): Promise<ItemAndKind[]> {
    return await this.ItemAndKindRepository.findBy({ itemId: itemId })
  }

  async findByItemIds(itemIds: number[]): Promise<ItemAndKind[]> {
    return await this.ItemAndKindRepository.findBy({ itemId: In(itemIds) })
  }

  async findAll(): Promise<ItemAndKind[]> {
    return await this.ItemAndKindRepository.find()
  }

  async deleteByItemId(itemId: number): Promise<void> {
    await this.ItemAndKindRepository.delete({ itemId: itemId })
  }
}
