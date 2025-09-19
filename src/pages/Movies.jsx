import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Calendar, TrendingUp, Award, Clock, Heart } from "lucide-react";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getImageUrl,
} from "../services/api";
import { useFavorites } from "../hooks/useFavorites";

const Movies = () => {
  const [activeCategory, setActiveCategory] = useState("popular");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const categories = [
    {
      id: "popular",
      name: "Populares",
      icon: TrendingUp,
      fetch: getPopularMovies,
    },
    {
      id: "top_rated",
      name: "Bem Avaliados",
      icon: Award,
      fetch: getTopRatedMovies,
    },
    { id: "upcoming", name: "Em Breve", icon: Clock, fetch: getUpcomingMovies },
  ];

  // Função para buscar filmes da categoria ativa
  const fetchMovies = async (category) => {
    try {
      setLoading(true);
      setError(null);
      const categoryData = categories.find((cat) => cat.id === category);
      const data = await categoryData.fetch();
      setMovies(data.results || []);
    } catch (err) {
      setError("Erro ao carregar filmes. Verifique sua conexão.");
      console.error("Erro ao buscar filmes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(activeCategory);
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
            <h1 className="page-title">Filmes</h1>
            <p className="page-subtitle">
              Descubra os melhores filmes em diferentes categorias
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
            <p>Carregando filmes...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <h2>Ops! Algo deu errado</h2>
            <p>{error}</p>
            <button
              onClick={() => fetchMovies(activeCategory)}
              className="retry-btn"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Grid de filmes */}
        {!loading && !error && (
          <section className="movies-section">
            <div className="section-header">
              <h2 className="section-title">
                {categories.find((cat) => cat.id === activeCategory)?.name}
              </h2>
              <p className="section-subtitle">
                {activeCategory === "popular" &&
                  "Os filmes mais assistidos no momento"}
                {activeCategory === "top_rated" &&
                  "Filmes com as melhores avaliações"}
                {activeCategory === "upcoming" &&
                  "Próximos lançamentos do cinema"}
              </p>
            </div>

            <div className="movies-grid">
              {movies.map((movie) => (
                <div key={movie.id} className="movie-card">
                  <Link to={`/movie/${movie.id}`} className="movie-link">
                    <div className="movie-poster">
                      <img
                        src={
                          getImageUrl(movie.poster_path) ||
                          "/placeholder-movie.jpg"
                        }
                        alt={movie.title}
                        loading="lazy"
                      />
                      <div className="movie-overlay">
                        <div className="movie-rating">
                          <Star className="star-icon" fill="currentColor" />
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="movie-info">
                      <h3 className="movie-title">{movie.title}</h3>
                      <div className="movie-meta">
                        <div className="movie-year">
                          <Calendar size={14} />
                          <span>
                            {movie.release_date
                              ? new Date(movie.release_date).getFullYear()
                              : "N/A"}
                          </span>
                        </div>
                        <div className="movie-rating">
                          <Star size={14} fill="currentColor" />
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <button
                    className={`favorite-btn ${
                      isFavorite(movie.id, "movie") ? "favorited" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite({
                        id: movie.id,
                        title: movie.title,
                        poster_path: movie.poster_path,
                        vote_average: movie.vote_average,
                        release_date: movie.release_date,
                        type: "movie",
                      });
                    }}
                    aria-label={
                      isFavorite(movie.id, "movie")
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

export default Movies;