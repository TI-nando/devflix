import { useState, useEffect } from "react";

const FAVORITES_KEY = "devflix_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Erro ao salvar favoritos:", error);
    }
  }, [favorites]);

  const addToFavorites = (item) => {
    const favoriteItem = {
      id: item.id,
      title: item.title || item.name,
      poster_path: item.poster_path,
      vote_average: item.vote_average,
      release_date: item.release_date || item.first_air_date,
      media_type: item.media_type || (item.title ? "movie" : "tv"),
      overview: item.overview,
      added_at: new Date().toISOString(),
    };

    setFavorites((prev) => {
      const exists = prev.some(
        (fav) =>
          fav.id === item.id && fav.media_type === favoriteItem.media_type
      );

      if (exists) {
        return prev;
      }

      return [favoriteItem, ...prev];
    });
  };

  const removeFromFavorites = (id, mediaType) => {
    setFavorites((prev) =>
      prev.filter((fav) => !(fav.id === id && fav.media_type === mediaType))
    );
  };

  const isFavorite = (id, mediaType) => {
    return favorites.some(
      (fav) => fav.id === id && fav.media_type === mediaType
    );
  };

  const toggleFavorite = (item) => {
    const mediaType = item.media_type || (item.title ? "movie" : "tv");

    if (isFavorite(item.id, mediaType)) {
      removeFromFavorites(item.id, mediaType);
    } else {
      addToFavorites(item);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const getFavoritesByType = (mediaType) => {
    return favorites.filter((fav) => fav.media_type === mediaType);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    getFavoritesByType,
    favoritesCount: favorites.length,
  };
};

export default useFavorites;