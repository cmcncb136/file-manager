<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

import Home from '@renderer/views/Home.vue'
import Nav from '@renderer/views/Nav.vue'
import { ItemDto } from '@renderer/dto/itemDto'
import { useModalStore } from '@renderer/stores/useModalStore'
import { useThemeStore } from '@renderer/stores/useThemeStore'
import { storeToRefs } from 'pinia'
import AddItemModal from '@renderer/views/modal/AddItemModal.vue'
import EditItemModal from '@renderer/views/modal/EditItemModal.vue'
import SettingModal from '@renderer/views/modal/SettingModal.vue'

const modalStore = useModalStore()
const themeStore = useThemeStore()

const { activeModal, data } = storeToRefs(modalStore)
const { close } = modalStore
const isItemAddModal = ref(false)

const isItemEditModal = ref(false)

const isSettingModal = ref(false)
const editItem = ref()

onMounted(() => {
  themeStore.applyTheme()
})

watch(activeModal, () => {
  isItemAddModal.value = false
  isItemEditModal.value = false
  isSettingModal.value = false

  switch (activeModal.value) {
    case 'addItem':
      isItemAddModal.value = !!activeModal.value
      break
    case 'editItem':
      isItemEditModal.value = !!activeModal.value
      if (data.value) editItem.value = data.value as ItemDto
      break
    case 'setting':
      isSettingModal.value = !!activeModal.value
      break
    default:
      break
  }
})
</script>

<template>
  <AddItemModal v-if="isItemAddModal" @close-item-add-modal="close" />
  <EditItemModal v-if="isItemEditModal" :item="editItem" @close-item-add-modal="close" />
  <SettingModal v-if="isSettingModal" @close-item-add-modal="close" />

  <div class="app-container">
    <Nav />
    <Home />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  height: 100%;
}
</style>
