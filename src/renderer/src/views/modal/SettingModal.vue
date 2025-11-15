<script setup lang="ts">
import ModalTemplate from '@renderer/views/modal/ModalTemplate.vue'

defineEmits<{
  (e: 'closeItemAddModal'): void
}>()

</script>

<template>
  <ModalTemplate @close-item-add-modal="$emit('closeItemAddModal')">
    <div>setting hello</div>
  </ModalTemplate>
</template>

<style scoped></style>
