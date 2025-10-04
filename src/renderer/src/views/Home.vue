<script setup lang="ts">
import ViewTemplate from '../components/ViewTemplate.vue'
</script>

<template>
  <div class="main-container">
    <div class="content-container">
      <div v-for="i in 10" :key="i">
        <ViewTemplate />
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  flex: 1;
}

.main-container {
  display: flex;
  height: 75%;
  background-color: white;
  flex-direction: column;
}
</style>
