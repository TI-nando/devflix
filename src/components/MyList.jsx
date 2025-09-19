import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl, getMovieDetails, getTVShowDetails } from '../services/api';
import { useFavorites } from '../hooks/useFavorites';
import PreviewModal from './PreviewModal';

const MyList = () => {
  const [sortedFavorites, setSortedFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('dateAdded'); // dateAdded, title, rating, year
  const [filterBy, setFilterBy] = useState('all'); // all, movie, tv
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { favorites, removeFavorite } = useFavorites();

  useEffect(() => {
    sortAndFilterFavorites();
  }, [favorites, sortBy, filterBy]);

  const sortAndFilterFavorites = () => {
    let filtered = [...favorites];

    // Filtrar por tipo
    if (filterBy !== 'all') {
      filtered = filtered.filter(item => item.type === filterBy);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          const titleA = (a.title || a.name || '').toLowerCase();
          const titleB = (b.title || b.name || '').toLowerCase();
          return titleA.localeCompare(titleB);
        
        case 'rating':
          return (b.vote_average || 0) - (a.vote_average || 0);
        
        case 'year':
          const yearA = new Date(a.release_date || a.first_air_date || '1900').getFullYear();
          const yearB = new Date(b.release_date || b.first_air_date || '1900').getFullYear();
          return yearB - yearA;
        
        case 'dateAdded':
        default:
          return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
      }
    });

    setSortedFavorites(filtered);
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

  const handleRemoveFromList = (item, e) => {
    e.stopPropagation();
    removeFavorite(item.id);
  };

  const getSortLabel = (value) => {
    const labels = {
      dateAdded: 'Data de Adição',
      title: 'Título',
      rating: 'Avaliação',
      year: 'Ano'
    };
    return labels[value] || value;
  };

  const getFilterLabel = (value) => {
    const labels = {
      all: 'Todos',
      movie: 'Filmes',
      tv: 'Séries'
    };
    return labels[value] || value;
  };

  const formatYear = (item) => {
    const date = item.release_date || item.first_air_date;
    return date ? new Date(date).getFullYear() : 'N/A';
  };

  const formatDateAdded = (dateString) => {
    if (!dateString) return 'Data não disponível';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Adicionado ontem';
    if (diffDays <= 7) return `Adicionado há ${diffDays} dias`;
    if (diffDays <= 30) return `Adicionado há ${Math.ceil(diffDays / 7)} semanas`;
    return `Adicionado em ${date.toLocaleDateString('pt-BR')}`;
  };

  if (favorites.length === 0) {
    return (
      <div className="my-list empty">
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path 
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                stroke="currentColor" 
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <h2>Sua lista está vazia</h2>
          <p>Adicione filmes e séries à sua lista para assisti-los mais tarde.</p>
          <Link to="/" className="browse-btn">
            Explorar Conteúdo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="my-list">
        <div className="my-list-header">
          <div className="header-info">
            <h1>Minha Lista</h1>
            <p>{sortedFavorites.length} {sortedFavorites.length === 1 ? 'item' : 'itens'}</p>
          </div>

          <div className="list-controls">
            <div className="control-group">
              <label>Filtrar por:</label>
              <select 
                value={filterBy} 
                onChange={(e) => setFilterBy(e.target.value)}
                className="control-select"
              >
                <option value="all">Todos</option>
                <option value="movie">Filmes</option>
                <option value="tv">Séries</option>
              </select>
            </div>

            <div className="control-group">
              <label>Ordenar por:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="control-select"
              >
                <option value="dateAdded">Data de Adição</option>
                <option value="title">Título</option>
                <option value="rating">Avaliação</option>
                <option value="year">Ano</option>
              </select>
            </div>
          </div>
        </div>

        <div className="my-list-grid">
          {sortedFavorites.map((item) => (
            <div 
              key={item.id} 
              className="my-list-item"
              onClick={() => handleItemClick(item)}
            >
              <div className="item-poster">
                <img 
                  src={getImageUrl(item.poster_path)} 
                  alt={item.title || item.name}
                  loading="lazy"
                />
                
                <div className="item-overlay">
                  <div className="play-button">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="12" fill="rgba(255,255,255,0.9)"/>
                      <path d="M10 8l6 4-6 4V8z" fill="#000"/>
                    </svg>
                  </div>

                  <div className="item-actions">
                    <button 
                      className="remove-btn"
                      onClick={(e) => handleRemoveFromList(item, e)}
                      title="Remover da Minha Lista"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>

                    <Link 
                      to={`/${item.type}/${item.id}`}
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
                  <span className="item-year">{formatYear(item)}</span>
                  
                  {item.vote_average > 0 && (
                    <div className="item-rating">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#ffd700"/>
                      </svg>
                      {item.vote_average.toFixed(1)}
                    </div>
                  )}
                  
                  <span className="item-type">
                    {item.type === 'movie' ? 'Filme' : 'Série'}
                  </span>
                </div>

                <div className="item-added">
                  {formatDateAdded(item.dateAdded)}
                </div>

                {item.overview && (
                  <p className="item-overview">
                    {item.overview.length > 120 
                      ? `${item.overview.substring(0, 120)}...` 
                      : item.overview
                    }
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {sortedFavorites.length === 0 && filterBy !== 'all' && (
          <div className="no-results">
            <p>Nenhum {getFilterLabel(filterBy).toLowerCase()} encontrado na sua lista.</p>
            <button 
              onClick={() => setFilterBy('all')}
              className="clear-filter-btn"
            >
              Ver todos os itens
            </button>
          </div>
        )}
      </div>

      <PreviewModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        item={selectedItem}
        type={selectedItem?.type}
      />
    </>
  );
};

export default MyList;