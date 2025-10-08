<script setup lang="ts">
import ViewTemplate from '../components/ViewTemplate.vue'
import { useItemStore } from '@renderer/stores/useItemStore'
import { nextTick, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const itemStore = useItemStore()
const { fetchItems } = itemStore
const { items } = storeToRefs(itemStore)

onMounted(async () => {
  await fetchItems()
  await nextTick()
  console.log(JSON.stringify(items.value))
})
</script>

<template>
  <div class="main-container" @click="fetchItems">
    <div class="content-container">
      <div class="item-container" v-for="item in items" :key="item.id!">
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
