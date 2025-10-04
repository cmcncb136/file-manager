import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('image_mapping')
export class ImageMappingEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number | null

  @Column('text')
  realPath!: string

  @Column('text')
  copyPath!: string
}
