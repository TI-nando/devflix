import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Calendar,
  Clock,
  Play,
  ArrowLeft,
  Users,
  Award,
  Tv,
} from "lucide-react";
import {
  getTVShowDetails,
  getImageUrl,
  getBackdropUrl,
  getTrailerUrl,
} from "../services/api";

const TVShowDetails = () => {
  const { id } = useParams();
  const [tvShow, setTVShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTVShowDetails = async () => {
      try {
        setLoading(true);
        const data = await getTVShowDetails(id);
        setTVShow(data);
      } catch (err) {
        setError("Erro ao carregar detalhes da série.");
        console.error("Erro ao buscar detalhes da série:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTVShowDetails();
  }, [id]);

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

  if (error || !tvShow) {
    return (
      <div className="page">
        <div className="container">
          <div className="error-state">
            <h2>Série não encontrada</h2>
            <p>{error}</p>
            <Link to="/tv" className="back-btn">
              <ArrowLeft className="back-icon" />
              Voltar às Séries
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const trailerUrl = getTrailerUrl(tvShow.videos);
  const creator = tvShow.created_by?.[0];
  const mainCast = tvShow.credits?.cast?.slice(0, 5) || [];
  const firstAirYear = tvShow.first_air_date
    ? new Date(tvShow.first_air_date).getFullYear()
    : "N/A";
  const lastAirYear = tvShow.last_air_date
    ? new Date(tvShow.last_air_date).getFullYear()
    : "Em exibição";
  const yearRange =
    firstAirYear === lastAirYear
      ? firstAirYear
      : `${firstAirYear} - ${lastAirYear}`;

  return (
    <div className="page">
      {/* Seção Hero com imagem de fundo */}
      <div
        className="movie-hero"
        style={{
          backgroundImage: `url(${getBackdropUrl(tvShow.backdrop_path)})`,
        }}
      >
        <div className="movie-hero-overlay">
          <div className="container">
            <Link to="/tv" className="back-btn">
              <ArrowLeft className="back-icon" />
              Voltar
            </Link>

            <div className="movie-hero-content">
              <div className="movie-poster-large">
                <img src={getImageUrl(tvShow.poster_path)} alt={tvShow.name} />
              </div>

              <div className="movie-hero-info">
                <h1 className="movie-hero-title">{tvShow.name}</h1>
                {tvShow.tagline && (
                  <p className="movie-tagline">"{tvShow.tagline}"</p>
                )}

                {/* Metadados da série */}
                <div className="movie-meta">
                  <div className="meta-item">
                    <Star className="meta-icon" />
                    <span>{tvShow.vote_average.toFixed(1)}/10</span>
                  </div>
                  <div className="meta-item">
                    <Calendar className="meta-icon" />
                    <span>{yearRange}</span>
                  </div>
                  <div className="meta-item">
                    <Tv className="meta-icon" />
                    <span>
                      {tvShow.number_of_seasons} temporada
                      {tvShow.number_of_seasons !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="meta-item">
                    <Award className="meta-icon" />
                    <span>{tvShow.vote_count.toLocaleString()} votos</span>
                  </div>
                </div>

                {/* Gêneros da série */}
                <div className="movie-genres">
                  {tvShow.genres.map((genre) => (
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

      {/* Seção de detalhes da série */}
      <div className="container">
        <div className="movie-details-section">
          <div className="movie-details-grid">
            <div className="movie-info-section">
              <h2 className="section-title">Sinopse</h2>
              <p className="movie-overview">
                {tvShow.overview || "Sinopse não disponível."}
              </p>

              {/* Informações do criador */}
              {creator && (
                <div className="director-info">
                  <h3>Criação</h3>
                  <p>{creator.name}</p>
                </div>
              )}

              {/* Estatísticas da série */}
              <div className="movie-stats">
                <div className="stat">
                  <h4>Temporadas</h4>
                  <p>{tvShow.number_of_seasons}</p>
                </div>
                <div className="stat">
                  <h4>Episódios</h4>
                  <p>{tvShow.number_of_episodes}</p>
                </div>
                <div className="stat">
                  <h4>Status</h4>
                  <p>
                    {tvShow.status === "Ended"
                      ? "Finalizada"
                      : tvShow.status === "Returning Series"
                      ? "Em exibição"
                      : tvShow.status}
                  </p>
                </div>
                <div className="stat">
                  <h4>Idioma Original</h4>
                  <p>{tvShow.original_language.toUpperCase()}</p>
                </div>
              </div>

              {/* Informações das redes */}
              {tvShow.networks && tvShow.networks.length > 0 && (
                <div className="networks-info">
                  <h3>Redes</h3>
                  <div className="networks-list">
                    {tvShow.networks.map((network) => (
                      <span key={network.id} className="network-tag">
                        {network.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
                        src={
                          getImageUrl(actor.profile_path) ||
                          "/placeholder-person.jpg"
                        }
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

export default TVShowDetails;