import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('item')
export class ItemEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number | null

  @Column('text')
  title!: string

  @Column('text', { nullable: true })
  description!: string | null

  @Column('integer', { nullable: true })
  mainImgId!: number | null

  @Column('integer', { nullable: true })
  exeFileRefId!: number | null

  @Column('integer', { nullable: true })
  rootFileRefId!: number | null

  @Column('boolean', { default: false })
  deleted!: boolean
}

@Entity('item_and_category')
export class ItemAndCategory {
  @PrimaryGeneratedColumn('increment')
  id!: number | null

  @Column('integer')
  itemId!: number

  @Column('integer')
  categoryId!: number
}

@Entity('item_and_kind')
export class ItemAndKind {
  @PrimaryGeneratedColumn('increment')
  id!: number | null

  @Column('integer')
  itemId!: number

  @Column('integer')
  kindId!: number
}

//Todo. 나중에 사용할 가능성이 있어 남겨둠
@Entity('item_and_ref_file')
export class ItemAndRefFile {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column('integer')
  itemId!: number

  @Column('integer')
  refFileId!: number
}

@Entity('item_and_image')
export class ItemAndImage {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column('integer')
  itemId!: number

  @Column('integer')
  imageId!: number
}
