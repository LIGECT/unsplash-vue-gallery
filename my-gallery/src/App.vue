<script setup>
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";
import SearchBar from "./components/SearchBar.vue";
import ImageList from "./components/ImageList.vue";
import { useTheme } from "./composables/useTheme";
import { useColumnCount } from "./composables/useColumnCount";
import { useImageSearch } from "./composables/useImageSearch";

const { theme, toggleTheme } = useTheme();
const { columnCount, updateColumnCount } = useColumnCount();
const {
  filteredImages,
  isLoading,
  error,
  currentQuery,
  hasMoreImages,
  onSearch,
  loadMoreImages,
  onFilterChange,
} = useImageSearch();
</script>

<template>
  <div
    class="min-h-screen bg-base-100 text-base-content font-sans leading-relaxed flex flex-col items-center"
  >
    <div class="container mx-auto px-4 py-8 max-w-7xl w-full">
      <div class="flex justify-between items-center mb-4">
        <div class="hidden md:flex items-center gap-2">
          <span class="text-base-content mr-2">Сетка:</span>
          <button
            v-for="count in [2, 3, 4]"
            :key="count"
            @click="updateColumnCount(count)"
            :class="[
              'btn btn-sm',
              columnCount === count
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'btn-outline border-emerald-500 text-base-content hover:bg-emerald-500 hover:text-white',
            ]"
          >
            {{ count }}
          </button>
        </div>
        <button
          @click="toggleTheme"
          class="btn btn-ghost btn-circle hover:text-emerald-500 transition-colors duration-200"
        >
          <SunIcon v-if="theme === 'light'" class="h-6 w-6" />
          <MoonIcon v-else class="h-6 w-6" />
        </button>
      </div>

      <SearchBar @search="onSearch" @filterChange="onFilterChange" />

      <div
        v-if="isLoading && filteredImages.length === 0"
        class="flex flex-col items-center justify-center py-20"
      >
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="mt-4 text-lg text-base-content">Загрузка изображений...</p>
      </div>

      <div
        v-else-if="error"
        class="alert alert-error shadow-lg mt-8 max-w-2xl mx-auto rounded-lg"
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current flex-shrink-0 h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-white">{{ error }}</span>
        </div>
      </div>

      <div
        v-else-if="
          filteredImages.length === 0 && !isLoading && currentQuery && !error
        "
        class="text-center text-base-content text-lg py-12"
      >
        По вашему запросу "<span class="font-medium text-base-content">{{
          currentQuery
        }}</span
        >" изображений не найдено. Попробуйте другой запрос.
      </div>

      <div
        v-else-if="
          filteredImages.length === 0 && !isLoading && !currentQuery && !error
        "
        class="text-center text-base-content text-lg py-12"
      >
        Введите что-нибудь в поиске, чтобы начать вашу галерею изображений.
      </div>

      <ImageList
        v-else
        :images="filteredImages"
        :columnCount="columnCount"
        class="mt-8"
      />

      <div
        v-if="isLoading && filteredImages.length > 0"
        class="flex flex-col items-center justify-center py-8"
      >
        <span class="loading loading-dots loading-lg text-primary"></span>
        <p class="mt-2 text-md text-base-content">
          Загрузка новой порции изображений...
        </p>
      </div>

      <div
        v-if="!hasMoreImages && filteredImages.length > 0 && !isLoading"
        class="text-center text-base-content text-lg py-8"
      >
        Больше изображений нет.
      </div>
    </div>
  </div>
</template>
