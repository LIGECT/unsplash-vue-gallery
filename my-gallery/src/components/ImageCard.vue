<script setup>
import { ref, watch, onMounted } from "vue";
import { HeartIcon as HeartIconOutline } from "@heroicons/vue/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/vue/24/solid";

// Импортируем composable
import { useImageSearch } from "../composables/useImageSearch.js";

const props = defineProps({
  image: {
    type: Object,
    required: true,
  },
});

const { saveLikedImage, removeLikedImage, isImageLiked } = useImageSearch();

const liked = ref(false);

// Проверяем лайк при монтировании
onMounted(() => {
  liked.value = isImageLiked(props.image.id);
});

// При изменении изображения (если компонент переиспользуется) обновляем liked
watch(
  () => props.image.id,
  (newId) => {
    liked.value = isImageLiked(newId);
  }
);

// Переключаем лайк
function toggleLike() {
  if (liked.value) {
    removeLikedImage(props.image.id);
    liked.value = false;
  } else {
    saveLikedImage(props.image);
    liked.value = true;
  }
}
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
