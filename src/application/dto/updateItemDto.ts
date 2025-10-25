export interface UpdateItemDto {
  id: number
  title: string
  description: string | null
  mainImgPath: string | null
  exeFileRefPath: string | null
  rootFileRefPath: string | null
  categoryIds: number[]
  kindIds: number[]
}
