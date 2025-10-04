import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('file_ref')
export class FileRefEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number | null

  @Column('text')
  linkFilePath!: string

  @Column('text')
  realPath!: string
}
