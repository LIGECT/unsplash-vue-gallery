<script setup>
import { ref, onMounted } from "vue";
import { HeartIcon as HeartIconOutline } from "@heroicons/vue/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/vue/24/solid";

const props = defineProps({
  image: {
    type: Object,
    required: true,
  },
});

const liked = ref(false);
const STORAGE_KEY = "likedImages";

// Получаем список лайкнутых из localStorage
function getLikedImages() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Сохраняем список лайкнутых в localStorage
function setLikedImages(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

// Проверяем, лайкнуто ли текущее изображение
function checkLiked() {
  const likedImages = getLikedImages();
  liked.value = likedImages.includes(props.image.id);
}

// Обработка клика по лайку
function toggleLike() {
  const likedImages = getLikedImages();
  if (liked.value) {
    // Удаляем из массива
    likedImages.splice(likedImages.indexOf(props.image.id), 1);
    liked.value = false;
  } else {
    // Добавляем в массив
    likedImages.push(props.image.id);
    liked.value = true;
  }
  setLikedImages(likedImages);
}

onMounted(() => {
  checkLiked();
});
</script>

<template>
  <div class="rounded overflow-hidden shadow-lg bg-white">
    <img
      :src="image.urls.small"
      :alt="image.alt_description || 'Без описания'"
      class="w-full h-48 object-cover"
    />
    <div class="p-4">
      <p class="font-semibold">{{ image.user.name }}</p>
      <p class="text-sm text-gray-600 mb-2">
        {{ image.description || image.alt_description || "Без описания" }}
      </p>
      <div class="flex justify-between items-center">
        <a
          :href="image.links.html"
          target="_blank"
          class="btn btn-xs btn-outline"
          >Открыть</a
        >
        <button @click="toggleLike" class="focus:outline-none">
          <component
            :is="liked ? HeartIconSolid : HeartIconOutline"
            class="w-5 h-5"
            :class="liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'"
          />
        </button>
      </div>
    </div>
  </div>
</template>
