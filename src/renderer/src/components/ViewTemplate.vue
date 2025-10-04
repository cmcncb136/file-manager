<script setup lang="ts"></script>

<template>
  <div class="main-box">
    <div class="top-box">
      <img style="padding: 0; width: 100%" src="/src/assets/vue.svg" alt="" />
    </div>

    <div class="middle-box">
      <div class="categories-box">
        <div v-for="i in 9" :key="i" class="category">category {{ i }}</div>
      </div>
      <div class="info-box">
        <div>TITLE</div>
      </div>
    </div>
    <div class="bottom-box">
      <div class="kind-box">
        <div v-for="i in 8" :key="i" class="kind">KIND{{ i }}</div>
      </div>
      <div class="control-box">
        <button style="background-color: #edc93d; flex-grow: 1" class="control-button">
          <icon-material-symbols-folder-outline />
        </button>
        <button style="background-color: #ff5e5e" class="control-button">
          <icon-material-symbols-edit-outline />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-box {
  width: 250px;
  padding: 5px;
  border: 1px solid gainsboro;
  border-radius: 10px;
}

.top-box {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
}

.bottom-box {
}

.kind-box {
  display: flex;
  width: 100%;
  overflow-x: scroll;
  gap: 5px;
}

.kind {
  background-color: #ff5e5e;
  border-radius: 10px;
  padding: 5px;
}

.categories-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
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

button:hover {
  filter: brightness(0.8);
}

button {
  color: white;
  font-weight: 600;
}
</style>
