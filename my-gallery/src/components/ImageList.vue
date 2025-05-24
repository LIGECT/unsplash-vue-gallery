<script setup>
import { computed } from "vue";
import ImageCard from "./ImageCard.vue";

const props = defineProps({
  images: Array,
  columnCount: {
    type: Number,
    default: 3, 
  },
});

const gridClasses = computed(() => {
  let classes = 'grid gap-6 p-4 md:p-6';

  classes += ' grid-cols-1 sm:grid-cols-2';

  if (props.columnCount === 2) {
    classes += ' md:grid-cols-2';
  } else if (props.columnCount === 3) {
    classes += ' md:grid-cols-3';
  } else if (props.columnCount === 4) {
    classes += ' md:grid-cols-4';
  }

  classes += ' md:masonry-grid';

  return classes;
});
</script>

<template>
  <div :class="gridClasses">
    <ImageCard v-for="image in images" :key="image.id" :image="image" />
  </div>
</template>
