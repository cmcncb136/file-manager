import { Item } from '../../../domain/item'
import { ImageMappingEntity } from '../../../entity/imageMappingEntity'
import { FileRefEntity } from '../../../entity/fileRefEntity'
import { ItemWithPathRequestDto } from '@renderer/dto/itemWithPathRequestDto'

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
      kindIds: item.kindIds
    }
  }
}
