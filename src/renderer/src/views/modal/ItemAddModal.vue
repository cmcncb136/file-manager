<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import noImage from '/src/assets/no_img.png'
import { useCategoryStore } from '@renderer/stores/useCategoryStore'
import { useKindStore } from '@renderer/stores/useKindStore'
import { storeToRefs } from 'pinia'

const categoryStore = useCategoryStore()
const kindStore = useKindStore()

const { saveCategory } = categoryStore
const { categories } = storeToRefs(categoryStore)

kindStore.fetchKind()
const { kinds } = storeToRefs(kindStore)

const cancelBtnOverEnterHandler = (e: Event): void => {
  const target = e.target as HTMLInputElement
  target.innerHTML = 'X'
}

const cancelBtnOverLeaveHandler = (e: Event): void => {
  const target = e.target as HTMLInputElement
  target.innerHTML = ''
}

const mainImg = ref<string>(noImage)
const mainImgPath = ref<string | null>(null)

const rootPath = ref<string | null>('')

const mainImgLabel = ref()
const MAIN_IMAGE_NULL_LABEL_MSG = 'Select Main Image'
const selectedKindList = ref<number[]>([])

const modalBodyRight = ref<HTMLElement>()
const categoryInputValue = ref<string>('')

const filteredCategoryList = computed(() => {
  const value = categoryInputValue.value
  return categories.value.filter((it) => it.name.toLowerCase().includes(value.toLowerCase()))
})

watch(filteredCategoryList, async () => {
  await nextTick()
  if (modalBodyRight.value) modalBodyRight.value.scrollTop = modalBodyRight.value.scrollHeight
})

watch(mainImgPath, () => {
  if (!mainImgPath.value) mainImgLabel.value.innerHTML = MAIN_IMAGE_NULL_LABEL_MSG

  mainImgLabel.value.innerHTML = mainImgPath.value
})

const selectFileHandler = async () => {
  if (window.api) {
    const path = await window.api.selectImage()
    if (!path) return

    mainImgPath.value = path
    // await window.api.callService('ImageMappingService', 'saveByPath', [path])
    const url = encodeURI(path.replace(/\\/g, '/'))
    mainImg.value = 'file://' + url
  } else {
    console.log('Electron API not available')
  }
}

const addCategoryHandler = () => {
  addCategory(categoryInputValue.value)
}

const addCategory = (category: string) => {
  if (categories.value.filter((it) => it.name.toLowerCase() === category.toLowerCase()).length > 0)
    return
  saveCategory(categoryInputValue.value)
}

const findFileHandler = async (): Promise<void> => {
  if (window.api) {
    const path = await window.api.selectFile()
    if (!path) return

    rootPath.value = path
  }
}

const saveHandler = () => {}
</script>

<template>
  <div class="background" @scroll.stop="" @click="$emit('closeItemAddModal')">
    <div class="modal-content" @click.stop="">
      <div class="modal-header">
        <button
          class="cancel-btn"
          @mouseenter="cancelBtnOverEnterHandler($event)"
          @mouseleave="cancelBtnOverLeaveHandler($event)"
          @click.stop="$emit('closeItemAddModal')"
        />
      </div>

      <div class="modal-body">
        <div ref="modalBodyRight" class="modal-body-left">
          <div style="border-radius: 10px; overflow: hidden; border: 1px gainsboro solid">
            <img
              @click="selectFileHandler"
              style="max-height: 30vh; width: 15vw"
              :src="mainImg"
              alt=""
            />
          </div>

          <div class="setting-left-box">
            <button @click="selectFileHandler" ref="mainImgLabel" class="input-file-main-image">
              {{ MAIN_IMAGE_NULL_LABEL_MSG }}
            </button>
          </div>
        </div>
        <div class="modal-body-right">
          <div class="setting-right-box">
            <input class="input-box" id="title" placeholder="title" type="text" />
          </div>
          <div class="setting-right-box" @click="findFileHandler">
            <div style="display: flex; flex-direction: column; width: 100%">
              <div>ROOT FILE(folder) :</div>
              <div style="display: flex; width: 100%; gap: 5px">
                <input disabled class="input-box" :value="rootPath" />
                <button id="fileFindBtn">F</button>
              </div>
            </div>
          </div>

          <div class="setting-right-box">
            <div class="kind-box">
              <div>kinds</div>
              <div class="kind-line-box">
                <div v-for="kind in kinds" :key="kind.id!">
                  <input
                    v-model="selectedKindList"
                    type="checkbox"
                    :value="kind.id!"
                    :id="String(kind.id!)"
                    hidden
                  />
                  <label
                    :class="{
                      'kind-select': selectedKindList.includes(kind.id!),
                      'kind-no-select': !selectedKindList.includes(kind.id!)
                    }"
                    class="kind"
                    :for="String(kind.id!)"
                    >{{ kind.name }}</label
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="setting-right-box">
            <div class="category-box">
              <div>categories</div>
              <div class="category-input-box">
                <input
                  v-model="categoryInputValue"
                  @keyup.enter="addCategoryHandler"
                  type="text"
                  class="category-input"
                  id="category-input"
                  placeholder="category filter and add"
                />
                <button class="category-add-btn">+</button>
              </div>
              <div class="category-select-box">
                <div class="category-select-list-box">
                  [category list]
                  <div v-for="(category, i) in filteredCategoryList" :key="i">
                    {{ category.name }}
                  </div>
                </div>
                <div class="category-selected-line-box">[selected list]</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button id="saveBtn">save</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:hover {
  filter: brightness(0.8);
}

