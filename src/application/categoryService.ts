import { injectable, inject } from 'tsyringe'
import { CategoryRepo } from '../infrastructure/categoryRepo'
import { CategoryEntity } from '../entity/categoryEntity'

@injectable()
export class CategoryService {
  constructor(@inject(CategoryRepo) private categoryRepo: CategoryRepo) {}

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepo.findAll()
  }

  async findById(id: number): Promise<CategoryEntity | null> {
    return await this.categoryRepo.findById(id)
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    return await this.categoryRepo.findByName(name)
  }

  async save(category: CategoryEntity): Promise<CategoryEntity> {
    return await this.categoryRepo.save(category)
  }

  async saveByName(name: string): Promise<CategoryEntity> {
    console.log('create target category : ', name)
    const lowerName = name.toLowerCase()
    const existCheckCategory = await this.categoryRepo.findByName(lowerName)
    if (existCheckCategory) {
      return existCheckCategory
    }

    return await this.categoryRepo.save({
      id: null,
      name: lowerName,
      imgId: null,
      deleted: false
    })
  }
}
