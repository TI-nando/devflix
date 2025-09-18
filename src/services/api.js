const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!API_KEY) {
  console.error(
    "Chave da API TMDb não encontrada. Adicione VITE_TMDB_API_KEY no seu arquivo .env"
  );
}

const apiRequest = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${API_KEY}`);
  headers.append("Content-Type", "application/json");

  url.searchParams.append("language", "pt-BR");

  Object.keys(params).forEach((key) => {
    url.searchParams.append(key, params[key]);
  });

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Falha na requisição da API:", error);
    throw error;
  }
};

export const getPopularMovies = (page = 1) => {
  return apiRequest("/movie/popular", { page });
};

export const getMovieDetails = (movieId) => {
  return apiRequest(`/movie/${movieId}`, {
    append_to_response: "videos,credits",
  });
};

export const searchMovies = (query, page = 1) => {
  return apiRequest("/search/movie", { query, page });
};

export const getTopRatedMovies = (page = 1) => {
  return apiRequest("/movie/top_rated", { page });
};

export const getUpcomingMovies = (page = 1) => {
  return apiRequest("/movie/upcoming", { page });
};

export const getPopularTVShows = (page = 1) => {
  return apiRequest("/tv/popular", { page });
};

export const getTVShowDetails = (tvId) => {
  return apiRequest(`/tv/${tvId}`, { append_to_response: "videos,credits" });
};

export const searchTVShows = (query, page = 1) => {
  return apiRequest("/search/tv", { query, page });
};

export const getTopRatedTVShows = (page = 1) => {
  return apiRequest("/tv/top_rated", { page });
};

export const getOnTheAirTVShows = (page = 1) => {
  return apiRequest("/tv/on_the_air", { page });
};

export const searchMulti = (query, page = 1) => {
  return apiRequest("/search/multi", { query, page });
};

export const getImageUrl = (path) => {
  return path ? `${IMAGE_BASE_URL}${path}` : null;
};

export const getBackdropUrl = (path) => {
  return path ? `${BACKDROP_BASE_URL}${path}` : null;
};

export const getTrailerUrl = (videos) => {
  if (!videos || !videos.results) return null;

  const trailer = videos.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
};
