<script setup>
// import ImageCard from "./ImageCard";
const props = defineProps({
  images: Array,
});
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
    <ImageCard v-for="image in images" :key="image.id" :image="image" />
  </div>
</template>
