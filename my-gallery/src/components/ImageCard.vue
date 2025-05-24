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

function getLikedImages() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function setLikedImages(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function checkLiked() {
  const likedImages = getLikedImages();
  liked.value = likedImages.includes(props.image.id);
}

function toggleLike() {
  const likedImages = getLikedImages();
  if (liked.value) {
    const index = likedImages.indexOf(props.image.id);
    if (index > -1) {
      likedImages.splice(index, 1);
    }
    liked.value = false;
  } else {
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
  <div
    class="relative flex flex-col rounded-2xl shadow-md bg-base-100 transition-all duration-300 hover:shadow-lg hover:scale-105 overflow-hidden group border border-base-300"
  >
    <div class="w-full aspect-w-16 aspect-h-9 sm:aspect-h-12 lg:aspect-h-10">
      <img
        :src="image.urls.small"
        :alt="image.alt_description || 'Изображение без описания'"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="p-4 flex flex-col flex-grow">
      <h3 class="font-semibold text-base-content text-lg line-clamp-1">
        {{ image.user.name || "Неизвестный автор" }}
      </h3>
      <p class="text-sm text-base-content/80 mb-3 line-clamp-2">
        {{ image.description || image.alt_description || "Без описания" }}
      </p>

      <div
        class="mt-auto flex justify-between items-center pt-2 border-t border-base-300"
      >
        <a
          :href="image.links.html"
          target="_blank"
          class="btn btn-sm rounded-full border border-emerald-500 text-emerald-500 bg-base-100 hover:bg-emerald-500 hover:text-white transition-colors duration-300 px-4 py-2"
        >
          Открыть
        </a>

        <button
          @click="toggleLike"
          class="btn btn-circle btn-sm bg-base-100 hover:bg-base-200 border-none shadow-none text-base-content/60 hover:text-emerald-500 transition-colors duration-300"
        >
          <component
            :is="liked ? HeartIconSolid : HeartIconOutline"
            class="w-6 h-6"
            :class="
              liked
                ? 'text-red-500'
                : 'text-base-content/60 group-hover:text-emerald-500'
            "
          />
        </button>
      </div>
    </div>
  </div>
</template>
