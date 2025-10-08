<script setup lang="ts">
import { useCategoryStore } from '@renderer/stores/useCategoryStore'
import { onMounted } from 'vue'
import { useKindStore } from '@renderer/stores/useKindStore'

const categoryStore = useCategoryStore()
const kindStore = useKindStore()

onMounted(() => {
  categoryStore.fetchCategories()
  kindStore.fetchKinds()
})
</script>

<template>
  <div class="main-container">
    <div class="search-container">
      <input type="text" />
      <button class="search-button control-button">
        <i class="pi pi-search" />
      </button>
      <button class="add-button control-button" @click="$emit('openItemAddModal')">ADD</button>
    </div>
    <div class="control-container">
      <div class="kind-container">
        <div v-for="kind in kindStore.kinds" :key="kind.id!" class="kind">{{ kind.name }}</div>
      </div>
      <div class="category-container">
        <div v-for="(category, i) in categoryStore.categories" :key="i" class="category">
          {{ category.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.control-container {
  max-width: 100%;
}

.kind-container {
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  gap: 5px;
  height: 50px;
}

.kind {
  color: #3f3f3f;
  border: 1px solid gainsboro;
  border-radius: 10px;
  padding: 5px;
  font-weight: 550;
  max-width: 100px;
}

.category-container {
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  gap: 5px;
  height: 50px;
}

.category {
  border: 1px solid gainsboro;
  border-radius: 5px;
  padding: 5px;
  color: #3f3f3f;
  font-size: small;
  font-weight: 550;
  transition: 0.3s;
}

.category:hover {
  background-color: #535bf2;
  color: white;
}

.kind:hover {
  background-color: #ff5e5e;
  color: white;
}

.main-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  gap: 10px;
}

input {
  height: 100%;
  border-radius: 5px;
  border: 1px solid #ccc;
  flex: 1;
  padding-inline: 4px;
}

.control-button {
  height: 100%;
  font-weight: bold;
}

.search-button {
  background-color: #008cff;
  aspect-ratio: 1;
  padding: 0;
  color: white;
}

.add-button {
  background-color: #9afaa1;
  font-size: small;
}

button:hover {
  filter: brightness(0.8);
}
</style>
