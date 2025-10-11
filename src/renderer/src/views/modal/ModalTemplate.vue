<script setup lang="ts">
const cancelBtnOverEnterHandler = (e: Event): void => {
  const target = e.target as HTMLInputElement
  target.innerHTML = 'X'
}

const cancelBtnOverLeaveHandler = (e: Event): void => {
  const target = e.target as HTMLInputElement
  target.innerHTML = ''
}
defineEmits<{
  (e: 'closeItemAddModal'): void
}>()
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
      <slot/>
    </div>
  </div>
</template>

<style scoped>
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
</style>
