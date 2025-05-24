import { ref, computed, onMounted, onUnmounted } from "vue";
import { searchPhotos } from "../api/unsplash.js";

export function useImageSearch() {
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

  return {
    images,
    isLoading,
    error,
    filter,
    currentQuery,
    hasMoreImages,
    filteredImages,
    onSearch,
    loadMoreImages,
    onFilterChange,
  };
}