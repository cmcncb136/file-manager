<script setup lang="ts">
import ModalTemplate from '@renderer/views/modal/ModalTemplate.vue'
import ItemTemplateModal from '@renderer/views/modal/ItemTemplateModal.vue'
import { SaveItemDto } from '@renderer/dto/saveItemDto'
import { useItemStore } from '@renderer/stores/useItemStore'
import { ItemDto } from '@renderer/dto/itemDto'
import { ItemMapper } from '@renderer/mapper/itemMapper'

const itemStore = useItemStore()
const { updateItem } = itemStore

const emit = defineEmits<{
  (e: 'closeItemAddModal'): void
}>()

const props = defineProps<{
  item: ItemDto
}>()

const update = async (itemDto: SaveItemDto): Promise<void> => {
  const updatedItem = await updateItem(
    ItemMapper.saveItemDtoToUpdateItemDto(props.item.id, itemDto)
  )
  if (updatedItem == null) return

  emit('closeItemAddModal')
}
</script>

<template>
  <ModalTemplate @close-item-add-modal="$emit('closeItemAddModal')">
    <ItemTemplateModal :item="props.item" @submit="update" />
  </ModalTemplate>
</template>

<style scoped></style>
