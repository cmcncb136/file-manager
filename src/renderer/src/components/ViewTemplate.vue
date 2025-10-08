<script setup lang="ts">
import { ItemDto } from '@renderer/dto/itemDto'
import { onMounted, ref } from 'vue'
import noImage from '/src/assets/no_img_square.png'

const showImg = ref<string>(noImage)

const props = defineProps<{
  item: ItemDto
}>()

const openFile = (refFileEntityId: number | null | undefined): void => {
  if (!refFileEntityId) return

  if (window.api) {
    const rst = window.api.callService('FileRefService', 'openFileById', [refFileEntityId])
    console.log(rst)
  }
}

const openFileHandler = (): void => {
  if (props.item.exeFile) {
    openFile(props.item.exeFile.id)
    return
  }

  if (props.item.rootFile) {
    openFile(props.item.rootFile.id)
  }
}

onMounted(() => {
  const mainImg = props.item.mainImg
  if (mainImg == null) return

  const url = encodeURI(mainImg.realPath.replace(/\\/g, '/'))
  showImg.value = 'file://' + url
})
</script>

<template>
  <div class="main-box" @click="openFileHandler">
    <div class="top-box">
      <div class="info-box">
        <div>{{ props.item.title }}</div>
      </div>
      <img style="padding: 0; width: 100%" :src="showImg" alt="" />
    </div>

    <div class="middle-box">
      <div class="categories-box">
        <span v-for="category in props.item.categories" :key="category.id!" class="category">
          {{ category.name }}
        </span>
      </div>
      <div class="kind-box">
        <div v-for="kind in props.item.kinds" :key="kind.id!" class="kind">{{ kind.name }}</div>
      </div>
    </div>
    <hr />
    <div class="bottom-box">
      <div class="control-box">
        <button
          style="background-color: #edc93d; flex-grow: 1"
          class="control-button"
          :disabled="!props.item.rootFile?.id"
          @click.stop="() => openFile(props.item.rootFile?.id)"
        >
          <i class="pi pi-folder" />
        </button>
        <button style="background-color: #008cff" class="control-button">
          <i class="pi pi-pencil" />
        </button>
        <button style="background-color: #ff5e5e" class="control-button">
          <i class="pi pi-trash" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-box {
  width: 250px;
  height: 100%;
  padding: 5px;
  border: 1px solid gainsboro;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.main-box:hover {
  border: 2px solid cornflowerblue;
}

.top-box {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
}

.middle-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-grow: 1;
}

.bottom-box {
}

.kind-box {
  display: flex;
  width: 100%;
  overflow-x: auto;
  gap: 5px;
}

.kind {
  background-color: #ff5e5e;
  border-radius: 10px;
  padding: 3px;
  color: white;
  font-weight: 550;
}

.categories-box {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
}

.category {
  border: 1px solid gainsboro;
  border-radius: 5px;
  padding: 5px;
  background-color: cornflowerblue;
  color: white;
  font-size: small;
  font-weight: 550;
}

.info-box {
}

.control-box {
  display: flex;
  justify-content: center;
  gap: 5px;
  height: 35px;
}

.control-button {
  height: 100%;
  aspect-ratio: 1;
  font-size: medium;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-button:disabled {
  filter: brightness(0.5);
  background-color: #4f482c;
}

button:hover {
  filter: brightness(0.8);
}

button {
  color: white;
  font-weight: 600;
}
</style>
