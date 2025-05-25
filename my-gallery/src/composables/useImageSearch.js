import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { searchPhotos } from "../api/unsplash.js";

export function useImageSearch() {
  const images = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const filter = ref("all");
  const currentQuery = ref("");
  const currentPage = ref(1);
  const hasMoreApiImages = ref(true);

  function getLikedImageIdsFromLocalStorage() {
    const data = localStorage.getItem("likedImageIds");
    return data ? JSON.parse(data) : [];
  }

  function getAllLikedImagesFromLocalStorage() {
    const data = localStorage.getItem("likedImagesFull");
    return data ? JSON.parse(data) : [];
  }

  function saveLikedImage(image) {
    const likedIds = getLikedImageIdsFromLocalStorage();
    const likedFull = getAllLikedImagesFromLocalStorage();

    if (!likedIds.includes(image.id)) {
      likedIds.push(image.id);
      likedFull.push(image);
      localStorage.setItem("likedImageIds", JSON.stringify(likedIds));
      localStorage.setItem("likedImagesFull", JSON.stringify(likedFull));
    }
  }

  function removeLikedImage(imageId) {
    let likedIds = getLikedImageIdsFromLocalStorage();
    let likedFull = getAllLikedImagesFromLocalStorage();

    likedIds = likedIds.filter((id) => id !== imageId);
    likedFull = likedFull.filter((img) => img.id !== imageId);

    localStorage.setItem("likedImageIds", JSON.stringify(likedIds));
    localStorage.setItem("likedImagesFull", JSON.stringify(likedFull));
  }

  function isImageLiked(imageId) {
    const likedIds = getLikedImageIdsFromLocalStorage();
    return likedIds.includes(imageId);
  }

  async function fetchImages(query, page) {
    if (filter.value === "liked") {
      isLoading.value = false;
      return;
    }

    if (page === 1) {
      isLoading.value = true;
      images.value = [];
      hasMoreApiImages.value = true;
    }
    error.value = null;
    try {
      const results = await searchPhotos(query, page);
      if (page === 1) {
        images.value = results;
      } else {
        images.value = [...images.value, ...results];
      }
      hasMoreApiImages.value = results.length > 0;
    } catch (e) {
      console.error("Ошибка при поиске фотографий:", e);
      error.value =
        "Не удалось загрузить изображения. Возможно, проблемы с сетью или API. Пожалуйста, попробуйте снова.";
      hasMoreApiImages.value = false;
    } finally {
      isLoading.value = false;
    }
  }

  async function onSearch(query) {
    filter.value = "all";
    if (!query) {
      images.value = [];
      hasMoreApiImages.value = false;
      error.value = null;
      return;
    }
    currentQuery.value = query;
    currentPage.value = 1;
    await fetchImages(query, currentPage.value);
  }

  async function loadMoreImages() {
    if (
      isLoading.value ||
      filter.value === "liked" ||
      !hasMoreApiImages.value
    ) {
      return;
    }
    isLoading.value = true;
    currentPage.value++;
    await fetchImages(currentQuery.value, currentPage.value);
  }

  function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (
      scrollTop + clientHeight >= scrollHeight - 300 &&
      filter.value === "all" &&
      currentQuery.value &&
      !isLoading.value &&
      hasMoreApiImages.value
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

  const filteredImages = computed(() => {
    if (filter.value === "liked") {
      return getAllLikedImagesFromLocalStorage();
    }
    return images.value;
  });

  return {
    images,
    isLoading,
    error,
    filter,
    currentQuery,
    filteredImages,
    onSearch,
    loadMoreImages,
    onFilterChange,
    hasMoreApiImages,
    saveLikedImage,
    removeLikedImage,
    isImageLiked,
  };
}
