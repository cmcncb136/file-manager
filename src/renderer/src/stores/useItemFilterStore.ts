import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useItemStore } from '@renderer/stores/useItemStore'
import { ItemDto } from '@renderer/dto/itemDto'

export const useItemFilterStore = defineStore('itemFilter', () => {
  const itemStore = useItemStore()
  const { initialize } = itemStore
  const { items } = storeToRefs(itemStore)

  const selectedCategoryIds = ref<Set<number>>(new Set())
  const selectedKindIds = ref<Set<number>>(new Set())
  const searchKeyword = ref<string | null>(null)

  initialize().catch((err) => {
    console.error(err)
  })

  const filterChain = (items: ItemDto[]) => {
    let filtered = items

    const chain = {
      byCategory(categoryIds: Set<number>) {
        if (categoryIds.size > 0)
          filtered = filtered.filter((item) => item.categories.some((c) => categoryIds.has(c.id!)))
        return chain
      },
      byKind(kindIds: Set<number>) {
        if (kindIds.size > 0)
          filtered = filtered.filter((item) => item.kinds.some((k) => kindIds.has(k.id!)))
        return chain
      },
      byKeyword(keyword: string | null) {
        if (keyword == null) return chain
        if (keyword.trim())
          filtered = filtered.filter((item) =>
            item.title.toLowerCase().includes(keyword.toLowerCase())
          )
        return chain
      },
      result() {
        return filtered
      }
    }

    return chain
  }

  const filteredItems = computed(() => {
    return filterChain(items.value)
      .byCategory(selectedCategoryIds.value)
      .byKind(selectedKindIds.value)
      .byKeyword(searchKeyword.value)
      .result()
  })

  return {
    filteredItems,
    selectedKindIds,
    selectedCategoryIds,
    searchKeyword
  }
})
