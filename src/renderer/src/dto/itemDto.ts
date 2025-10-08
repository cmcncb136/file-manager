import { CategoryEntity } from '../../../entity/categoryEntity'
import { KindEntity } from '../../../entity/kindEntity'
import { FileRefEntity } from '../../../entity/fileRefEntity'
import { ImageMappingEntity } from '../../../entity/imageMappingEntity'

export interface ItemDto {
  id: number
  title: string
  description: string | null
  mainImg: ImageMappingEntity | null
  exeFile: FileRefEntity | null
  rootFile: FileRefEntity | null
  deleted: boolean
  categories: CategoryEntity[]
  kinds: KindEntity[]
}
