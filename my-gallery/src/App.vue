<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"; // Добавили onMounted и onUnmounted
import SearchBar from "./components/SearchBar.vue";
import ImageList from "./components/ImageList.vue";
import { searchPhotos } from "./api/unsplash.js";

const images = ref([]);
const isLoading = ref(false);
const error = ref(null);
const filter = ref("all");
const currentPage = ref(1); // Добавили переменную для текущей страницы
const currentQuery = ref(""); // Добавили переменную для сохранения текущего запроса
const hasMoreImages = ref(true); // Добавили флаг, есть ли еще изображения для загрузки

// Функция для выполнения поиска изображений
async function fetchImages(query, page) {
  isLoading.value = true;
  error.value = null;
  try {
    const results = await searchPhotos(query, page); // Передаем номер страницы
    if (page === 1) {
      // Если это первая страница, заменяем изображения
      images.value = results;
    } else {
      // Иначе добавляем новые изображения к существующим
      images.value = [...images.value, ...results];
    }
    // Проверяем, есть ли еще изображения для загрузки (если результатов меньше, чем per_page, то, возможно, это последняя страница)
    hasMoreImages.value = results.length > 0;
  } catch (e) {
    console.error("Ошибка при поиске фотографий:", e);
    error.value = "Ошибка загрузки изображений. Пожалуйста, попробуйте снова.";
  } finally {
    isLoading.value = false;
  }
}

// Обработчик нового поиска
async function onSearch(query) {
  if (!query) return;
  currentQuery.value = query; // Сохраняем текущий запрос
  currentPage.value = 1; // Сбрасываем страницу на первую при новом поиске
  hasMoreImages.value = true; // Сбрасываем флаг наличия изображений
  await fetchImages(query, currentPage.value); // Выполняем поиск для первой страницы
}

// Функция для подгрузки новых изображений
async function loadMoreImages() {
  if (isLoading.value || !hasMoreImages.value) {
    return; // Если уже идет загрузка или нет больше изображений, выходим
  }
  currentPage.value++; // Увеличиваем номер страницы
  await fetchImages(currentQuery.value, currentPage.value); // Загружаем следующую страницу
}

// Обработчик события прокрутки
function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  // Проверяем, находится ли пользователь почти внизу страницы
  if (
    scrollTop + clientHeight >= scrollHeight - 100 &&
    currentQuery.value &&
    !isLoading.value &&
    hasMoreImages.value
  ) {
    loadMoreImages(); // Если да, загружаем больше изображений
  }
}

// Добавляем и удаляем обработчик события прокрутки при монтировании/размонтировании компонента
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
      class="text-center text-gray-800 text-lg py-4"
    >
      Загрузка изображений...
    </div>
    <div v-else-if="error" class="text-center text-red-500 text-lg py-4">
      {{ error }}
    </div>
    <div
      v-else-if="filteredImages.length === 0 && !isLoading"
      class="text-center text-gray-500 text-lg py-4"
    >
      Изображений не найдено. Попробуйте другой запрос или фильтр.
    </div>
    <ImageList v-else :images="filteredImages" />

    <div
      v-if="isLoading && currentPage > 1"
      class="text-center text-gray-800 text-lg py-4"
    >
      Загрузка новой порции изображений...
    </div>
    <div
      v-if="!hasMoreImages && filteredImages.length > 0"
      class="text-center text-gray-500 text-lg py-4"
    >
      Больше изображений нет.
    </div>
  </div>
</template>
