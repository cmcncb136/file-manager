import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { CategoryEntity } from '../entity/categoryEntity'
import { KindEntity } from '../entity/kindEntity'
import { ItemEntity, ItemAndCategory, ItemAndKind } from '../entity/itemEntity'
import { ImageMappingEntity } from '../entity/imageMappingEntity'
import { FileRefEntity } from '../entity/fileRefEntity'
import path from 'node:path'
import { app } from 'electron'

const dbPath = path.join(app.getPath('userData'), 'database.sqlite')

console.log(dbPath)

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbPath, // 로컬 DB 파일
  synchronize: true, // 개발용: 엔티티 기반 테이블 자동 생성
  logging: true,
  entities: [
    CategoryEntity,
    KindEntity,
    ItemEntity,
    ItemAndCategory,
    ItemAndKind,
    ImageMappingEntity,
    FileRefEntity
  ],
  migrations: [],
  subscribers: []
})
