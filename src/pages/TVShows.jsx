import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Calendar, TrendingUp, Award, Tv, Heart } from "lucide-react";
import {
  getPopularTVShows,
  getTopRatedTVShows,
  getOnTheAirTVShows,
  getImageUrl,
} from "../services/api";
import { useFavorites } from "../hooks/useFavorites";

const TVShows = () => {
  const [activeCategory, setActiveCategory] = useState("popular");
  const [tvShows, setTVShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const categories = [
    {
      id: "popular",
      name: "Populares",
      icon: TrendingUp,
      fetch: getPopularTVShows,
    },
    {
      id: "top_rated",
      name: "Bem Avaliadas",
      icon: Award,
      fetch: getTopRatedTVShows,
    },
    { id: "on_the_air", name: "No Ar", icon: Tv, fetch: getOnTheAirTVShows },
  ];

  const fetchTVShows = async (category) => {
    try {
      setLoading(true);
      setError(null);
      const categoryData = categories.find((cat) => cat.id === category);
      const data = await categoryData.fetch();
      setTVShows(data.results || []);
    } catch (err) {
      setError("Erro ao carregar séries. Verifique sua conexão.");
      console.error("Erro ao buscar séries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTVShows(activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="page">
      {/* Header da página */}
      <div className="page-header">
        <div className="container">
          <div className="page-header-content">
            <h1 className="page-title">Séries</h1>
            <p className="page-subtitle">
              Explore as melhores séries em diferentes categorias
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Filtros de categoria */}
        <div className="category-filters">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                className={`category-filter ${
                  activeCategory === category.id ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                <IconComponent className="category-icon" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Estados de carregamento e erro */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando séries...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <h2>Ops! Algo deu errado</h2>
            <p>{error}</p>
            <button
              onClick={() => fetchTVShows(activeCategory)}
              className="retry-btn"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Grid de séries */}
        {!loading && !error && (
          <section className="movies-section">
            <div className="section-header">
              <h2 className="section-title">
                {categories.find((cat) => cat.id === activeCategory)?.name}
              </h2>
              <p className="section-subtitle">
                {activeCategory === "popular" &&
                  "As séries mais assistidas no momento"}
                {activeCategory === "top_rated" &&
                  "Séries com as melhores avaliações"}
                {activeCategory === "on_the_air" && "Séries atualmente no ar"}
              </p>
            </div>

            <div className="movies-grid">
              {tvShows.map((show) => (
                <div key={show.id} className="movie-card">
                  <div className="movie-poster">
                    <img
                      src={
                        getImageUrl(show.poster_path) ||
                        "/placeholder-movie.jpg"
                      }
                      alt={show.name}
                      loading="lazy"
                    />
                    <div className="movie-overlay">
                      <div className="movie-rating">
                        <Star className="star-icon" />
                        <span>{show.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <Link to={`/tv/${show.id}`} className="movie-link">
                    <div className="movie-info">
                      <h3 className="movie-title">{show.name}</h3>
                      <p className="movie-year">
                        {show.first_air_date
                          ? new Date(show.first_air_date).getFullYear()
                          : "N/A"}
                      </p>
                    </div>
                  </Link>
                  <button
                    className={`favorite-btn ${
                      isFavorite(show.id, "tv") ? "favorited" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite({
                        id: show.id,
                        title: show.name,
                        poster_path: show.poster_path,
                        vote_average: show.vote_average,
                        first_air_date: show.first_air_date,
                        media_type: "tv",
                      });
                    }}
                    title={
                      isFavorite(show.id, "tv")
                        ? "Remover dos favoritos"
                        : "Adicionar aos favoritos"
                    }
                  >
                    <Heart className="heart-icon" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TVShows;