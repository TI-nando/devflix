import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Calendar, 
  Clock, 
  Play, 
  ArrowLeft, 
  Users,
  Award
} from 'lucide-react';
import { 
  getMovieDetails, 
  getImageUrl, 
  getBackdropUrl, 
  getTrailerUrl 
} from '../services/api';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função para buscar detalhes do filme
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError('Erro ao carregar detalhes do filme.');
        console.error('Erro ao buscar detalhes do filme:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Estado de carregamento
  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando detalhes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de erro ou filme não encontrado
  if (error || !movie) {
    return (
      <div className="page">
        <div className="container">
          <div className="error-state">
            <h2>Filme não encontrado</h2>
            <p>{error}</p>
            <Link to="/" className="back-btn">
              <ArrowLeft className="back-icon" />
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Extrai informações do filme
  const trailerUrl = getTrailerUrl(movie.videos);
  const director = movie.credits?.crew?.find(person => person.job === 'Director');
  const mainCast = movie.credits?.cast?.slice(0, 5) || [];

  return (
    <div className="page">
      {/* Seção Hero com imagem de fundo */}
      <div 
        className="movie-hero"
        style={{
          backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})`
        }}
      >
        <div className="movie-hero-overlay">
          <div className="container">
            <Link to="/" className="back-btn">
              <ArrowLeft className="back-icon" />
              Voltar
            </Link>
            
            <div className="movie-hero-content">
              <div className="movie-poster-large">
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                />
              </div>
              
              <div className="movie-hero-info">
                <h1 className="movie-hero-title">{movie.title}</h1>
                {movie.tagline && (
                  <p className="movie-tagline">"{movie.tagline}"</p>
                )}
                
                {/* Metadados do filme */}
                <div className="movie-meta">
                  <div className="meta-item">
                    <Star className="meta-icon" />
                    <span>{movie.vote_average.toFixed(1)}/10</span>
                  </div>
                  <div className="meta-item">
                    <Calendar className="meta-icon" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  <div className="meta-item">
                    <Clock className="meta-icon" />
                    <span>{movie.runtime} min</span>
                  </div>
                  <div className="meta-item">
                    <Award className="meta-icon" />
                    <span>{movie.vote_count.toLocaleString()} votos</span>
                  </div>
                </div>

                {/* Gêneros do filme */}
                <div className="movie-genres">
                  {movie.genres.map((genre) => (
                    <span key={genre.id} className="genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Botão do trailer */}
                <div className="movie-actions">
                  {trailerUrl && (
                    <a 
                      href={trailerUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="trailer-btn"
                    >
                      <Play className="play-icon" />
                      Assistir Trailer
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de detalhes do filme */}
      <div className="container">
        <div className="movie-details-section">
          <div className="movie-details-grid">
            <div className="movie-info-section">
              <h2 className="section-title">Sinopse</h2>
              <p className="movie-overview">
                {movie.overview || 'Sinopse não disponível.'}
              </p>

              {/* Informações do diretor */}
              {director && (
                <div className="director-info">
                  <h3>Direção</h3>
                  <p>{director.name}</p>
                </div>
              )}

              {/* Estatísticas do filme */}
              <div className="movie-stats">
                <div className="stat">
                  <h4>Orçamento</h4>
                  <p>
                    {movie.budget 
                      ? `$${movie.budget.toLocaleString()}` 
                      : 'Não divulgado'
                    }
                  </p>
                </div>
                <div className="stat">
                  <h4>Bilheteria</h4>
                  <p>
                    {movie.revenue 
                      ? `$${movie.revenue.toLocaleString()}` 
                      : 'Não divulgado'
                    }
                  </p>
                </div>
                <div className="stat">
                  <h4>Idioma Original</h4>
                  <p>{movie.original_language.toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Seção do elenco */}
            <div className="cast-section">
              <h3 className="cast-title">
                <Users className="cast-icon" />
                Elenco Principal
              </h3>
              <div className="cast-list">
                {mainCast.map((actor) => (
                  <div key={actor.id} className="cast-member">
                    <div className="cast-photo">
                      <img
                        src={getImageUrl(actor.profile_path) || '/placeholder-person.jpg'}
                        alt={actor.name}
                      />
                    </div>
                    <div className="cast-info">
                      <p className="cast-name">{actor.name}</p>
                      <p className="cast-character">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;