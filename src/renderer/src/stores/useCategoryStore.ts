import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CategoryEntity } from '../../../entity/categoryEntity'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<CategoryEntity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const categoryMap = ref<Map<number, CategoryEntity>>(new Map<number, CategoryEntity>())

  const fetchCategories = async (): Promise<void> => {
    loading.value = true
    try {
      categories.value = await window.api.callService('CategoryService', 'findAll')

      categoryMap.value.clear()
      categories.value.forEach((category: CategoryEntity) => {
        categoryMap.value.set(category!.id!, category)
      })
    } catch (err: never | unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'unknown error'
      }
    } finally {
      loading.value = false
    }
  }

  const saveCategory = async (name: string): Promise<CategoryEntity | null> => {
    try {
      const savedCategory: CategoryEntity = await window.api.callService(
        'CategoryService',
        'saveByName',
        [name]
      )

      //이전에 없는 값이면 추가
      if (!categories.value.find((it) => it.id === savedCategory.id)) {
        categories.value.push(savedCategory)
        categoryMap.value.set(savedCategory.id!, savedCategory)
      }

      return savedCategory
    } catch (err: never | unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'unknown error'
      }

      return null
    }
  }

  return {
    categories,
    fetchCategories,
    saveCategory,
    categoryMap
  }
})
