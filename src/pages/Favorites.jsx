import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, Film, Tv, Trash2, Filter } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { getImageUrl } from "../services/api";

const Favorites = () => {
  const { favorites, removeFromFavorites, clearFavorites, getFavoritesByType } =
    useFavorites();
  const [activeFilter, setActiveFilter] = useState("all");

  const getFilteredFavorites = () => {
    switch (activeFilter) {
      case "movies":
        return getFavoritesByType("movie");
      case "tv":
        return getFavoritesByType("tv");
      default:
        return favorites;
    }
  };

  const filteredFavorites = getFilteredFavorites();

  const getItemLink = (item) => {
    return item.media_type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).getFullYear();
  };

  return (
    <div className="page">
      {/* Header da página */}
      <div className="page-header">
        <div className="container">
          <div className="page-header-content">
            <div className="page-header-main">
              <h1 className="page-title">
                <Heart className="page-title-icon" />
                Meus Favoritos
              </h1>
              <p className="page-subtitle">
                {favorites.length > 0
                  ? `${favorites.length} ${
                      favorites.length === 1 ? "item salvo" : "itens salvos"
                    }`
                  : "Nenhum favorito salvo ainda"}
              </p>
            </div>
            {favorites.length > 0 && (
              <button
                className="clear-favorites-btn"
                onClick={clearFavorites}
                title="Limpar todos os favoritos"
              >
                <Trash2 className="clear-icon" />
                Limpar Tudo
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        {favorites.length > 0 ? (
          <>
            {/* Filtros */}
            <div className="favorites-filters">
              <div className="filter-group">
                <Filter className="filter-icon" />
                <span className="filter-label">Filtrar por:</span>
                <div className="filter-buttons">
                  <button
                    className={`filter-btn ${
                      activeFilter === "all" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("all")}
                  >
                    Todos ({favorites.length})
                  </button>
                  <button
                    className={`filter-btn ${
                      activeFilter === "movies" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("movies")}
                  >
                    <Film className="filter-btn-icon" />
                    Filmes ({getFavoritesByType("movie").length})
                  </button>
                  <button
                    className={`filter-btn ${
                      activeFilter === "tv" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("tv")}
                  >
                    <Tv className="filter-btn-icon" />
                    Séries ({getFavoritesByType("tv").length})
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de favoritos */}
            {filteredFavorites.length > 0 ? (
              <div className="favorites-grid">
                {filteredFavorites.map((item) => (
                  <div
                    key={`${item.media_type}-${item.id}`}
                    className="favorite-item"
                  >
                    <Link to={getItemLink(item)} className="favorite-link">
                      <div className="favorite-poster">
                        <img
                          src={
                            getImageUrl(item.poster_path) ||
                            "/placeholder-movie.jpg"
                          }
                          alt={item.title}
                          loading="lazy"
                        />
                        <div className="favorite-overlay">
                          <div className="favorite-rating">
                            <Star className="star-icon" />
                            <span>{item.vote_average.toFixed(1)}</span>
                          </div>
                          <div className="favorite-type">
                            {item.media_type === "movie" ? (
                              <Film className="type-icon" />
                            ) : (
                              <Tv className="type-icon" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="favorite-info">
                        <h3 className="favorite-title">{item.title}</h3>
                        <p className="favorite-year">
                          {formatDate(item.release_date)}
                        </p>
                        {item.overview && (
                          <p className="favorite-overview">
                            {item.overview.length > 100
                              ? `${item.overview.substring(0, 100)}...`
                              : item.overview}
                          </p>
                        )}
                      </div>
                    </Link>
                    <button
                      className="remove-favorite-btn"
                      onClick={() =>
                        removeFromFavorites(item.id, item.media_type)
                      }
                      title="Remover dos favoritos"
                    >
                      <Heart className="heart-icon filled" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-filter-state">
                <div className="empty-filter-icon">
                  {activeFilter === "movies" ? <Film /> : <Tv />}
                </div>
                <h3>
                  Nenhum {activeFilter === "movies" ? "filme" : "série"}{" "}
                  favorito
                </h3>
                <p>
                  Você ainda não adicionou nenhum{" "}
                  {activeFilter === "movies" ? "filme" : "série"} aos seus
                  favoritos.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="empty-favorites-state">
            <div className="empty-favorites-icon">
              <Heart className="empty-heart" />
            </div>
            <h2>Seus favoritos aparecerão aqui</h2>
            <p>
              Explore filmes e séries e adicione seus favoritos clicando no
              ícone de coração.
            </p>
            <div className="empty-favorites-actions">
              <Link to="/movies" className="explore-btn">
                <Film className="explore-icon" />
                Explorar Filmes
              </Link>
              <Link to="/tv" className="explore-btn">
                <Tv className="explore-icon" />
                Explorar Séries
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
