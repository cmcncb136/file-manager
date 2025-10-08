import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { Item } from '../../../domain/item'
import { useCategoryStore } from '@renderer/stores/useCategoryStore'
import { useKindStore } from '@renderer/stores/useKindStore'
import { SaveItemDto } from '@renderer/dto/saveItemDto'
import { ImageMappingEntity } from '../../../entity/imageMappingEntity'
import { FileRefEntity } from '../../../entity/fileRefEntity'
import { ItemDto } from '@renderer/dto/itemDto'
import { ItemWithPathRequestDto } from '@renderer/dto/itemWithPathRequestDto'
import { ItemMapper } from '@renderer/mapper/itemMapper'

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
      let imageMapping: null | ImageMappingEntity = null
      let exeFileRef: null | FileRefEntity = null
      let rootFileRef: null | FileRefEntity = null

      if (saveItem.mainImgPath)
        imageMapping = (await window.api.callService('ImageMappingService', 'saveByPath', [
          saveItem.mainImgPath
        ])) as ImageMappingEntity

      if (saveItem.exeFileRefPath)
        exeFileRef = (await window.api.callService('FileRefService', 'saveByPath', [
          saveItem.exeFileRefPath
        ])) as FileRefEntity

      if (saveItem.rootFileRefPath)
        rootFileRef = (await window.api.callService('FileRefService', 'saveByPath', [
          saveItem.rootFileRefPath
        ])) as FileRefEntity

      const item = await window.api.callService('ItemService', 'save', [
        JSON.stringify({
          id: null,
          title: saveItem.title,
          description: saveItem.description,
          mainImgId: imageMapping?.id,
          exeFileRefId: exeFileRef?.id,
          rootFileRefId: rootFileRef?.id,
          deleted: false,
          categoryIds: saveItem.categoryIds,
          kindIds: saveItem.kindIds
        })
      ])

      rawItems.value.push(
        ItemMapper.toItemWithPathRequestDto(item, imageMapping, exeFileRef, rootFileRef)
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
