// src/api/unsplash.js
import axios from "axios";

const API_KEY = "5UUMZH0fWgy3Vbna_6Db0z8fDHieeCobLqp49BJiWKk";
const BASE_URL = "https://api.unsplash.com";

const unsplash = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Client-ID ${API_KEY}`,
  },
});

export async function searchPhotos(query, page = 1, perPage = 10) {
  try {
    const response = await unsplash.get("/search/photos", {
      params: {
        query,
        page, // Добавляем параметр страницы
        per_page: perPage,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Ошибка при запросе к Unsplash:", error);
    throw error;
  }
}
