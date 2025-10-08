import { defineStore } from 'pinia'
import { KindEntity } from '../../../entity/kindEntity'
import { ref } from 'vue'

export const useKindStore = defineStore('kind', () => {
  const kinds = ref<KindEntity[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const kindMap = ref<Map<number, KindEntity>>(new Map())

  const fetchKinds = async (): Promise<void> => {
    loading.value = true

    try {
      kinds.value = await window.api.callService('KindService', 'findAll')
      kindMap.value.clear()
      kinds.value.forEach((kind) => {
        kindMap.value.set(kind.id!, kind)
      })
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'unknown error'
      }

      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    kinds,
    fetchKinds,
    kindMap
  }
})
