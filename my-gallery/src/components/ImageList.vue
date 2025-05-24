<script setup>
import { computed } from "vue"; // Импортируем 'computed'
import ImageCard from "./ImageCard.vue";

const props = defineProps({
  images: Array,
  columnCount: {
    // Определяем новый пропс
    type: Number,
    default: 3, // Значение по умолчанию, если пропс не передан
  },
});

// Вычисляемое свойство для генерации классов сетки Tailwind
const gridColsClass = computed(() => {
  switch (props.columnCount) {
    case 2:
      return "grid-cols-2";
    case 4:
      return "grid-cols-4";
    case 3: // По умолчанию, если 3 или другое значение
    default:
      return "grid-cols-3";
  }
});
</script>

<template>
  <div :class="[gridColsClass, 'grid', 'gap-6', 'p-4', 'md:p-6']">
    <ImageCard v-for="image in images" :key="image.id" :image="image" />
  </div>
</template>
