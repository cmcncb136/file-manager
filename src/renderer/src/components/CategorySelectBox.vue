<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { CategoryEntity } from '../../../entity/categoryEntity'

const props = defineProps<{
  categories: CategoryEntity[]
  selectedCategorySet: Set<CategoryEntity>
}>()

const emit = defineEmits<{
  (e: 'addCategory', value: string): void
  (e: 'selectCategory', value: CategoryEntity): void
  (e: 'deselectCategory', value: CategoryEntity): void
  (e: 'moveBottomScroll'): void
}>()

const categoryBox = ref<HTMLElement>()
const categoryInputValue = ref<string>('')

const filteredCategoryList = computed(() => {
  const value = categoryInputValue.value

  return props.categories
    .filter((it) => !props.selectedCategorySet.has(it))
    .filter((it) => it.name.toLowerCase().includes(value.toLowerCase()))
})

watch(filteredCategoryList, async (): Promise<void> => {
  await nextTick()
  emit('moveBottomScroll')
})
</script>

<template>
  <div ref="categoryBox" class="category-box">
    <div>categories</div>
    <div class="category-input-box">
      <input
        id="category-input"
        v-model="categoryInputValue"
        type="text"
        class="category-input"
        placeholder="category filter and add"
        @keyup.enter="$emit('addCategory', categoryInputValue)"
      />
      <button class="category-add-btn">
        <i class="pi pi-search-plus" />
      </button>
    </div>
    <div class="category-select-box">
      <div class="category-select-list-box">
        [category list]
        <div
          v-for="(category, i) in filteredCategoryList"
          :key="i"
          class="category category-no-select"
          @click="$emit('selectCategory', category)"
        >
          {{ category.name }}
        </div>
      </div>
      <div class="category-selected-line-box">
        [selected list]
        <div
          v-for="(category, i) in selectedCategorySet"
          :key="i"
          class="category category-select"
          @click="$emit('deselectCategory', category)"
        >
          {{ category.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category {
  transition: 0.1s;
  border-radius: 5px;
}

.category-no-select:hover {
  color: white;
  background-color: #008cff;
}

.category-select:hover {
  color: white;
  background-color: #ff5e5e;
}

.category-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.category-input-box {
  display: flex;
  gap: 5px;
  padding-block: 5px;
  flex-direction: row;
  width: 100%;
}

.category-input {
  border-radius: 7px;
  border: 1px solid var(--input-border-color);
  background-color: var(--input-bg-color);
  color: var(--text-color);
  max-width: 94%;
  flex-grow: 1;
  margin-inline: 5px;
  font-size: medium;
  padding: 4px;
}

.category-select-box {
  display: flex;
  width: 100%;
  text-align: center;
  color: var(--text-color);
}

.category-add-btn {
  background-color: var(--btn-bg-color);
  border: 1px solid var(--border-color);
  font-weight: bold;
  padding-block: 5px;
  padding-inline: 10px;
  font-size: medium;
  color: var(--text-color);
  aspect-ratio: 1;
  border-radius: 4px;
}

.category-select-list-box {
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  border-radius: 10px;
  width: 50%;
  margin: 5px;
  max-height: 300px;
  overflow-y: auto;
}

.category-selected-line-box {
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  border-radius: 10px;
  width: 50%;
  margin: 5px;
  max-height: 300px;
  overflow-y: auto;
}
</style>
