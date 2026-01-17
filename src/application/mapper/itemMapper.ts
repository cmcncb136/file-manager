import { ItemEntity } from '../../entity/itemEntity'
import { Item } from '../../domain/item'
import { FileRefEntity } from '../../entity/fileRefEntity'
import { ImageMappingEntity } from '../../entity/imageMappingEntity'
import { ItemWithPathRequestDto } from '../dto/itemWithPathRequestDto'
import { SaveItemDto } from '../dto/saveItemDto'
import { UpdateItemDto } from '../dto/updateItemDto'

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
      kindIds: kindIds ? kindIds : [],
      isFavorite: itemEntity.isFavorite
    }
  }

  static saveItemDtoToDomain(
    saveItemDto: SaveItemDto,
    imageMappingEntity: ImageMappingEntity | null,
    exeFileRefEntity: FileRefEntity | null,
    rootFileRefEntity: FileRefEntity | null
  ): Item {
    return {
      id: null,
      title: saveItemDto.title,
      description: saveItemDto.description,
      mainImgId: imageMappingEntity?.id ?? null,
      exeFileRefId: exeFileRefEntity?.id ?? null,
      rootFileRefId: rootFileRefEntity?.id ?? null,
      deleted: false,
      categoryIds: saveItemDto.categoryIds,
      kindIds: saveItemDto.kindIds,
      isFavorite: false
    } as Item
  }

  static updateItemDtoToDomain(
    updateItemDto: UpdateItemDto,
    imageMappingEntity: ImageMappingEntity | null,
    exeFileRefEntity: FileRefEntity | null,
    rootFileRefEntity: FileRefEntity | null
  ): Item {
    return {
      id: updateItemDto.id,
      title: updateItemDto.title,
      description: updateItemDto.description,
      mainImgId: imageMappingEntity?.id ?? null,
      exeFileRefId: exeFileRefEntity?.id ?? null,
      rootFileRefId: rootFileRefEntity?.id ?? null,
      deleted: false,
      categoryIds: updateItemDto.categoryIds,
      kindIds: updateItemDto.kindIds,
      isFavorite: false // Update usually doesn't reset favorite, but let's be careful with domain types
    } as Item
  }

  static toEntity(item: Item): ItemEntity {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      mainImgId: item.mainImgId,
      exeFileRefId: item.exeFileRefId,
      rootFileRefId: item.rootFileRefId,
      deleted: item.deleted,
      isFavorite: item.isFavorite
    } as ItemEntity
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
      kindIds: item.kindIds,
      isFavorite: item.isFavorite
    }
  }
}
