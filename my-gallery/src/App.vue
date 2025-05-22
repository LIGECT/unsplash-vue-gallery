<script setup>
import { ref, computed } from "vue";
import SearchBar from "./components/SearchBar.vue";
import ImageList from "./components/ImageList.vue";
import { searchPhotos } from "./api/unsplash.js";

const images = ref([]); // Хранит все загруженные изображения
const isLoading = ref(false); // Флаг состояния загрузки
const error = ref(null); // Сообщение об ошибке
const filter = ref("all"); // Текущий выбранный фильтр: "all" или "liked"

/**
 * Асинхронная функция для поиска фотографий по запросу.
 * Устанавливает состояния загрузки и ошибок, а затем обновляет список изображений.
 * @param {string} query - Поисковый запрос.
 */
async function onSearch(query) {
  if (!query) return; // Если запрос пустой, ничего не делаем
  isLoading.value = true;
  error.value = null;
  images.value = []; // Очищаем предыдущие изображения
  try {
    const results = await searchPhotos(query);
    images.value = results; // Сохраняем полученные изображения
  } catch (e) {
    console.error("Ошибка при поиске фотографий:", e);
    error.value = "Ошибка загрузки изображений. Пожалуйста, попробуйте снова.";
  } finally {
    isLoading.value = false;
  }
}

/**
 * Обрабатывает изменение фильтра из компонента SearchBar.
 * Обновляет реактивную переменную filter.
 * @param {string} value - Новое значение фильтра ("all" или "liked").
 */
function onFilterChange(value) {
  filter.value = value;
}

/**
 * Вспомогательная функция для получения списка ID лайкнутых изображений из localStorage.
 * Дублирует логику, используемую в ImageCard, для согласованности.
 * @returns {Array<string>} Массив ID лайкнутых изображений.
 */
function getLikedImages() {
  const data = localStorage.getItem("likedImages");
  return data ? JSON.parse(data) : [];
}

/**
 * Вычисляемое свойство, которое возвращает отфильтрованный список изображений.
 * Если фильтр установлен на "liked", возвращает только понравившиеся изображения.
 * В противном случае возвращает все загруженные изображения.
 * @returns {Array<Object>} Отфильтрованный список изображений.
 */
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

    <div v-if="isLoading" class="text-center text-gray-800 text-lg py-4">
      Загрузка изображений...
    </div>
    <div v-else-if="error" class="text-center text-red-500 text-lg py-4">
      {{ error }}
    </div>
    <div
      v-else-if="filteredImages.length === 0"
      class="text-center text-gray-500 text-lg py-4"
    >
      Изображений не найдено. Попробуйте другой запрос или фильтр.
    </div>
    <ImageList v-else :images="filteredImages" />
  </div>
</template>
