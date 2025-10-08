import { inject, injectable } from 'tsyringe'
import { ItemRepo } from '../infrastructure/itemRepo'
import { ItemAndKindRepo } from '../infrastructure/itemAndKind'
import { ItemAndCategoryRepo } from '../infrastructure/itemAndCategoryRepo'
import { Item } from '../domain/item'
import { ItemMapper } from '../mapper/itemMapper'
import { ItemAndCategory, ItemAndKind, ItemEntity } from '../entity/itemEntity'
import { ItemWithPathRequestDto } from './dto/itemWithPathRequestDto'
import { ImageMappingService } from './imageMappingService'
import { FileRefService } from './fileRefService'

@injectable()
export class ItemService {
  constructor(
    @inject(ItemRepo) private itemRepo: ItemRepo,
    @inject(ItemAndKindRepo) private itemAndKindRepo: ItemAndKindRepo,
    @inject(ItemAndCategoryRepo) private itemAndCategoryRepo: ItemAndCategoryRepo,
    @inject(ImageMappingService) private imageMappingService: ImageMappingService,
    @inject(FileRefService) private fileRefService: FileRefService
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

    const items = itemEntities.map((entity) =>
      ItemMapper.toDomain(entity, categoryEntities.get(entity.id!)!, kindEntities.get(entity.id!)!)
    )
    console.log(JSON.stringify(items))
    return items
  }

  async save(straightItem: string): Promise<Item> {
    console.log('input : ', straightItem)
    const item = JSON.parse(straightItem)

    const itemEntity = await this.itemRepo.save(ItemMapper.toEntity(item))

    const kindEntities = await this.itemAndKindRepo.saveAll(
      item.kindIds.map((kindId) => {
        return {
          id: null,
          itemId: itemEntity.id!,
          kindId: kindId
        }
      })
    )

    const categoryEntities = await this.itemAndCategoryRepo.saveAll(
      item.categoryIds.map((categoryId) => {
        return {
          id: null,
          itemId: itemEntity.id!,
          categoryId: categoryId
        }
      })
    )

    return ItemMapper.toDomain(
      itemEntity,
      categoryEntities.map((category) => category.categoryId),
      kindEntities.map((kind) => kind.kindId)
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

  async findItemWithPathAll(): Promise<ItemWithPathRequestDto[]> {
    const items = await this.findAll()
    const dtoPromise = items.map(async (item) => {
      const [mainImg, exeFile, rootFile] = await Promise.all([
        this.imageMappingService.findById(item.mainImgId),
        this.fileRefService.findById(item.exeFileRefId),
        this.fileRefService.findById(item.rootFileRefId)
      ])

      return ItemMapper.toItemWithPathRequestDto(item, mainImg, exeFile, rootFile)
    })

    const dtos = await Promise.all(dtoPromise)
    return dtos.sort((a, b) => a.id - b.id)
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

  //Todo. 여기서부터 다시 시작 - Description
  async findByTitle(title: string): Promise<Item[]> {
    const itemEntities = await this.itemRepo.findByTitle(title)
    const [kindEntities, categoryEntities] = await Promise.all([
      this.itemAndKindRepo.findByItemIds(itemEntities.map((it) => it.id!)),
      this.itemAndCategoryRepo.findByItemIds(itemEntities.map((it) => it.id!))
    ])

    return this.createItem(itemEntities, kindEntities, categoryEntities)
  }
}
