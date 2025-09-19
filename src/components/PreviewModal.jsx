import React, { useState, useEffect } from 'react';
import { X, Play, Heart, Bookmark, Star, Calendar, Clock, Users, Building } from 'lucide-react';
import { getMovieDetails, getTVShowDetails, getTrailerUrl, getImageUrl, getBackdropUrl } from '../services/api';
import { useFavorites } from '../hooks/useFavorites';

const PreviewModal = ({ isOpen, onClose, item, type = 'movie' }) => {
  const [details, setDetails] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const isFavorited = favorites.some(fav => fav.id === item?.id);

  useEffect(() => {
    if (isOpen && item) {
      fetchDetails();
    }
  }, [isOpen, item, type]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Buscar detalhes do item
      const detailsData = type === 'movie' 
        ? await getMovieDetails(item.id)
        : await getTVShowDetails(item.id);
      
      setDetails(detailsData);

      // Buscar trailer
      try {
        const trailer = await getTrailerUrl(item.id, type);
        setTrailerUrl(trailer);
      } catch (trailerError) {
        console.log('Trailer não encontrado:', trailerError);
        setTrailerUrl(null);
      }
    } catch (err) {
      setError('Erro ao carregar detalhes');
      console.error('Erro ao buscar detalhes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    if (isFavorited) {
      removeFavorite(item.id);
    } else {
      addFavorite({ ...item, type });
    }
  };

  const handleClose = () => {
    setDetails(null);
    setTrailerUrl(null);
    setError(null);
    onClose();
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  if (!isOpen || !item) return null;

  return (
    <div className="preview-modal-overlay" onClick={handleClose}>
      <div className="preview-modal" onClick={e => e.stopPropagation()}>
        <button className="preview-modal-close" onClick={handleClose}>
          <X size={24} />
        </button>

        {loading ? (
          <div className="preview-modal-loading">
            <div className="loading-spinner"></div>
            <p>Carregando...</p>
          </div>
        ) : error ? (
          <div className="preview-modal-error">
            <p>{error}</p>
            <button onClick={fetchDetails} className="retry-btn">Tentar novamente</button>
          </div>
        ) : (
          <>
            {/* Hero Section com Trailer ou Backdrop */}
            <div className="preview-modal-hero">
              {trailerUrl ? (
                <div className="preview-modal-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1&mute=1&controls=1&rel=0`}
                    title="Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div 
                  className="preview-modal-backdrop"
                  style={{
                    backgroundImage: `url(${getBackdropUrl(item.backdrop_path || item.poster_path)})`
                  }}
                >
                  <div className="preview-modal-backdrop-overlay"></div>
                </div>
              )}

              {/* Controles sobre o vídeo/imagem */}
              <div className="preview-modal-controls">
                <div className="preview-modal-actions">
                  <button className="preview-modal-btn preview-modal-btn-play">
                    <Play size={20} fill="currentColor" />
                    Assistir
                  </button>
                  
                  <button 
                    className={`preview-modal-btn-icon ${isFavorited ? 'favorited' : ''}`}
                    onClick={handleFavoriteToggle}
                    aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
                  </button>

                  <button className="preview-modal-btn-icon" aria-label="Adicionar à lista">
                    <Bookmark size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Informações do conteúdo */}
            <div className="preview-modal-content">
              <div className="preview-modal-info">
                <h2 className="preview-modal-title">
                  {item.title || item.name}
                </h2>

                <div className="preview-modal-meta">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{formatDate(item.release_date || item.first_air_date)}</span>
                  </div>
                  
                  {details?.runtime && (
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>{formatRuntime(details.runtime)}</span>
                    </div>
                  )}
                  
                  {details?.number_of_seasons && (
                    <div className="meta-item">
                      <Users size={14} />
                      <span>{details.number_of_seasons} temporada{details.number_of_seasons > 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {item.vote_average > 0 && (
                    <div className="meta-item preview-modal-rating">
                      <Star size={14} fill="currentColor" />
                      <span>{item.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <p className="preview-modal-overview">
                  {item.overview || 'Descrição não disponível.'}
                </p>

                {details?.genres && details.genres.length > 0 && (
                  <div className="preview-modal-section">
                    <h4>Gêneros</h4>
                    <div className="preview-modal-genres">
                      {details.genres.map(genre => (
                        <span key={genre.id} className="genre-tag">{genre.name}</span>
                      ))}
                    </div>
                  </div>
                )}

                {details?.production_companies && details.production_companies.length > 0 && (
                  <div className="preview-modal-section">
                    <h4><Building size={16} /> Produção</h4>
                    <p>{details.production_companies.slice(0, 3).map(company => company.name).join(', ')}</p>
                  </div>
                )}

                {details?.created_by && details.created_by.length > 0 && (
                  <div className="preview-modal-section">
                    <h4><Users size={16} /> Criadores</h4>
                    <p>{details.created_by.map(creator => creator.name).join(', ')}</p>
                  </div>
                )}
              </div>

              {/* Poster lateral */}
              <div className="preview-modal-poster">
                <img 
                  src={getImageUrl(item.poster_path)} 
                  alt={item.title || item.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-poster.jpg';
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewModal;