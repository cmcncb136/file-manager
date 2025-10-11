import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { Item } from '../../../domain/item'
import { useCategoryStore } from '@renderer/stores/useCategoryStore'
import { useKindStore } from '@renderer/stores/useKindStore'
import { SaveItemDto } from '@renderer/dto/saveItemDto'
import { ItemDto } from '@renderer/dto/itemDto'
import { ItemWithPathRequestDto } from '@renderer/dto/itemWithPathRequestDto'

export const useItemStore = defineStore('item', () => {
  const rawItems = ref<ItemWithPathRequestDto[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

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

  return {
    fetchItems,
    items,
    saveItem
  }
})
