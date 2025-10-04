export class Item {
  id: number | null
  title: string
  description: string | null
  mainImgId: number | null
  exeFileRefId: number | null
  rootFileRefId: number | null
  deleted: boolean
  categoryIds: number[]
  kindIds: number[]
}
