<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import noImage from '/src/assets/no_img.png'
import { useCategoryStore } from '@renderer/stores/useCategoryStore'
import { useKindStore } from '@renderer/stores/useKindStore'
import { storeToRefs } from 'pinia'
import { CategoryEntity } from '../../../../entity/categoryEntity'
import CategorySelectBox from '@renderer/components/CategorySelectBox.vue'
import { ItemDto } from '@renderer/dto/itemDto'
import { SaveItemDto } from '@renderer/dto/saveItemDto'

const emit = defineEmits<{
  (e: 'submit', value: SaveItemDto): void
}>()

const props = defineProps<{
  item?: ItemDto
}>()

const categoryStore = useCategoryStore()
const kindStore = useKindStore()

const { saveCategory } = categoryStore
const { categories, categoryMap } = storeToRefs(categoryStore)

kindStore.fetchKinds()
const { kinds } = storeToRefs(kindStore)

const mainImg = ref<string>(noImage)
const mainImgPath = ref<string | null>(null)
const description = ref<string>('')

const rootPathInput = ref<HTMLInputElement>()
const exePathInput = ref<HTMLInputElement>()
const titleInput = ref<HTMLInputElement>()

const mainImgLabel = ref()
const MAIN_IMAGE_NULL_LABEL_MSG = 'Select Main Image'
const selectedKindList = ref<number[]>(props.item?.kinds.map((it) => it.id!) ?? [])

const modalBodyRight = ref<HTMLElement>()
const categoryInputValue = ref<string>('')
const selectedCategorySet = ref<Set<CategoryEntity>>(new Set<CategoryEntity>())

onMounted(async () => {
  const item = props.item
  if (!item) return

  if (item.mainImg) {
    mainImgPath.value = item.mainImg.realPath
    const url = encodeURI(mainImgPath.value.replace(/\\/g, '/'))
    mainImg.value = 'file://' + url
  }

  item.categories.forEach((category) => {
    if (categoryMap.value.has(category.id!)) {
      selectedCategorySet.value.add(categoryMap.value.get(category.id!)!)
    }
  })

  if (item.title && titleInput.value) titleInput.value.value = item.title
  if (item.exeFile && exePathInput.value) exePathInput.value.value = item.exeFile.realPath
  if (item.rootFile && rootPathInput.value) rootPathInput.value.value = item.rootFile.realPath
  if (item.description != null) description.value = item.description
})

const moveBottomScroll = async () => {
  if (modalBodyRight.value) modalBodyRight.value.scrollTop = modalBodyRight.value.scrollHeight
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

const findFile = async (): Promise<string | null> => {
  if (window.api) {
    const path = await window.api.selectFile()

    return path
  }

  return null
}

const findFolderHandler = async (target: HTMLInputElement | undefined): Promise<void> => {
  if (window.api) {
    const path = await window.api.selectFolder()
    if (!path || !target) return

    target.value = path
  }
}

const exeFileClickHandler = async (target: HTMLInputElement | undefined): Promise<void> => {
  const path = await findFile()

  if (!path || !target) return
  target.value = path

  const targetFolder = await window.api.getFolderByPath(target.value)

  if (rootPathInput.value && rootPathInput.value.value.trim().length <= 0) {
    rootPathInput.value.value = targetFolder
  }

  if (titleInput.value && titleInput.value.value.trim().length <= 0) {
    titleInput.value.value = await window.api.getFileNameByPath(target.value)
  }
}

const selectCategory = (category: CategoryEntity): void => {
  if (selectedCategorySet.value.has(category)) return
  selectedCategorySet.value.add(category)
}

const deselectCategory = (category: CategoryEntity): void => {
  selectedCategorySet.value.delete(category)
}

const submitHandler = (): void => {
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

  submit(titleInput.value!.value!, description.value, mainImgPath.value, exePath, rootPath)
  //Todo. 연속 저장 방지 칠요할 수도 있음
}

const submit = async (
  title: string,
  description: string,
  mainImgPath: string | null,
  exePath: string | null,
  rootPath: string | null
): Promise<void> => {
  const saveDto = {
    title: title,
    description: description,
    mainImgPath: mainImgPath,
    exeFileRefPath: exePath,
    rootFileRefPath: rootPath,
    categoryIds: [...selectedCategorySet.value].map((it) => it.id!),
    kindIds: selectedKindList.value.values().toArray()
  } as SaveItemDto

  emit('submit', saveDto)
  // return await saveItem({
  //   title: title,
  //   description: 'test',
  //   mainImgPath: mainImgPath,
  //   exeFileRefPath: exePath,
  //   rootFileRefPath: rootPath,
  //   categoryIds: [...selectedCategorySet.value].map((it) => it.id!),
  //   kindIds: selectedKindList.value.values().toArray()
  // })
}
</script>

<template>
  <div class="modal-body">
    <div class="modal-body-left">
      <div style="border-radius: 10px; overflow: hidden; border: 1px gainsboro solid">
        <img
          :src="mainImg"
          style="max-height: 30vh; width: 15vw"
          @click="selectFileHandler"
          alt="main image"
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

      <div class="setting-right-box" @click="exeFileClickHandler(exePathInput)">
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

      <div class="setting-right-box">
        <div class="kind-box">
          <div>kinds</div>
          <div class="kind-line-box">
            <div v-for="kind in kinds" :key="kind.id!">
              <input
                v-model="selectedKindList"
                type="checkbox"
                :id="String(kind.id!)"
                :value="kind.id!"
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

      <div class="setting-right-box">
        <div style="width: 100%">
          <div>Description</div>
          <div>
            <textarea v-model="description" class="description" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal-footer">
    <button id="saveBtn" @click="submitHandler">save</button>
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

.description {
  width: 100%;
  height: 200px;
}
</style>
