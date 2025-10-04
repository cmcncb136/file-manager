import { AppDataSource } from '../main/data-source'
import { CategoryEntity } from '../entity/categoryEntity'
import { injectable } from 'tsyringe'

@injectable()
export class CategoryRepo {
  categoryRepository = AppDataSource.getRepository(CategoryEntity)

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find()
  }

  async findById(id: number): Promise<CategoryEntity | null> {
    return await this.categoryRepository.findOneBy({ id: id })
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    return await this.categoryRepository.findOneBy({ name: name })
  }

  async save(Category: CategoryEntity): Promise<CategoryEntity> {
    return await this.categoryRepository.save(Category)
  }
}
