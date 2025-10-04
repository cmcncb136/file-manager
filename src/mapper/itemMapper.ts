import { ItemEntity } from '../entity/itemEntity'
import { Item } from '../domain/item'

export class ItemMapper {
  static toDomain(
    itemEntity: ItemEntity,
    categoryIds: number[] | null,
    kindIds: number[] | null
  ): Item {
    return {
      id: itemEntity.id,
      title: itemEntity.title,
      description: itemEntity.description,
      mainImgId: itemEntity.mainImgId,
      exeFileRefId: itemEntity.exeFileRefId,
      rootFileRefId: itemEntity.rootFileRefId,
      deleted: itemEntity.deleted,
      categoryIds: categoryIds ? categoryIds : [],
      kindIds: kindIds ? kindIds : []
    }
  }
}
