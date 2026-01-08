<script setup lang="ts">
import ModalTemplate from '@renderer/views/modal/ModalTemplate.vue'
import { onMounted, ref } from 'vue'
import { useCategoryStore } from '@renderer/stores/useCategoryStore'
import { useKindStore } from '@renderer/stores/useKindStore'
import { storeToRefs } from 'pinia'

const emit = defineEmits<{
  (e: 'closeItemAddModal'): void
}>()

const categoryStore = useCategoryStore()
const kindStore = useKindStore()
const { categories } = storeToRefs(categoryStore)
const { kinds } = storeToRefs(kindStore)

const newCategoryName = ref('')
const newKindName = ref('')

onMounted(async () => {
  await Promise.all([categoryStore.fetchCategories(), kindStore.fetchKinds()])
})

const addCategory = async () => {
  if (!newCategoryName.value.trim()) return
  await categoryStore.saveCategory(newCategoryName.value.trim())
  newCategoryName.value = ''
}

const addKind = async () => {
  if (!newKindName.value.trim()) return
  await kindStore.saveKind(newKindName.value.trim())
  newKindName.value = ''
}

const exportDb = async () => {
  const result = await window.electron.ipcRenderer.invoke('export-db')
  if (result) {
    alert('Database exported successfully!')
  }
}

const importDb = async () => {
  const result = await window.electron.ipcRenderer.invoke('import-db')
  if (result) {
    alert('Database imported successfully. The application will restart.')
  }
}
</script>

<template>
  <ModalTemplate @close-item-add-modal="$emit('closeItemAddModal')">
    <div class="setting-container">
      <h2 class="title">Settings</h2>

      <div class="section">
        <h3>Category Management</h3>
        <div class="add-row">
          <input
            v-model="newCategoryName"
            type="text"
            placeholder="New Category Name"
            @keyup.enter="addCategory"
          />
          <button class="btn primary" @click="addCategory">Add</button>
        </div>
        <div class="list">
          <span v-for="cat in categories" :key="cat.id!" class="tag">{{ cat.name }}</span>
        </div>
      </div>

      <div class="section">
        <h3>Kind Management</h3>
        <div class="add-row">
          <input
            v-model="newKindName"
            type="text"
            placeholder="New Kind Name"
            @keyup.enter="addKind"
          />
          <button class="btn primary" @click="addKind">Add</button>
        </div>
        <div class="list">
          <span v-for="kind in kinds" :key="kind.id!" class="tag">{{ kind.name }}</span>
        </div>
      </div>

      <div class="section footer-section">
        <h3>Database Management</h3>
        <div class="btn-group">
          <button class="btn secondary" @click="exportDb">Export DB (SQL)</button>
          <button class="btn danger" @click="importDb">Import DB & Restart</button>
        </div>
      </div>
    </div>
  </ModalTemplate>
</template>

<style scoped>
.setting-container {
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  color: #333;
}

.title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #222;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #666;
  margin: 0;
}

.add-row {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #646cff;
}

.list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 100px;
  overflow-y: auto;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 8px;
}

.tag {
  background: white;
  border: 1px solid #eee;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: #555;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn.primary {
  background-color: #646cff;
  color: white;
}

.btn.primary:hover {
  background-color: #535bf2;
}

.btn.secondary {
  background-color: #f1f3f5;
  color: #495057;
}

.btn.secondary:hover {
  background-color: #e9ecef;
}

.btn.danger {
  background-color: #fff5f5;
  color: #fa5252;
  border: 1px solid #ffc9c9;
}

.btn.danger:hover {
  background-color: #ffe3e3;
}

.btn-group {
  display: flex;
  gap: 12px;
}

.footer-section {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>
