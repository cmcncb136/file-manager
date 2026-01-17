<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ModalTemplate from './ModalTemplate.vue'

const props = defineProps<{
  videoPath: string
  frames: string[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'select', frame: string): void
  (e: 'close'): void
}>()

const videoRef = ref<HTMLVideoElement>()
const canvasRef = ref<HTMLCanvasElement>()

const captureCurrentFrame = () => {
  if (!videoRef.value || !canvasRef.value) return

  const video = videoRef.value
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  if (ctx) {
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const base64Data = canvas.toDataURL('image/jpeg', 0.9)
    emit('select', base64Data)
  }
}

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.src = `file://${props.videoPath}`
  }
})
</script>

<template>
  <ModalTemplate @close-item-add-modal="emit('close')">
    <div class="video-frame-container">
      <div class="header-row">
        <h3>영상 프레임 선택</h3>
      </div>

      <div class="main-content">
        <!-- Manual Capture Section -->
        <div class="manual-capture-section">
          <div class="video-wrapper">
            <video ref="videoRef" controls class="preview-video"></video>
          </div>
          <div class="controls-row">
            <button class="capture-btn" @click="captureCurrentFrame">
              <i class="pi pi-camera"></i> 현재 화면 캡처하기
            </button>
          </div>
        </div>

        <!-- Hidden canvas for capturing -->
        <canvas ref="canvasRef" style="display: none"></canvas>

        <!-- Recommended Frames Section -->
        <div class="recommended-section">
          <h4 class="section-title">추천 프레임</h4>
          <div v-if="loading" class="loading-box">
            <i class="pi pi-spin pi-spinner" style="font-size: 1.5rem"></i>
            <p>추천 프레임을 추출 중입니다...</p>
          </div>
          <div v-else class="frame-grid">
            <div
              v-for="(frame, index) in frames"
              :key="index"
              class="frame-item"
              @click="emit('select', frame)"
            >
              <img :src="frame" alt="video frame" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalTemplate>
</template>

<style scoped>
.video-frame-container {
  padding: 20px;
  width: 100%;
  height: 100%;
  max-width: 85vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.header-row {
  margin-bottom: 15px;
}

h3 {
  margin: 0;
  color: var(--text-color);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.manual-capture-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 300px;
  max-width: 35vw;
}

.video-wrapper {
  flex: 1;
  background: black;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-video {
  max-width: 100%;
  max-height: 100%;
}

.controls-row {
  display: flex;
  justify-content: center;
}

.capture-btn {
  background-color: var(--link-color);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: filter 0.2s;
}

.capture-btn:hover {
  filter: brightness(1.2);
}

.recommended-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 500px;
  border-top: 1px solid var(--border-color);
  padding-top: 15px;
}

.section-title {
  margin: 0;
  font-size: 1rem;
  color: var(--text-color-secondary);
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: var(--text-color);
}

.frame-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
  overflow-y: auto;
  padding: 5px;
}

.frame-item {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 6px;
  overflow: hidden;
  transition:
    transform 0.2s,
    border-color 0.2s;
  aspect-ratio: 16/9;
  background: #333;
}

.frame-item:hover {
  transform: scale(1.05);
  border-color: var(--link-color);
}

.frame-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
