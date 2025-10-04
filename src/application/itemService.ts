import { inject, injectable } from 'tsyringe'
import { ItemRepo } from '../infrastructure/itemRepo'
import { ItemAndKindRepo } from '../infrastructure/itemAndKind'
import { ItemAndCategoryRepo } from '../infrastructure/itemAndCategoryRepo'
import { Item } from '../domain/item'
import { ItemMapper } from '../mapper/itemMapper'
import { ItemAndCategory, ItemAndKind, ItemEntity } from '../entity/itemEntity'

@injectable()
export class ItemService {
  constructor(
    @inject(ItemRepo) private itemRepo: ItemRepo,
    @inject(ItemAndKindRepo) private itemAndKindRepo: ItemAndKindRepo,
    @inject(ItemAndCategoryRepo) private itemAndCategoryRepo: ItemAndCategoryRepo
  ) {}

  private createItem(
    itemEntities: ItemEntity[],
    kindEntitiesRaw: ItemAndKind[],
    categoryEntitiesRaw: ItemAndCategory[]
  ): Item[] {
    const kindEntities = kindEntitiesRaw.reduce((map, it) => {
      if (!map.has(it.itemId)) map.set(it.itemId, [])
      map.get(it.itemId)!.push(it.kindId)
      return map
    }, new Map<number, number[]>())

    const categoryEntities = categoryEntitiesRaw.reduce((map, it) => {
      if (!map.has(it.itemId)) map.set(it.itemId, [])
      map.get(it.itemId)!.push(it.categoryId)
      return map
    }, new Map<number, number[]>())

    return itemEntities.map((entity) =>
      ItemMapper.toDomain(entity, categoryEntities[entity!.id!], kindEntities[entity!.id!])
    )
  }

  async findAll(): Promise<Item[]> {
    const [itemEntities, kindEntities, categoryEntities] = await Promise.all([
      this.itemRepo.findAll(),
      this.itemAndKindRepo.findAll(),
      this.itemAndCategoryRepo.findAll()
    ])

    return this.createItem(itemEntities, kindEntities, categoryEntities)
  }

  async findById(id: number): Promise<Item | null> {
    const itemEntity = await this.itemRepo.findById(id)
    if (!itemEntity) return null

    const [categoryEntities, kindEntities] = await Promise.all([
      this.itemAndCategoryRepo.findByItemId(itemEntity.id!),
      this.itemAndKindRepo.findByItemId(itemEntity.id!)
    ])

    return ItemMapper.toDomain(
      itemEntity,
      categoryEntities.map((it) => it.categoryId),
      kindEntities.map((it) => it.kindId)
    )
  }

  //Todo. 여기서부터 다시 시작
  async findByTitle(title: string): Promise<Item[]> {
    const itemEntities = await this.itemRepo.findByTitle(title)
    const [kindEntities, categoryEntities] = await Promise.all([
      this.itemAndKindRepo.findByItemIds(itemEntities.map((it) => it.id!)),
      this.itemAndCategoryRepo.findByItemIds(itemEntities.map((it) => it.id!))
    ])

    return this.createItem(itemEntities, kindEntities, categoryEntities)
  }
}
