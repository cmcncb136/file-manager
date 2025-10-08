<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import noImage from '/src/assets/no_img.png'
import { useCategoryStore } from '@renderer/stores/useCategoryStore'
import { useKindStore } from '@renderer/stores/useKindStore'
import { storeToRefs } from 'pinia'
import { CategoryEntity } from '../../../../entity/categoryEntity'
import { useItemStore } from '@renderer/stores/useItemStore'
import { Item } from '../../../../domain/item'
import CategorySelectBox from '@renderer/components/CategorySelectBox.vue'

const emit = defineEmits<{
  (e: 'closeItemAddModal'): void
}>()

const categoryStore = useCategoryStore()
const kindStore = useKindStore()
const itemStore = useItemStore()

const { saveCategory } = categoryStore
const { categories } = storeToRefs(categoryStore)
const { saveItem } = itemStore

kindStore.fetchKinds()
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

const rootPathInput = ref<HTMLInputElement>()
const exePathInput = ref<HTMLInputElement>()
const titleInput = ref<HTMLInputElement>()

const mainImgLabel = ref()
const MAIN_IMAGE_NULL_LABEL_MSG = 'Select Main Image'
const selectedKindList = ref<number[]>([])

const modalBodyRight = ref<HTMLElement>()
const categoryInputValue = ref<string>('')
const selectedCategorySet = ref<Set<CategoryEntity>>(new Set<CategoryEntity>())

const moveBottomScroll = async () => {
  if (modalBodyRight.value) {
    console.log('height : ' + modalBodyRight.value.scrollHeight)
    modalBodyRight.value.scrollTop = modalBodyRight.value.scrollHeight
  }
}

watch(mainImgPath, () => {
  if (!mainImgPath.value) mainImgLabel.value.innerHTML = MAIN_IMAGE_NULL_LABEL_MSG

  mainImgLabel.value.innerHTML = mainImgPath.value
})

const selectFileHandler = async () => {
  if (window.api) {
    const path = await window.api.selectImage()
    if (!path) return

    mainImgPath.value = path
    const url = encodeURI(path.replace(/\\/g, '/'))
    mainImg.value = 'file://' + url
  } else {
    console.log('Electron API not available')
  }
}

const addCategory = (category: string) => {
  if (categories.value.filter((it) => it.name.toLowerCase() === category.toLowerCase()).length > 0)
    return
  saveCategory(categoryInputValue.value)
}

const findFileHandler = async (target: HTMLInputElement | undefined): Promise<void> => {
  if (window.api) {
    const path = await window.api.selectFile()
    if (!path || !target) return

    target.value = path
  }
}

const findFolderHandler = async (target: HTMLInputElement | undefined): Promise<void> => {
  if (window.api) {
    const path = await window.api.selectFolder()
    if (!path || !target) return

    target.value = path
  }
}

const selectCategory = (category: CategoryEntity): void => {
  if (selectedCategorySet.value.has(category)) return
  selectedCategorySet.value.add(category)
}

const deselectCategory = (category: CategoryEntity): void => {
  selectedCategorySet.value.delete(category)
}

const saveHandler = (): void => {
  if (titleInput.value?.value.trim() === '') {
    titleInput.value.value = ''
    titleInput.value.focus()
    return
  }

  let exePath: string | null = null
  let rootPath: string | null = null

  if (exePathInput.value && exePathInput.value?.value.trim() !== '')
    exePath = exePathInput.value.value

  if (rootPathInput.value && rootPathInput.value?.value.trim() !== '')
    rootPath = rootPathInput.value.value

  save(titleInput.value!.value!, mainImgPath.value, exePath, rootPath).then((item) => {
    if (item != null) emit('closeItemAddModal')
  })

  //Todo. 연속 저장 방지 칠요할 수도 있음
}

const save = async (
  title: string,
  mainImgPath: string | null,
  exePath: string | null,
  rootPath: string | null
): Promise<Item | null> => {
  return await saveItem({
    title: title,
    description: 'test',
    mainImgPath: mainImgPath,
    exeFileRefPath: exePath,
    rootFileRefPath: rootPath,
    categoryIds: [...selectedCategorySet.value].map((it) => it.id!),
    kindIds: selectedKindList.value.values().toArray()
  })
}
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
        <div class="modal-body-left">
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
        <div ref="modalBodyRight" class="modal-body-right">
          <div class="setting-right-box">
            <input ref="titleInput" class="input-box" id="title" placeholder="title" type="text" />
          </div>
          <div class="setting-right-box" @click="findFolderHandler(rootPathInput)">
            <div style="display: flex; flex-direction: column; width: 100%">
              <div>Root Folder :</div>
              <div style="display: flex; width: 100%; gap: 5px">
                <input ref="rootPathInput" disabled class="input-box" />
                <button class="file-find-btn">
                  <i class="pi pi-folder" />
                </button>
              </div>
            </div>
          </div>

          <div class="setting-right-box" @click="findFileHandler(exePathInput)">
            <div style="display: flex; flex-direction: column; width: 100%">
              <div>EXE FILE :</div>
              <div style="display: flex; width: 100%; gap: 5px">
                <input ref="exePathInput" disabled class="input-box" />
                <button class="file-find-btn">
                  <i class="pi pi-folder" />
                </button>
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
            <CategorySelectBox
              :categories="categories"
              :selected-category-set="selectedCategorySet"
              @add-category="addCategory"
              @select-category="selectCategory"
              @deselect-category="deselectCategory"
              @move-bottom-scroll="moveBottomScroll"
            />
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button id="saveBtn" @click="saveHandler">save</button>
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

.file-find-btn {
  background-color: #f0dc4e;
  margin: 0;
  padding: 0;
  aspect-ratio: 1;
  height: 2em;
  color: white;
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
  z-index: 100;
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
  overflow-y: scroll;
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
  color: #ff5e5e;
  border: 1px solid #ff5e5e;
}
</style>
