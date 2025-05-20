<script setup>
const props = defineProps({
  image: Object,
});
</script>

<template>
  <div class="rounded overflow-hidden shadow-lg">
    <img :src="image.urls.small" :alt="image.alt_description" class="w-full" />
    <div class="p-2">
      <p class="text-sm text-gray-700">
        {{ image.description || image.alt_description || "Без описания" }}
      </p>
    </div>
  </div>
</template>
