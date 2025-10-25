import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { Item } from '../../../domain/item'
import { useCategoryStore } from '@renderer/stores/useCategoryStore'
import { useKindStore } from '@renderer/stores/useKindStore'
import { SaveItemDto } from '@renderer/dto/saveItemDto'
import { ItemDto } from '@renderer/dto/itemDto'
import { ItemWithPathRequestDto } from '@renderer/dto/itemWithPathRequestDto'
import { UpdateItemDto } from '@renderer/dto/updateItemDto'

export const useItemStore = defineStore('item', () => {
  const rawItems = ref<ItemWithPathRequestDto[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const filterCategoryIds = ref<Set<number>>(new Set())
  const filterKindIds = ref<Set<number>>(new Set())
  const filterTitle = ref<string | null>(null)

  const categoryStore = useCategoryStore()
  const kindStore = useKindStore()

  const { categoryMap } = storeToRefs(categoryStore)
  const { kindMap } = storeToRefs(kindStore)

  const { fetchCategories } = useCategoryStore()
  const { fetchKinds } = useKindStore()

  //Todo. 추후 수정
  const items = computed(() => {
    return rawItems.value.map((item: ItemWithPathRequestDto) => {
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
        })
      } as ItemDto
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

  const filteredItemByCategoryIds = (items: ItemDto[]): ItemDto[] => {
    if (filterCategoryIds.value.size === 0) return items

    return items.filter((item) =>
      item.categories.find((category) => filterCategoryIds.value.has(category.id!))
    )
  }

  const filteredItemByKindIds = (items: ItemDto[]): ItemDto[] => {
    if (filterKindIds.value.size === 0) return items

    return items.filter((item) => item.kinds.find((kind) => filterKindIds.value.has(kind.id!)))
  }

  const filteredItemByTitle = (items: ItemDto[]): ItemDto[] => {
    if (!filterTitle.value || filterTitle.value.trim().length === 0) return items

    return items.filter((item) =>
      item.title.toLowerCase().includes(filterTitle.value!.toLowerCase())
    )
  }

  const filteredItems = computed(() => {
    return filteredItemByTitle(filteredItemByKindIds(filteredItemByCategoryIds(items.value)))
  })

  return {
    fetchItems,
    items,
    saveItem,
    updateItem,
    filteredItems,
    filterCategoryIds,
    filterKindIds,
    filterTitle
  }
})
