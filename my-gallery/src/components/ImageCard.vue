<script setup>
const props = defineProps({
  image: Object,
});
</script>

<template>
  <div class="rounded overflow-hidden shadow-lg bg-white">
    <img
      :src="image.urls.small"
      :alt="image.alt_description"
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
        <button class="text-gray-400 hover:text-red-500">
          <HeartIcon class="w-5 h-5" />
          <!-- Не забудьте импортировать иконку -->
        </button>
      </div>
    </div>
  </div>
</template>
