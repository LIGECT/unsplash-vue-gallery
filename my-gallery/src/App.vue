<script setup>
import { ref } from "vue";
import SearchBar from "./components/SearchBar.vue";
import ImageList from "./components/ImageList.vue";
import { searchPhotos } from "./api/unsplash.js";

const images = ref([]);
const isLoading = ref(false);
const error = ref(null);

async function onSearch(query) {
  if (!query) return;
  isLoading.value = true;
  error.value = null;
  images.value = [];
  try {
    const results = await searchPhotos(query);
    images.value = results;
  } catch (e) {
    error.value = "Ошибка загрузки изображений";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="container mx-auto p-4 bg-gray-100">
    <SearchBar @search="onSearch" />
    <div v-if="isLoading" class="text-center">Загрузка...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <ImageList v-else :images="images" />
  </div>
</template>
