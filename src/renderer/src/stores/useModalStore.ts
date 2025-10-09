import { defineStore } from 'pinia'
import { ref } from 'vue'

//Todo. 추후 타입 안정성이 필요하면 리팩토링
export const useModalStore = defineStore('modal', () => {
  const activeModal = ref<string | null>(null)
  const data = ref<unknown>(null)

  function open(name: string, payload?: unknown): void {
    activeModal.value = name
    if (payload) data.value = payload
  }

  function close(): void {
    activeModal.value = null
    data.value = null
  }

  return { activeModal, data, open, close }
})
