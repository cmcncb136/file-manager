import { Item } from '../../../domain/item'
import { ImageMappingEntity } from '../../../entity/imageMappingEntity'
import { FileRefEntity } from '../../../entity/fileRefEntity'
import { ItemWithPathRequestDto } from '@renderer/dto/itemWithPathRequestDto'
import { UpdateItemDto } from '@renderer/dto/updateItemDto'
import { SaveItemDto } from '@renderer/dto/saveItemDto'

export class ItemMapper {
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
      createdAt: item.createdAt,
      isFavorite: item.isFavorite,
      updatedAt: item.updatedAt
    }
  }

  static saveItemDtoToUpdateItemDto(id: number, item: SaveItemDto): UpdateItemDto {
    return {
      id: id,
      title: item.title,
      description: item.description,
      mainImgPath: item.mainImgPath,
      exeFileRefPath: item.exeFileRefPath,
      rootFileRefPath: item.rootFileRefPath,
      categoryIds: item.categoryIds,
      kindIds: item.kindIds
    } as UpdateItemDto
  }
}
