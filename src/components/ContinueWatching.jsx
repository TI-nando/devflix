import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';
import { useFavorites } from '../hooks/useFavorites';
import PreviewModal from './PreviewModal';

const ContinueWatching = () => {
  const [watchingItems, setWatchingItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    loadWatchingItems();
  }, []);

  const loadWatchingItems = () => {
    // Simular dados de "Continue Assistindo" - em uma aplicação real, 
    // isso viria de um backend com progresso real do usuário
    const mockWatchingData = [
      {
        id: 550,
        title: 'Clube da Luta',
        media_type: 'movie',
        poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        backdrop_path: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
        progress: 65,
        duration: 139,
        watchedMinutes: 90,
        lastWatched: '2024-01-15T20:30:00Z',
        overview: 'Um funcionário de escritório insone e um fabricante de sabão formam um clube de luta subterrâneo.',
        vote_average: 8.4
      },
      {
        id: 1399,
        name: 'Game of Thrones',
        media_type: 'tv',
        poster_path: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
        backdrop_path: '/suopoADq0k8YZr4dQXcU6pToj6s.jpg',
        progress: 23,
        season: 3,
        episode: 2,
        episodeTitle: 'Dark Wings, Dark Words',
        lastWatched: '2024-01-14T19:45:00Z',
        overview: 'Nove famílias nobres lutam pelo controle das terras míticas de Westeros.',
        vote_average: 9.2
      },
      {
        id: 94997,
        name: 'House of the Dragon',
        media_type: 'tv',
        poster_path: '/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg',
        backdrop_path: '/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg',
        progress: 78,
        season: 1,
        episode: 8,
        episodeTitle: 'The Lord of the Tides',
        lastWatched: '2024-01-13T21:15:00Z',
        overview: 'A história da Casa Targaryen 200 anos antes dos eventos de Game of Thrones.',
        vote_average: 8.5
      },
      {
        id: 238,
        title: 'O Poderoso Chefão',
        media_type: 'movie',
        poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        backdrop_path: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
        progress: 45,
        duration: 175,
        watchedMinutes: 79,
        lastWatched: '2024-01-12T18:20:00Z',
        overview: 'O patriarca de uma dinastia do crime organizado transfere o controle de seu império clandestino para seu filho relutante.',
        vote_average: 9.2
      },
      {
        id: 82856,
        name: 'The Mandalorian',
        media_type: 'tv',
        poster_path: '/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg',
        backdrop_path: '/9ijMGlJKqcslswWUzTEwScm82Gs.jpg',
        progress: 92,
        season: 2,
        episode: 7,
        episodeTitle: 'Chapter 15: The Believer',
        lastWatched: '2024-01-11T22:00:00Z',
        overview: 'As aventuras de um caçador de recompensas solitário nos confins da galáxia.',
        vote_average: 8.7
      }
    ];

    // Ordenar por última visualização (mais recente primeiro)
    const sortedItems = mockWatchingData.sort((a, b) => 
      new Date(b.lastWatched) - new Date(a.lastWatched)
    );

    setWatchingItems(sortedItems);
  };

  const handleItemClick = (item) => {
    // Scroll suave para o topo da página
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleFavoriteToggle = (item, e) => {
    e.stopPropagation();
    const isFavorited = favorites.some(fav => fav.id === item.id);
    
    if (isFavorited) {
      removeFavorite(item.id);
    } else {
      addFavorite({ ...item, type: item.media_type });
    }
  };

  const formatLastWatched = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Ontem';
    if (diffDays <= 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!watchingItems.length) {
    return null;
  }

  return (
    <>
      <div className="continue-watching">
        <div className="section-header">
          <h2>Continue Assistindo</h2>
          <Link to="/continue-watching" className="see-all">
            Ver tudo
          </Link>
        </div>

        <div className="continue-watching-grid">
          {watchingItems.map((item) => {
            const isFavorited = favorites.some(fav => fav.id === item.id);
            const isMovie = item.media_type === 'movie';

            return (
              <div 
                key={item.id} 
                className="continue-watching-item"
                onClick={() => handleItemClick(item)}
              >
                <div className="item-poster">
                  <img 
                    src={getImageUrl(item.poster_path)} 
                    alt={item.title || item.name}
                    loading="lazy"
                  />
                  
                  {/* Barra de progresso */}
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>

                  {/* Overlay com informações */}
                  <div className="item-overlay">
                    <div className="play-button">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="12" fill="rgba(255,255,255,0.9)"/>
                        <path d="M10 8l6 4-6 4V8z" fill="#000"/>
                      </svg>
                    </div>

                    <div className="item-actions">
                      <button 
                        className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
                        onClick={(e) => handleFavoriteToggle(item, e)}
                        title={isFavorited ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path 
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                            fill={isFavorited ? "currentColor" : "none"}
                            stroke="currentColor" 
                            strokeWidth="2"
                          />
                        </svg>
                      </button>

                      <Link 
                        to={`/${item.media_type}/${item.id}`}
                        className="details-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <path d="M9,9h6v6" stroke="currentColor" strokeWidth="2"/>
                          <path d="M9,15l6-6" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="item-info">
                  <h3 className="item-title">
                    {item.title || item.name}
                  </h3>
                  
                  <div className="item-meta">
                    {isMovie ? (
                      <span className="progress-text">
                        {formatDuration(item.watchedMinutes)} de {formatDuration(item.duration)}
                      </span>
                    ) : (
                      <span className="episode-info">
                        T{item.season}:E{item.episode} - {item.episodeTitle}
                      </span>
                    )}
                  </div>

                  <div className="item-details">
                    <span className="last-watched">
                      {formatLastWatched(item.lastWatched)}
                    </span>
                    
                    {item.vote_average > 0 && (
                      <div className="rating">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#ffd700"/>
                        </svg>
                        {item.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <PreviewModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        item={selectedItem}
        type={selectedItem?.media_type}
      />
    </>
  );
};

export default ContinueWatching;