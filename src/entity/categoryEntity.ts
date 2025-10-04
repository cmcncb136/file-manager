import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number | null

  @Column('text')
  name!: string

  @Column('integer', { nullable: true })
  imgId!: number | null

  @Column('boolean', { default: false })
  deleted!: boolean
}
