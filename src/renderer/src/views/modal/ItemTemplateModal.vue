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
import RecommendationModal from '@renderer/views/modal/RecommendationModal.vue'
import VideoFrameModal from '@renderer/views/modal/VideoFrameModal.vue'
import { extractFrames } from '@renderer/utils/videoFrameExtractor'

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
const selectedCategorySet = ref<Set<CategoryEntity>>(new Set<CategoryEntity>())

const isRecommendationModalOpen = ref(false)
const recommendationQuery = ref('')
const recommendationSuggestions = ref<string[]>([])

const isVideoModalOpen = ref(false)
const videoFrames = ref<string[]>([])
const isVideoLoading = ref(false)
const videoPath = ref<string>('')

const openRecommendation = async (): Promise<void> => {
  const currentTitle = titleInput.value?.value.trim()
  const rootPath = rootPathInput.value?.value.trim()
  
  const suggestions: string[] = []
  
  if (currentTitle) {
    recommendationQuery.value = currentTitle
    suggestions.push(currentTitle)
  }
  
  if (rootPath) {
    try {
      // Get current folder name
      const folderName = await (window.api.getFileNameByPath(rootPath) as Promise<string>)
      if (folderName) suggestions.push(folderName)
      
      // Get parent folder name
      const parentPath = await (window.api.getFolderByPath(rootPath) as Promise<string>)
      if (parentPath) {
        const parentName = await (window.api.getFileNameByPath(parentPath) as Promise<string>)
        if (parentName) suggestions.push(parentName)
      }
    } catch (err) {
      console.error('Failed to extract path suggestions', err)
    }
  }

  if (suggestions.length > 0) {
    recommendationSuggestions.value = [...new Set(suggestions)]
    isRecommendationModalOpen.value = true
  } else {
    alert('이미지 추천을 위해 제목 또는 경로가 필요합니다.')
  }
}

const onImageSelected = async (url: string): Promise<void> => {
  isRecommendationModalOpen.value = false
  try {
    const savedPath = await (window.api.callService('ImageRecommendationService', 'downloadImage', [
      url
    ]) as Promise<string>)
    mainImgPath.value = savedPath
    const previewUrl = encodeURI(savedPath.replace(/\\/g, '/'))
    mainImg.value = 'file://' + previewUrl
  } catch (err) {
    console.error('Failed to download image', err)
    alert('이미지 다운로드에 실패했습니다.')
  }
}

const onVideoSelectHandler = async (): Promise<void> => {
  if (window.api) {
    const path = await window.api.selectVideo()
    if (!path) return

    videoPath.value = path
    isVideoModalOpen.value = true
    isVideoLoading.value = true
    videoFrames.value = []

    try {
      const frames = await extractFrames(path, 20)
      videoFrames.value = frames
    } catch (err) {
      console.error('Failed to extract frames', err)
      alert('영상 프레임 추출에 실패했습니다.')
      isVideoModalOpen.value = false
    } finally {
      isVideoLoading.value = false
    }
  }
}

const onFrameSelected = async (base64Data: string): Promise<void> => {
  isVideoModalOpen.value = false
  try {
    const savedPath = (await window.api.callService(
      'ImageRecommendationService',
      'saveBase64Image',
      [base64Data]
    )) as string
    mainImgPath.value = savedPath
    mainImg.value = base64Data // Use base64 directly for immediate preview
  } catch (err) {
    console.error('Failed to save frame', err)
    alert('프레임 저장에 실패했습니다.')
  }
}

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

const moveBottomScroll = (): void => {
  if (modalBodyRight.value) modalBodyRight.value.scrollTop = modalBodyRight.value.scrollHeight
}

watch(mainImgPath, () => {
  if (!mainImgPath.value) mainImgLabel.value.innerHTML = MAIN_IMAGE_NULL_LABEL_MSG

  mainImgLabel.value.innerHTML = mainImgPath.value
})

const selectFileHandler = async (): Promise<void> => {
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

const addCategory = (category: string): void => {
  if (category.trim().length <= 0) return
  if (categories.value.filter((it) => it.name.toLowerCase() === category.toLowerCase()).length > 0)
    return
  saveCategory(category)
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

      <div class="setting-left-box" style="display: flex; gap: 5px; flex-direction: column;">
        <button @click="selectFileHandler" ref="mainImgLabel" class="input-file-main-image">
          {{ MAIN_IMAGE_NULL_LABEL_MSG }}
        </button>
        <button class="input-file-main-image" @click="onVideoSelectHandler">
          동영상에서 선택
        </button>
      </div>
    </div>
    <div ref="modalBodyRight" class="modal-body-right">
      <div class="setting-right-box">
        <input ref="titleInput" class="input-box" id="title" placeholder="title" type="text" />
        <button class="recommend-btn" @click="openRecommendation">이미지 추천</button>
      </div>

      <RecommendationModal
        v-if="isRecommendationModalOpen"
        :query="recommendationQuery"
        :suggested-queries="recommendationSuggestions"
        @select="onImageSelected"
        @close="isRecommendationModalOpen = false"
      />

      <VideoFrameModal
        v-if="isVideoModalOpen"
        :video-path="videoPath"
        :frames="videoFrames"
        :loading="isVideoLoading"
        @select="onFrameSelected"
        @close="isVideoModalOpen = false"
      />

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
                :id="String(kind.id!)"
                v-model="selectedKindList"
                type="checkbox"
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
  border: 1px solid var(--input-border-color);
  background-color: var(--input-bg-color);
  color: var(--text-color);
  border-radius: 8px;
  padding: 10px;
  font-size: small;
  cursor: pointer;
}

.file-find-btn {
  background-color: #f0dc4e;
  margin: 0;
  padding: 0;
  aspect-ratio: 1;
  height: 2em;
  color: white;
  border: none;
  border-radius: 4px;
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
  color: var(--text-color);
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
  border: 1px solid var(--input-border-color);
  background-color: var(--input-bg-color);
  color: var(--text-color);
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
  color: var(--text-color);
  border: 1px solid var(--border-color);
  background-color: var(--btn-bg-color);
  border-radius: 10px;
  padding: 5px;
  font-weight: 550;
  transition: 0.25s;
}

.kind-select {
  color: white;
  background-color: #ff5e5e;
  border-color: #ff5e5e;
}

.kind-no-select:hover {
  color: #ff5e5e;
  border: 1px solid #ff5e5e;
}

.description {
  width: 100%;
  height: 200px;
  border-radius: 10px;
  border: 1px solid var(--input-border-color);
  background-color: var(--input-bg-color);
  color: var(--text-color);
  padding: 10px;
  outline: none;
}

.recommend-btn {
  background-color: var(--link-color);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.recommend-btn:hover {
  filter: brightness(1.1);
}
</style>
