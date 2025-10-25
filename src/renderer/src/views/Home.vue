<script setup lang="ts">
import ViewTemplate from '../components/ViewTemplate.vue'
import { storeToRefs } from 'pinia'
import { useItemFilterStore } from '@renderer/stores/useItemFilterStore'

const itemFilterStore = useItemFilterStore()
const { filteredItems } = storeToRefs(itemFilterStore)

</script>

<template>
  <div class="main-container">
    <div class="content-container">
      <div v-for="item in filteredItems" :key="item.id!" class="item-container">
        <ViewTemplate :item="item" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  justify-items: center;
  gap: 10px;
}

.main-container {
  min-height: 75%;
  width: 100vw;
  background-color: white;
  flex-direction: column;
  overflow-y: auto;
}
</style>
