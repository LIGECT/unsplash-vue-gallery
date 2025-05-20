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

<template>Hello</template>
