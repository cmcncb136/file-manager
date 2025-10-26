<script setup lang="ts">
import { ref } from 'vue'

const inputRef = ref<HTMLDivElement>()
const isExpanded = ref<boolean>(false)
const isHovered = ref<boolean>(false)
const searchText = ref<HTMLDivElement>()

const { placeholder = '검색어 입력' } = defineProps<{
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'onSearchChange', v: string): void
  (e: 'onSearchEnter', v: string): void
}>()

const onMouseEnter = (): void => {
  isHovered.value = true
  isExpanded.value = true
}

const onMouseLeave = (): void => {
  isHovered.value = false
  // focus 중이 아닐 때만 닫기
  if (document.activeElement !== inputRef.value) {
    isExpanded.value = false
  }
}

const onTransitionEnd = (e: TransitionEvent): void => {
  if (e.propertyName === 'width' && isExpanded.value) {
    inputRef.value?.focus()
  }
}

const onBlur = (): void => {
  if (!isHovered.value) {
    isExpanded.value = false
  }
}

const enterHandler = (): void => {
  emit('onSearchEnter', searchText.value)
  searchText.value = ''
}
</script>

<template>
  <div
    class="extend-search-container"
    :class="{ expanded: isExpanded }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @transitionend="onTransitionEnd"
  >
    <input
      v-show="isExpanded"
      ref="inputRef"
      v-model="searchText"
      type="text"
      class="search-input"
      :placeholder="placeholder"
      @change="$emit('onSearchChange', $event.target.value)"
      @keydown.enter="enterHandler"
      @blur="onBlur"
    />
    <i v-show="!isExpanded" class="pi pi-search" />
  </div>
</template>

<style scoped>
.extend-search-container {
  border-radius: 10px;
  padding-block: 4px;
  padding-inline: 8px;
  margin-inline: 5px;
  transition: width 0.5s ease;
  width: 35px;
  height: 35px;
}

.extend-search-container:focus {
  width: 150px;
  border: 2px solid #efd653;
}

.extend-search-container.expanded {
  width: 150px;
}

.search-input {
  flex: 1;
  margin-right: 4px;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
}

.search-input::placeholder {
  color: inherit;
}
</style>
