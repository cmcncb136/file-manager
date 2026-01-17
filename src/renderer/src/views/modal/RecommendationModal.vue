<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ModalTemplate from './ModalTemplate.vue'

const props = defineProps<{
  query: string
  suggestedQueries?: string[]
}>()

const emit = defineEmits<{
  (e: 'select', url: string): void
  (e: 'close'): void
}>()

const images = ref<string[]>([])
const loading = ref(true)
const searchQuery = ref(props.query)

const performSearch = async (): Promise<void> => {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  try {
    const results = await window.api.callService(
      'ImageRecommendationService', 
      'searchImages', 
      [searchQuery.value]
    )
    images.value = results
  } catch (err) {
    console.error('Failed to search images', err)
  } finally {
    loading.value = false
  }
}

onMounted((): void => {
  performSearch()
})

const selectImage = (url: string): void => {
  emit('select', url)
}

const handleKeydown = (e: KeyboardEvent): void => {
  if (e.key === 'Enter') {
    performSearch()
  }
}
</script>

<template>
  <ModalTemplate @close-item-add-modal="$emit('close')">
    <div class="recommendation-container">
      <div class="header">
        <h2 class="title">Image Recommendations</h2>
        <div class="search-bar">
          <div class="input-wrapper">
            <i class="pi pi-search search-icon" />
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search images..." 
              @keydown="handleKeydown"
            />
          </div>
          <button class="search-btn" :disabled="loading" @click="performSearch">
            <i v-if="loading" class="pi pi-spin pi-spinner" />
            <span v-else>Search</span>
          </button>
        </div>
        
        <div v-if="suggestedQueries && suggestedQueries.length > 0" class="suggestions">
          <span class="suggestion-label">Suggestions:</span>
          <div class="suggestion-chips">
            <button 
              v-for="term in suggestedQueries" 
              :key="term" 
              class="suggestion-chip"
              @click="searchQuery = term; performSearch()"
            >
              {{ term }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="content">
        <div v-if="loading && images.length === 0" class="status-msg">
          <div class="loader">
            <i class="pi pi-spin pi-spinner spinner-large" />
            <p>Fetching amazing images for you...</p>
          </div>
        </div>
        
        <div v-else-if="!loading && images.length === 0" class="status-msg">
          <div class="no-results">
            <i class="pi pi-search-minus icon-large" />
            <p>No images found for "<span>{{ searchQuery }}</span>"</p>
          </div>
        </div>
        
        <div v-else class="image-grid">
          <div 
            v-for="(url, index) in images" 
            :key="index" 
            class="image-item"
            :style="{ '--delay': (index % 10) * 0.05 + 's' }"
            @click="selectImage(url)"
          >
            <div class="image-wrapper">
              <img :src="url" loading="lazy" />
              <div class="overlay">
                <i class="pi pi-check-circle" />
                <span>Select</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalTemplate>
</template>

<style scoped>
.recommendation-container {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
  backdrop-filter: blur(10px);
  color: var(--text-color);
  overflow: hidden;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(to right, #646cff, #a0a4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-bar {
  display: flex;
  gap: 12px;
  width: 100%;
}

.input-wrapper {
  position: relative;
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #888;
  font-size: 0.9rem;
}

.input-wrapper input {
  width: 100%;
  padding: 10px 10px 10px 36px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  outline: none;
}

.input-wrapper input:focus {
  border-color: #646cff;
  background: rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 0 4px rgba(100, 108, 255, 0.1);
}

.search-btn {
  padding: 10px 24px;
  border-radius: 12px;
  background: #646cff;
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  min-width: 100px;
}

.search-btn:hover:not(:disabled) {
  background: #747bff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(100, 108, 255, 0.3);
}

.search-btn:active:not(:disabled) {
  transform: translateY(0);
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.suggestions {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.suggestion-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #888;
  white-space: nowrap;
}

.suggestion-chips {
  display: flex;
  gap: 8px;
}

.suggestion-chip {
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(100, 108, 255, 0.1);
  border: 1px solid rgba(100, 108, 255, 0.2);
  color: #a0a4ff;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.suggestion-chip:hover {
  background: rgba(100, 108, 255, 0.2);
  border-color: #646cff;
  transform: translateY(-1px);
}

.suggestion-chip:active {
  transform: translateY(0);
}

.content {
  flex-grow: 1;
  overflow: hidden;
  position: relative;
}

.status-msg {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader, .no-results {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #888;
}

.spinner-large, .icon-large {
  font-size: 3rem;
  color: #646cff;
}

.no-results span {
  color: #646cff;
  font-weight: 600;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  height: 100%;
  overflow-y: auto;
  padding: 4px;
  padding-bottom: 24px;
}

/* Custom Scrollbar */
.image-grid::-webkit-scrollbar {
  width: 8px;
}
.image-grid::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
.image-grid::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.image-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

.image-item {
  aspect-ratio: 1;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.03);
  position: relative;
  animation: fadeInUp 0.4s ease forwards;
  animation-delay: var(--delay);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.image-item:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
}

.image-item:hover img {
  transform: scale(1.1);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(100, 108, 255, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: all 0.3s ease;
  color: white;
  font-weight: 700;
}

.image-item:hover .overlay {
  opacity: 1;
}

.overlay i {
  font-size: 2rem;
}
</style>
