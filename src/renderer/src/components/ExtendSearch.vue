<script setup lang="ts">
import { ref, watch } from 'vue'

const inputRef = ref<HTMLDivElement>()
const isExpanded = ref<boolean>(false)
const isHovered = ref<boolean>(false)
const searchText = ref<string>()

const { placeholder = '검색어 입력' } = defineProps<{
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'on-search-change', v: string): void
  (e: 'on-search-enter', v: string): void
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
  emit('on-search-enter', searchText.value as string)
  searchText.value = ''
}

watch(
  () => searchText.value,
  () => {
    emit('on-search-change', searchText.value as string)
  }
)
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
  transition: width 0.5s ease;
  width: 80px;
  height: 40px;
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
