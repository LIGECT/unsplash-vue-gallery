<script setup>
import { ref, defineEmits } from "vue";

const query = ref("");
const emit = defineEmits(["search"]);

function onSearch() {
  if (query.value.trim()) {
    emit("search", query.value.trim());
  }
}
</script>

<template>
  <div class="flex gap-2"></div>
  <input
    v-model="query"
    @keyup.enter="onSearch"
    class="input input-bordered flex-grow"
  />
  <button @click="onSearch" class="btn btn-primary">Поиск</button>
</template>
