<script setup lang="ts">
import { ref, watch } from 'vue'

import ItemTemplateModal from '@renderer/views/modal/ItemTemplateModal.vue'
import Home from '@renderer/views/Home.vue'
import Nav from '@renderer/views/Nav.vue'
import { ItemDto } from '@renderer/dto/itemDto'
import { useModalStore } from '@renderer/stores/useModalStore'
import { storeToRefs } from 'pinia'

const modalStore = useModalStore()

const { activeModal, data } = storeToRefs(modalStore)
const { close } = modalStore
const isItemAddModal = ref(false)

const isItemEditModal = ref(false)
const editItem = ref()

watch(activeModal, () => {
  isItemAddModal.value = false
  isItemEditModal.value = false

  switch (activeModal.value) {
    case 'addItem':
      isItemAddModal.value = !!activeModal.value
      break
    case 'editItem':
      isItemEditModal.value = !!activeModal.value
      if (data.value) editItem.value = data.value as ItemDto
      break
    default:
      break
  }
})
</script>

<template>
  <ItemTemplateModal v-if="isItemAddModal" @close-item-add-modal="close" />
  <ItemTemplateModal v-if="isItemEditModal" :item="editItem" @close-item-add-modal="close" />

  <div style="display: flex; flex-direction: column; align-content: center; height: 100%">
    <Nav />
    <Home />
  </div>
</template>

<style scoped>
div {
  background-color: white;
  color: black;
}

input {
  background-color: white;
}
</style>
