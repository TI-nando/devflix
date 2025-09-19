import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, TrendingUp, Film, Award, Clock, Heart } from 'lucide-react';
import { getPopularMovies, getImageUrl } from '../services/api';
import { useFavorites } from '../hooks/useFavorites';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    // Função para buscar filmes populares da API
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getPopularMovies();
        setMovies(data.results || []);
      } catch (err) {
        setError('Erro ao carregar filmes. Verifique se a chave da API TMDb está configurada.');
        console.error('Erro ao buscar filmes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleFavoriteToggle = (movie, e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({ ...movie, type: 'movie' });
  };

  // Estado de carregamento
  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando filmes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="error-state">
            <h2>Ops! Algo deu errado</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Seção Hero da página inicial */}
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Film size={20} />
              <span>DevFlix Original</span>
            </div>
            <h1 className="hero-title">
              Descubra os Melhores
              <span className="hero-highlight"> Filmes</span>
            </h1>
            <p className="hero-subtitle">
              Explore uma vasta coleção de filmes populares, lançamentos e clássicos do cinema mundial
            </p>
            <div className="hero-stats">
              <div className="stat">
                <TrendingUp className="stat-icon" />
                <span>Filmes Populares</span>
              </div>
              <div className="stat">
                <Award className="stat-icon" />
                <span>Bem Avaliados</span>
              </div>
              <div className="stat">
                <Clock className="stat-icon" />
                <span>Lançamentos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Seção de filmes populares */}
        <section className="movies-section">
          <div className="section-header">
            <h2 className="section-title">Filmes Populares</h2>
            <p className="section-subtitle">Os filmes mais assistidos no momento</p>
          </div>

          {/* Grid responsivo de filmes */}
          <div className="movies-grid">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <Link to={`/movie/${movie.id}`} className="movie-link">
                  <div className="movie-poster">
                    <img
                      src={getImageUrl(movie.poster_path) || '/placeholder-movie.jpg'}
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
                        <span>{new Date(movie.release_date).getFullYear()}</span>
                      </div>
                      <div className="movie-rating">
                        <Star size={14} fill="currentColor" />
                        <span>{movie.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <button
                  className={`favorite-btn ${isFavorite(movie.id) ? 'favorited' : ''}`}
                  onClick={(e) => handleFavoriteToggle(movie, e)}
                  aria-label={isFavorite(movie.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Heart className="heart-icon" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;