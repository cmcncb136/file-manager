<script setup lang="ts">
import { useCategoryStore } from '@renderer/stores/useCategoryStore'
import { onMounted, ref, watch } from 'vue'
import { useKindStore } from '@renderer/stores/useKindStore'
import { useModalStore } from '@renderer/stores/useModalStore'
import { CategoryEntity } from '../../../entity/categoryEntity'
import { KindEntity } from '../../../entity/kindEntity'
import { useItemStore } from '@renderer/stores/useItemStore'
import { storeToRefs } from 'pinia'

const categoryStore = useCategoryStore()
const kindStore = useKindStore()
const modalStore = useModalStore()
const itemStore = useItemStore()

const { open } = modalStore
const { filterCategoryIds, filterKindIds, filterTitle } = storeToRefs(itemStore)

onMounted(() => {
  categoryStore.fetchCategories()
  kindStore.fetchKinds()
})

const selectedCategoryIds = ref<Set<number>>(new Set())
const selectedKindIds = ref<Set<number>>(new Set())
const searchText = ref<string>('')

const categoryClickHandler = async (category: CategoryEntity): Promise<void> => {
  if (selectedCategoryIds.value.has(category.id!)) {
    selectedCategoryIds.value.delete(category.id!)
    filterCategoryIds.value.delete(category.id!)
    return
  }

  selectedCategoryIds.value.add(category.id!)
  filterCategoryIds.value.add(category.id!)
}

const kindClickHandler = async (kind: KindEntity): Promise<void> => {
  if (selectedKindIds.value.has(kind.id!)) {
    selectedKindIds.value.delete(kind.id!)
    filterKindIds.value.delete(kind.id!)
    return
  }

  selectedKindIds.value.add(kind.id!)
  filterKindIds.value.add(kind.id!)
}

watch(
  () => searchText.value,
  () => {
    filterTitle.value = searchText.value
  }
)
</script>

<template>
  <div class="main-container">
    <div class="search-container">
      <input v-model="searchText" type="text" />
      <button class="search-button control-button">
        <i class="pi pi-search" />
      </button>
      <button class="add-button control-button" @click="open('addItem')">ADD</button>
    </div>
    <div class="control-container">
      <div class="kind-container">
        <div
          v-for="kind in kindStore.kinds"
          :key="kind.id!"
          class="kind"
          :class="{ 'kind-select': selectedKindIds.has(kind.id!) }"
          @click="kindClickHandler(kind)"
        >
          {{ kind.name }}
        </div>
      </div>
      <div class="category-container">
        <div
          v-for="(category, i) in categoryStore.categories"
          :key="i"
          class="category"
          :class="{ 'category-select': selectedCategoryIds.has(category.id!) }"
          @click="categoryClickHandler(category)"
        >
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
  border-color: #535bf2;
  color: #535bf2;
}

.kind:hover {
  border-color: #ff5e5e;
  color: #ff5e5e;
}

.category-select {
  background-color: #535bf2;
  color: white;
}

.kind-select {
  background-color: #ff5e5e;
  color: white;
}

.category-select:hover {
  color: black;
}

.kind-select:hover {
  color: black;
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
