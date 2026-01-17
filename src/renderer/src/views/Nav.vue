<script setup lang="ts">
import { useCategoryStore } from '@renderer/stores/useCategoryStore'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useKindStore } from '@renderer/stores/useKindStore'
import { useModalStore } from '@renderer/stores/useModalStore'
import { CategoryEntity } from '../../../entity/categoryEntity'
import { KindEntity } from '../../../entity/kindEntity'
import { storeToRefs } from 'pinia'
import { useItemFilterStore } from '@renderer/stores/useItemFilterStore'
import ExtendSearch from '@renderer/components/ExtendSearch.vue'

const categoryStore = useCategoryStore()
const kindStore = useKindStore()
const modalStore = useModalStore()
const itemFilterStore = useItemFilterStore()

const { open } = modalStore
const { selectedCategoryIds, selectedKindIds, searchKeyword } = storeToRefs(itemFilterStore)
const { kinds } = storeToRefs(kindStore)
const { categories } = storeToRefs(categoryStore)

const kindSearchText = ref<string>('')
const categorySearchText = ref<string>('')

const searchText = ref<string>('')

onMounted(() => {
  categoryStore.fetchCategories()
  kindStore.fetchKinds()
})

const categoryClickHandler = async (category: CategoryEntity): Promise<void> => {
  if (selectedCategoryIds.value.has(category.id!)) {
    selectedCategoryIds.value.delete(category.id!)
    return
  }

  selectedCategoryIds.value.add(category.id!)
}

const kindClickHandler = async (kind: KindEntity): Promise<void> => {
  if (selectedKindIds.value.has(kind.id!)) {
    selectedKindIds.value.delete(kind.id!)
    return
  }

  selectedKindIds.value.add(kind.id!)
}

watch(
  () => searchText.value,
  () => {
    searchKeyword.value = searchText.value
  }
)

const filteredKinds = computed(() => {
  if (kindSearchText.value.trim().length <= 0) return kinds.value
  return kinds.value.filter((kind) =>
    kind.name.toLowerCase().includes(kindSearchText.value.toLowerCase())
  )
})

const filteredCategories = computed(() => {
  if (categorySearchText.value.trim().length <= 0) return categories.value

  return categories.value.filter((category) =>
    category.name.toLowerCase().includes(categorySearchText.value.toLowerCase())
  )
})

const kindSearchHandler = (search: string): void => {
  kindSearchText.value = search
}

const categorySearchHandler = (search: string): void => {
  categorySearchText.value = search
}

const kindSearchEnterHandler = async (): Promise<void> => {
  await nextTick()
  filteredKinds.value.forEach((kind) => selectedKindIds.value.add(kind.id!))
}

const categorySearchEnterHandler = async (): Promise<void> => {
  await nextTick()
  filteredCategories.value.forEach((category) => selectedCategoryIds.value.add(category.id!))
}
</script>

<template>
  <div class="main-container">
    <div class="search-container">
      <input v-model="searchText" type="text" />
      <button class="search-button control-button">
        <i class="pi pi-search" />
      </button>
      <button class="add-button control-button" @click="open('addItem')">ADD</button>
      <button class="setting-button control-button" @click="open('setting')">
        <i class="pi pi-cog" />
      </button>
    </div>
    <div class="control-container">
      <div class="control-container-line">
        <ExtendSearch
          style="background-color: #ff5e5e; color: white"
          placeholder="KIND 입력"
          @on-search-change="kindSearchHandler"
          @on-search-enter="kindSearchEnterHandler"
        />
        <button v-if="selectedKindIds.size" class="reset-button" @click="selectedKindIds.clear()">
          <i class="pi pi-refresh" />
        </button>
        <div class="kind-container">
          <div
            v-for="kind in filteredKinds"
            :key="kind.id!"
            class="kind"
            :class="{ 'kind-select': selectedKindIds.has(kind.id!) }"
            @click="kindClickHandler(kind)"
          >
            {{ kind.name }}
          </div>
        </div>
      </div>
      <div class="control-container-line">
        <ExtendSearch
          style="background-color: #008cff; color: white"
          placeholder="카테고리 입력"
          @on-search-change="categorySearchHandler"
          @on-search-enter="categorySearchEnterHandler"
        />
        <button
          v-if="selectedCategoryIds.size"
          class="reset-button"
          @click="selectedCategoryIds.clear()"
        >
          <i class="pi pi-refresh" />
        </button>
        <div class="category-container">
          <div
            v-for="(category, i) in filteredCategories"
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
  color: var(--text-color);
  border: 1px solid var(--border-color);
  background-color: var(--btn-bg-color);
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

.reset-button {
  border-radius: 10px;
  padding-block: 4px;
  padding-inline: 8px;
  width: 40px;
  height: 40px;
  padding: 0;
  background-color: var(--btn-bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.control-container-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category {
  border: 1px solid var(--border-color);
  background-color: var(--btn-bg-color);
  border-radius: 5px;
  padding: 5px;
  color: var(--text-color);
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
  background-color: var(--bg-color);
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
  border: 1px solid var(--input-border-color);
  background-color: var(--input-bg-color);
  color: var(--text-color);
  flex: 1;
  padding-inline: 4px;
}

.control-button {
  height: 100%;
  font-weight: bold;
}

.search-button {
  background-color: #efd653;
  aspect-ratio: 1;
  padding: 0;
  color: white;
}

.setting-button {
  background-color: #3f3f3f;
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