.input-file-main-image {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  font-size: small;
}

#fileFindBtn {
  background-color: #f0dc4e;
  margin: 0;
  padding: 0;
  aspect-ratio: 1;
  height: 2em;
}

#saveBtn {
  background-color: #535bf2;
  color: white;
  margin: 10px;
  padding: 5px;
  flex-grow: 1;
}

.background {
  background-color: rgba(0, 0, 0, 0.25);
  height: 100vh;
  width: 100vw;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
}

.modal-content {
  background-color: white;
  display: flex;
  width: 60vw;
  min-width: 600px;
  height: 60vh;
  border-radius: 20px;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: right;
  align-items: flex-start;
  padding: 10px;
}

.modal-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.modal-body {
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}

.modal-body-left {
  flex: 0.3;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.modal-body-right {
  flex: 0.7;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: auto;
}

.cancel-btn {
  margin: 0;
  border-radius: 50px;
  aspect-ratio: 1;
  width: 20px;
  background-color: #ff5e5e;
  font-size: 10px;
  padding: 0;
  color: #2c2c2c;
  font-weight: 600;
}

.setting-right-box {
  margin-block: 10px;
  width: 100%;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-left-box {
  margin: 10px;
}

.kind-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.input-box {
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 5px;
  font-size: 1em;
  height: 2em;
  width: 80%;
  display: flex;
  align-items: center;
}

.kind-line-box {
  display: flex;
  width: 100%;
  overflow-x: auto;
  gap: 5px;
  padding-block: 5px;
}

.kind {
  color: #3f3f3f;
  border: 1px solid gainsboro;
  border-radius: 10px;
  padding: 5px;
  font-weight: 550;
  transition: 0.25s;
}

.kind-select {
  color: white;
  background-color: #ff5e5e;
}

.kind-no-select:hover {
  color: deepskyblue;
  border: 1px solid deepskyblue;
}

.category {
  color: #3f3f3f;
  border: 1px solid gainsboro;
  border-radius: 10px;
  padding: 5px;
  font-weight: 550;
  transition: 0.25s;
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
  flex-wrap: wrap;
  width: 100%;
}

.category-input {
  padding: 5px;
  border-radius: 7px;
  border: 1px solid #ccc;
  flex-grow: 1;
  margin-inline: 5px;
  font-size: medium;
}

.category-select-box {
  display: flex;
  width: 100%;
  text-align: center;
}

.category-add-btn {
  background-color: rgb(255, 94, 94);
  font-weight: bold;
  padding-block: 5px;
  padding-inline: 10px;
  font-size: large;
  color: white;
  aspect-ratio: 1;
}

.category-select-list-box {
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 50%;
  margin: 5px;
  max-height: 300px;
  overflow-y: auto;
}

.category-selected-line-box {
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 50%;
  margin: 5px;
  max-height: 300px;
  overflow-y: auto;
}
</style>
