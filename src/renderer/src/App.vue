<script setup lang="ts">
import { ref } from 'vue'

import ItemAddModal from '@renderer/views/modal/ItemAddModal.vue'
import Home from '@renderer/views/Home.vue'
import Nav from '@renderer/views/Nav.vue'

const isItemAddModal = ref(false)

const openItemAddModal = (): void => {
  isItemAddModal.value = true
}

const closeItemAddModal = (): void => {
  isItemAddModal.value = false
}
</script>

<template>
  <ItemAddModal v-if="isItemAddModal" @close-item-add-modal="closeItemAddModal" />

  <div
    style="
      display: flex;
      flex-direction: column;
      align-content: center;
      height: 100%;
    "
  >
    <Nav @open-item-add-modal="openItemAddModal" />
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
