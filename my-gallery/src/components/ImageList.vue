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

const dynamicGridClass = computed(() => {
  // Этот класс будет применяться для экранов LG (1024px) и выше.
  // На меньших экранах будут действовать базовые адаптивные классы.
  switch (props.columnCount) {
    case 2:
      return "lg:grid-cols-2";
    case 4:
      return "lg:grid-cols-4";
    case 3:
    default:
      return "lg:grid-cols-3";
  }
});
</script>

<template>
  <div
    :class="[
      dynamicGridClass,
      'grid',
      'grid-cols-1', // Базово 1 колонка на очень маленьких экранах
      'sm:grid-cols-2', // От sm (640px) - 2 колонки
      'md:grid-cols-3', // От md (768px) - 3 колонки (это будет переопределено на lg)
      'gap-6',
      'p-4',
      'md:p-6',
    ]"
  >
    <ImageCard v-for="image in images" :key="image.id" :image="image" />
  </div>
</template>
