<script setup>
import { ref } from "vue";
import SearchBar from "./components/SearchBar.vue";
import ImageList from "./components/ImageList.vue";
import ImageCard from "./components/ImageCard.vue";
import { searchPhotos } from "./api/unsplash.js";

const images = ref([]);

const isLoading = ref(false);
const error = ref(null);

async function onSearch(querry) {
  isLoading.value = true;
  error.value = null;
  try {
    const results = await searchPhotos(querry);
    images.value = results;
  } catch (e) {
    error.value = "Ошибка загрузки изображений";
  } finally {
    isLoading.value = false;
  }
}
</script>

<!-- <template>
  <div class="container mx-auto p-4">
    <SearchBar @search="onSearch" />
    <div v-if="isLoading" class="text-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div v-else-if="error" class="alert alert-error">{{ error }}</div>
    <ImageList v-else :images="images" />
  </div>
</template> -->

<template>
  <div class="container mx-auto p-4 bg-gray-100">
    <!-- Добавлен bg-gray-100 -->
    <SearchBar @search="onSearch" />
    <div v-if="isLoading">Загрузка...</div>
    <ImageList v-else :images="images" />
  </div>
</template>
