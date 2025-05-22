<script setup>
import { ref, defineEmits } from "vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

const query = ref("");
const filter = ref("all");
const emit = defineEmits(["search", "filterChange"]);

function onSearch() {
  if (query.value.trim()) {
    emit("search", query.value.trim());
  }
}

function onFilterChange() {
  emit("filterChange", filter.value);
}
</script>

<template>
  <div
    class="flex flex-col gap-4 mb-8 p-6 bg-white rounded-2xl shadow-md border border-gray-100"
  >
    <div class="flex flex-col sm:flex-row gap-3">
      <input
        v-model="query"
        @keyup.enter="onSearch"
        class="input input-bordered flex-grow text-gray-200 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl px-4 py-3 transition-all duration-300 border-gray-300 **bg-white**"
        placeholder="Например: cats, mountains, nature..."
      />
      <button
        @click="onSearch"
        class="btn bg-emerald-500 border border-emerald-500 text-white hover:bg-emerald-600 hover:border-emerald-600 rounded-xl px-6 py-3 flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
      >
        <MagnifyingGlassIcon class="h-5 w-5" />
        <span class="hidden sm:inline">Поиск</span>
      </button>
    </div>

    <div class="flex gap-6 items-center text-gray-800 text-base">
      <label class="cursor-pointer flex items-center group">
        <input
          type="radio"
          value="all"
          v-model="filter"
          @change="onFilterChange"
          class="radio radio-success mr-2 checked:bg-emerald-500 border-gray-300 group-hover:border-emerald-500 transition-all duration-200"
        />
        <span class="group-hover:text-emerald-500 transition-all duration-200"
          >Все</span
        >
      </label>
      <label class="cursor-pointer flex items-center group">
        <input
          type="radio"
          value="liked"
          v-model="filter"
          @change="onFilterChange"
          class="radio radio-success mr-2 checked:bg-emerald-500 border-gray-300 group-hover:border-emerald-500 transition-all duration-200"
        />
        <span class="group-hover:text-emerald-500 transition-all duration-200"
          >Понравившиеся</span
        >
      </label>
    </div>
  </div>
</template>
