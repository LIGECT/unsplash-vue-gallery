<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import SearchBar from "./components/SearchBar.vue";
import ImageList from "./components/ImageList.vue";
import { searchPhotos } from "./api/unsplash.js";

const images = ref([]);
const isLoading = ref(false);
const error = ref(null);
const filter = ref("all");
const currentPage = ref(1);
const currentQuery = ref("");
const hasMoreImages = ref(true);

async function fetchImages(query, page) {
  if (page === 1) {
    isLoading.value = true;
    images.value = [];
  }
  error.value = null;
  try {
    const results = await searchPhotos(query, page);
    if (page === 1) {
      images.value = results;
    } else {
      images.value = [...images.value, ...results];
    }
    hasMoreImages.value = results.length > 0;
  } catch (e) {
    console.error("Ошибка при поиске фотографий:", e);
    error.value =
      "Не удалось загрузить изображения. Возможно, проблемы с сетью или API. Пожалуйста, попробуйте снова.";
    hasMoreImages.value = false;
  } finally {
    if (page === 1) {
      isLoading.value = false;
    }
  }
}

async function onSearch(query) {
  if (!query) {
    images.value = [];
    hasMoreImages.value = false;
    error.value = null;
    return;
  }
  currentQuery.value = query;
  currentPage.value = 1;
  hasMoreImages.value = true;
  await fetchImages(query, currentPage.value);
}

async function loadMoreImages() {
  if (isLoading.value || !hasMoreImages.value) {
    return;
  }
  isLoading.value = true;
  currentPage.value++;
  await fetchImages(currentQuery.value, currentPage.value);
  isLoading.value = false;
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 300 &&
    currentQuery.value &&
    !isLoading.value &&
    hasMoreImages.value
  ) {
    loadMoreImages();
  }
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

function onFilterChange(value) {
  filter.value = value;
}

function getLikedImages() {
  const data = localStorage.getItem("likedImages");
  return data ? JSON.parse(data) : [];
}

const filteredImages = computed(() => {
  if (filter.value === "liked") {
    const likedIds = getLikedImages();
    return images.value.filter((img) => likedIds.includes(img.id));
  }
  return images.value;
});
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 text-gray-800 font-sans leading-relaxed flex flex-col items-center"
  >
    <div class="container mx-auto px-4 py-8 max-w-7xl w-full">
      <SearchBar @search="onSearch" @filterChange="onFilterChange" />

      <div
        v-if="isLoading && currentPage === 1"
        class="flex flex-col items-center justify-center py-20"
      >
        <span
          class="loading loading-spinner loading-lg text-emerald-500"
        ></span>
        <p class="mt-4 text-lg text-gray-800">Загрузка изображений...</p>
      </div>

      <div
        v-else-if="error"
        class="alert alert-error shadow-lg mt-8 max-w-2xl mx-auto rounded-lg"
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current flex-shrink-0 h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-white">{{ error }}</span>
        </div>
      </div>

      <div
        v-else-if="
          filteredImages.length === 0 && !isLoading && currentQuery && !error
        "
        class="text-center text-gray-500 text-lg py-12"
      >
        По вашему запросу "<span class="font-medium text-gray-800">{{
          currentQuery
        }}</span
        >" изображений не найдено. Попробуйте другой запрос.
      </div>

      <div
        v-else-if="
          filteredImages.length === 0 && !isLoading && !currentQuery && !error
        "
        class="text-center text-gray-500 text-lg py-12"
      >
        Введите что-нибудь в поиске, чтобы начать вашу галерею изображений.
      </div>

      <ImageList v-else :images="filteredImages" class="mt-8" />

      <div
        v-if="isLoading && currentPage > 1"
        class="flex flex-col items-center justify-center py-8"
      >
        <span class="loading loading-dots loading-lg text-emerald-500"></span>
        <p class="mt-2 text-md text-gray-800">
          Загрузка новой порции изображений...
        </p>
      </div>

      <div
        v-if="!hasMoreImages && filteredImages.length > 0 && !isLoading"
        class="text-center text-gray-500 text-lg py-8"
      >
        Больше изображений нет.
      </div>
    </div>
  </div>
</template>
