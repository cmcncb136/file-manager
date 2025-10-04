import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('kind')
export class KindEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number | null

  @Column('text')
  name!: string

  @Column('integer', { nullable: true })
  imgId!: number | null

  @Column('boolean', { default: false })
  deleted!: boolean
}
