import { ref, onMounted } from "vue";

export function useColumnCount() {
  const columnCount = ref(3);

  const updateColumnCount = (count) => {
    columnCount.value = count;
    localStorage.setItem("columnCount", count);
  };

  onMounted(() => {
    const savedColumnCount = localStorage.getItem("columnCount");
    if (savedColumnCount) {
      columnCount.value = parseInt(savedColumnCount);
    }
  });

  return { columnCount, updateColumnCount };
}