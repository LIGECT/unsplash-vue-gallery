<script setup>
import { ref, defineEmits } from "vue";

const query = ref("");
const filter = ref("all"); // Изначально выбран фильтр "all"
const emit = defineEmits(["search", "filterChange"]);

/**
 * Обрабатывает событие поиска.
 * Если строка запроса не пустая, испускает событие 'search'.
 */
function onSearch() {
  if (query.value.trim()) {
    emit("search", query.value.trim());
  }
}

/**
 * Обрабатывает изменение фильтра.
 * Испускает событие 'filterChange' с текущим значением фильтра.
 */
function onFilterChange() {
  emit("filterChange", filter.value);
}
</script>

<template>
  <div class="flex flex-col gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm">
    <div class="flex gap-2">
      <input
        v-model="query"
        @keyup.enter="onSearch"
        class="input input-bordered flex-grow text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
        placeholder="Например: cats, mountains..."
      />
      <button
        @click="onSearch"
        class="btn btn-primary bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-200"
      >
        Поиск
      </button>
    </div>
    <div class="flex gap-4 items-center text-gray-800">
      <label class="cursor-pointer flex items-center">
        <input
          type="radio"
          value="all"
          v-model="filter"
          @change="onFilterChange"
          class="radio radio-primary mr-1 checked:bg-emerald-500"
        />
        Все
      </label>
      <label class="cursor-pointer flex items-center">
        <input
          type="radio"
          value="liked"
          v-model="filter"
          @change="onFilterChange"
          class="radio radio-primary mr-1 checked:bg-emerald-500"
        />
        Понравившиеся
      </label>
    </div>
  </div>
</template>
