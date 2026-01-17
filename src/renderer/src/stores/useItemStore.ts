import { defineStore, storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { Item } from '../../../domain/item'
import { useCategoryStore } from '@renderer/stores/useCategoryStore'
import { useKindStore } from '@renderer/stores/useKindStore'
import { SaveItemDto } from '@renderer/dto/saveItemDto'
import { ItemDto } from '@renderer/dto/itemDto'
import { ItemWithPathRequestDto } from '@renderer/dto/itemWithPathRequestDto'
import { UpdateItemDto } from '@renderer/dto/updateItemDto'

let initialized = false
export const useItemStore = defineStore('item', () => {
  const rawItems = ref<ItemWithPathRequestDto[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const sortBy = ref<'title' | 'createdAt' | 'updatedAt' | 'isFavorite'>('title')
  const sortOrder = ref<'asc' | 'desc'>('asc')

  const categoryStore = useCategoryStore()
  const kindStore = useKindStore()

  const { categoryMap } = storeToRefs(categoryStore)
  const { kindMap } = storeToRefs(kindStore)

  const { fetchCategories } = useCategoryStore()
  const { fetchKinds } = useKindStore()

  //Todo. 추후 수정
  const items = computed(() => {
    const mappedItems = rawItems.value.map((item: ItemWithPathRequestDto) => {
      return {
        id: item.id!,
        title: item.title,
        description: item.description,
        mainImg: item.mainImg,
        exeFile: item.exeFile,
        rootFile: item.rootFile,
        deleted: item.deleted,
        categories: item.categoryIds.map((categoryId) => {
          return categoryMap.value.get(categoryId)
        }),
        kinds: item.kindIds.map((kindId) => {
          return kindMap.value.get(kindId)
        }),
        isFavorite: item.isFavorite,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      } as ItemDto
    })

    return mappedItems.sort((a, b) => {
      let comparison = 0
      if (sortBy.value === 'title') {
        comparison = a.title.localeCompare(b.title)
      } else if (sortBy.value === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy.value === 'updatedAt') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      } else if (sortBy.value === 'isFavorite') {
        comparison = Number(a.isFavorite) - Number(b.isFavorite)
      }

      return sortOrder.value === 'asc' ? comparison : -comparison
    })
  })

  const fetchItems = async (): Promise<void> => {
    loading.value = true
    if (categoryMap.value.size === 0) await fetchCategories()
    if (kindMap.value.size === 0) await fetchKinds()

    try {
      rawItems.value = await window.api.callService('ItemService', 'findItemWithPathAll')
    } catch (err: never | unknown) {
      if (err instanceof Error) {
        error.value = err.message
        console.error(err)
      } else {
        error.value = 'unknown error'
      }
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (updateItem: UpdateItemDto): Promise<Item | null> => {
    try {
      const item = (await window.api.callService('ItemService', 'updateForFront', [
        JSON.stringify(updateItem)
      ])) as Item

      const changeIndex = rawItems.value.findIndex((it) => it.id === item.id)
      const itemWithPath = (await window.api.callService('ItemService', 'findItemWithPathById', [
        item.id
      ])) as ItemWithPathRequestDto

      if (changeIndex > -1) rawItems.value = rawItems.value.with(changeIndex, itemWithPath) //교체
      if (changeIndex < 0) rawItems.value.push(itemWithPath) // 없는 경우 마지막에 추가 (사실 일어나면 안되는 케이스)

      return item
    } catch (err: never | unknown) {
      if (err instanceof Error) {
        console.error(err.message)
        error.value = err.message
      } else {
        error.value = 'unknown error'
      }

      return null
    }
  }

  const saveItem = async (saveItem: SaveItemDto): Promise<Item | null> => {
    try {
      const item = (await window.api.callService('ItemService', 'saveRaw', [
        JSON.stringify(saveItem)
      ])) as Item

      rawItems.value.push(
        (await window.api.callService('ItemService', 'findItemWithPathById', [
          item.id
        ])) as ItemWithPathRequestDto
      )

      return item
    } catch (err: never | unknown) {
      if (err instanceof Error) {
        console.error(err.message)
        error.value = err.message
      } else {
        error.value = 'unknown error'
      }

      return null
    }
  }

  const toggleFavorite = async (id: number): Promise<void> => {
    try {
      await window.api.callService('ItemService', 'toggleFavorite', [id])
      const itemWithPath = (await window.api.callService('ItemService', 'findItemWithPathById', [
        id
      ])) as ItemWithPathRequestDto

      const index = rawItems.value.findIndex((it) => it.id === id)
      if (index > -1) {
        rawItems.value = rawItems.value.with(index, itemWithPath)
      }
    } catch (err: never | unknown) {
      if (err instanceof Error) {
        console.error(err.message)
        error.value = err.message
      } else {
        error.value = 'unknown error'
      }
    }
  }

  const initialize = async (): Promise<void> => {
    if (initialized) return

    initialized = true
    await fetchItems()
  }

  const setSort = (field: 'title' | 'createdAt' | 'updatedAt' | 'isFavorite', order?: 'asc' | 'desc'): void => {
    sortBy.value = field
    if (order) sortOrder.value = order
  }

  onMounted(async () => {
    if (items.value.length === 0) await fetchItems()
  })

  return {
    fetchItems,
    items,
    saveItem,
    updateItem,
    toggleFavorite,
    initialize,
    setSort,
    sortBy,
    sortOrder
  }
})
