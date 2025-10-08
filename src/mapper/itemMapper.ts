import { ItemEntity } from '../entity/itemEntity'
import { Item } from '../domain/item'
import { FileRefEntity } from '../entity/fileRefEntity'
import { ImageMappingEntity } from '../entity/imageMappingEntity'
import { ItemWithPathRequestDto } from '../application/dto/itemWithPathRequestDto'

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

  static toEntity(item: Item): ItemEntity {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      mainImgId: item.mainImgId,
      exeFileRefId: item.exeFileRefId,
      rootFileRefId: item.rootFileRefId,
      deleted: item.deleted
    }
  }

  static toItemWithPathRequestDto(
    item: Item,
    mainImg: ImageMappingEntity | null,
    exeFile: FileRefEntity | null,
    rootFile: FileRefEntity | null
  ): ItemWithPathRequestDto {
    return {
      id: item.id!,
      title: item.title,
      description: item.description,
      mainImg: mainImg,
      exeFile: exeFile,
      rootFile: rootFile,
      deleted: item.deleted,
      categoryIds: item.categoryIds,
      kindIds: item.kindIds
    }
  }
}
