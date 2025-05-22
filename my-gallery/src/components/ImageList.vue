<script setup>
import ImageCard from "./ImageCard.vue";

const props = defineProps({
  images: Array,
});
</script>

<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 md:p-6"
  >
    <ImageCard
      v-for="(image, index) in images"
      :key="image.id"
      :image="image"
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: index * 50 } }"
    />
  </div>
</template>
