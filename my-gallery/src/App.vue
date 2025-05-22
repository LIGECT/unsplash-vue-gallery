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
  // Устанавливаем isLoading в true только если это первая страница или если это новый запрос
  if (page === 1) {
    isLoading.value = true;
    images.value = []; // Очищаем изображения при новом поиске
  }
  error.value = null; // Сбрасываем ошибку перед новым запросом
  try {
    const results = await searchPhotos(query, page);
    if (page === 1) {
      images.value = results;
    } else {
      images.value = [...images.value, ...results];
    }
    // Проверяем, есть ли еще изображения для загрузки
    hasMoreImages.value = results.length > 0;
  } catch (e) {
    console.error("Ошибка при поиске фотографий:", e);
    error.value =
      "Не удалось загрузить изображения. Возможно, проблемы с сетью или API. Пожалуйста, попробуйте снова.";
    hasMoreImages.value = false; // При ошибке считаем, что больше изображений нет
  } finally {
    // Сбрасываем isLoading после завершения запроса (успешного или с ошибкой)
    if (page === 1) {
      isLoading.value = false;
    }
  }
}

async function onSearch(query) {
  if (!query) {
    images.value = []; // Очищаем список, если запрос пустой
    hasMoreImages.value = false; // Нет смысла загружать еще, если нет запроса
    return;
  }
  currentQuery.value = query;
  currentPage.value = 1;
  hasMoreImages.value = true;
  await fetchImages(query, currentPage.value);
}

async function loadMoreImages() {
  // Проверяем, идет ли уже загрузка или нет больше изображений для загрузки
  if (isLoading.value || !hasMoreImages.value) {
    return;
  }
  // Устанавливаем isLoading в true только для дозагрузки (чтобы не перекрывать текущие изображения)
  isLoading.value = true;
  currentPage.value++;
  await fetchImages(currentQuery.value, currentPage.value);
  isLoading.value = false; // Сбрасываем isLoading после дозагрузки
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  // Проверяем, находится ли пользователь почти внизу страницы
  // и есть ли текущий запрос, не идет ли уже загрузка и есть ли еще изображения
  if (
    scrollTop + clientHeight >= scrollHeight - 100 &&
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
    class="container mx-auto px-4 py-8 font-sans text-base leading-relaxed bg-gray-50 min-h-screen"
  >
    <SearchBar @search="onSearch" @filterChange="onFilterChange" />

    <div
      v-if="isLoading && currentPage === 1"
      class="flex justify-center items-center py-10"
    >
      <span class="loading loading-spinner loading-lg text-emerald-500"></span>
      <p class="ml-4 text-gray-800 text-lg">Загрузка изображений...</p>
    </div>

    <div
      v-else-if="error"
      class="alert alert-error shadow-lg mt-4 mx-auto max-w-xl"
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current flex-shrink-0 h-6 w-6"
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
        <span>{{ error }}</span>
      </div>
    </div>

    <div
      v-else-if="filteredImages.length === 0 && !isLoading && currentQuery"
      class="text-center text-gray-500 text-lg py-4"
    >
      По вашему запросу "{{ currentQuery }}" изображений не найдено. Попробуйте
      другой запрос.
    </div>
    <div
      v-else-if="filteredImages.length === 0 && !isLoading && !currentQuery"
      class="text-center text-gray-500 text-lg py-4"
    >
      Введите что-нибудь в поиске, чтобы начать.
    </div>

    <ImageList v-else :images="filteredImages" />

    <div
      v-if="isLoading && currentPage > 1"
      class="flex justify-center items-center py-4"
    >
      <span class="loading loading-dots loading-lg text-emerald-500"></span>
      <p class="ml-2 text-gray-800 text-md">
        Загрузка новой порции изображений...
      </p>
    </div>

    <div
      v-if="!hasMoreImages && filteredImages.length > 0 && !isLoading"
      class="text-center text-gray-500 text-lg py-4"
    >
      Больше изображений нет.
    </div>
  </div>
</template>
