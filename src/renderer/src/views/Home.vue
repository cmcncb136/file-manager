<script setup lang="ts">
import ViewTemplate from '../components/ViewTemplate.vue'
import { useItemStore } from '@renderer/stores/useItemStore'
import { nextTick, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const itemStore = useItemStore()
const { fetchItems } = itemStore
const { filteredItems } = storeToRefs(itemStore)

onMounted(async () => {
  await fetchItems()
  await nextTick()
  console.log(JSON.stringify(filteredItems.value))
})
</script>

<template>
  <div class="main-container" @click="fetchItems">
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
