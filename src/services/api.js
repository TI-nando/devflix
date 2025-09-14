// Configuração da API TMDb
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

// IMPORTANTE: Adicione sua chave da API TMDb no arquivo .env
// Crie um arquivo .env na raiz do projeto e adicione:
// VITE_TMDB_API_KEY=your_api_key_here
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!API_KEY) {
  console.error('Chave da API TMDb não encontrada. Adicione VITE_TMDB_API_KEY no seu arquivo .env');
}

// Função genérica para requisições da API
const apiRequest = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('language', 'pt-BR');
  
  // Adiciona parâmetros adicionais
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Falha na requisição da API:', error);
    throw error;
  }
};

// Funções da API
export const getPopularMovies = (page = 1) => {
  return apiRequest('/movie/popular', { page });
};

export const getMovieDetails = (movieId) => {
  return apiRequest(`/movie/${movieId}`, { append_to_response: 'videos,credits' });
};

export const searchMovies = (query, page = 1) => {
  return apiRequest('/search/movie', { query, page });
};

export const getTopRatedMovies = (page = 1) => {
  return apiRequest('/movie/top_rated', { page });
};

export const getUpcomingMovies = (page = 1) => {
  return apiRequest('/movie/upcoming', { page });
};

// Funções auxiliares para URLs de imagens
export const getImageUrl = (path) => {
  return path ? `${IMAGE_BASE_URL}${path}` : null;
};

export const getBackdropUrl = (path) => {
  return path ? `${BACKDROP_BASE_URL}${path}` : null;
};

// Obter URL do trailer do YouTube
export const getTrailerUrl = (videos) => {
  if (!videos || !videos.results) return null;
  
  const trailer = videos.results.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
};