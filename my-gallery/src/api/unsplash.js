import axios from "axios";

const API_KEY = "твой_ключ_от_Unsplash"; // Получи ключ на https://unsplash.com/developers
const BASE_URL = "https://api.unsplash.com";

const unsplash = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Client-ID ${API_KEY}`,
  },
});

// Функция поиска фото по запросу
export async function searchPhotos(query, perPage = 10) {
  try {
    const response = await unsplash.get("/search/photos", {
      params: {
        query,
        per_page: perPage,
      },
    });
    return response.data.results; // массив изображений
  } catch (error) {
    console.error("Ошибка при запросе к Unsplash:", error);
    throw error;
  }
}
