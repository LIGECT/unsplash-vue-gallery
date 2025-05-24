import { ref, onMounted } from "vue";

export function useTheme() {
  const theme = ref("light");

  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
    localStorage.setItem("theme", theme.value);
    document.documentElement.setAttribute("data-theme", theme.value);
  };

  onMounted(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      theme.value = savedTheme;
      document.documentElement.setAttribute("data-theme", theme.value);
    }
  });

  return { theme, toggleTheme };
}