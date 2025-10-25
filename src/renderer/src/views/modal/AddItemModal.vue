<script setup lang="ts">
import ModalTemplate from '@renderer/views/modal/ModalTemplate.vue'
import ItemTemplateModal from '@renderer/views/modal/ItemTemplateModal.vue'
import { useItemStore } from '@renderer/stores/useItemStore'
import { SaveItemDto } from '@renderer/dto/saveItemDto'

const itemStore = useItemStore()
const { saveItem } = itemStore

const emit = defineEmits<{
  (e: 'closeItemAddModal'): void
}>()

const save = async (itemDto: SaveItemDto): Promise<void> => {
  const item = await saveItem(itemDto)
  if (item) emit('closeItemAddModal')
}
</script>

<template>
  <ModalTemplate @close-item-add-modal="$emit('closeItemAddModal')">
    <ItemTemplateModal @submit="save" />
  </ModalTemplate>
</template>

<style scoped></style>
