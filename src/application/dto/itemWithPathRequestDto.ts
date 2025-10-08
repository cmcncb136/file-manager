import { ImageMappingEntity } from '../../entity/imageMappingEntity'
import { FileRefEntity } from '../../entity/fileRefEntity'

export interface ItemWithPathRequestDto {
  id: number
  title: string
  description: string | null
  mainImg: ImageMappingEntity | null
  exeFile: FileRefEntity | null
  rootFile: FileRefEntity | null
  deleted: boolean
  categoryIds: number[]
  kindIds: number[]
}
