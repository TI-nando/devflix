import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrendingAll, getBackdropUrl } from '../services/api';
import { useFavorites } from '../hooks/useFavorites';
import { Play, Info, Heart, ChevronLeft, ChevronRight, Star, Calendar, Film, Tv } from 'lucide-react';
import PreviewModal from './PreviewModal';

const HeroCarousel = () => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    loadTrendingContent();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );
      }, 7000); // Aumentado para 7 segundos

      return () => clearInterval(interval);
    }
  }, [items.length]);

  const loadTrendingContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrendingAll();
      // Pegar apenas os primeiros 5 itens para o carrossel
      setItems(data.results.slice(0, 5));
    } catch (err) {
      setError('Erro ao carregar conteúdo em destaque');
      console.error('Erro ao carregar trending:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (item) => {
    const isFavorited = favorites.some(fav => fav.id === item.id);
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    
    if (isFavorited) {
      removeFavorite(item.id);
    } else {
      addFavorite({ ...item, type });
    }
  };

  const handleMoreInfo = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === items.length - 1 ? 0 : currentIndex + 1);
  };

  if (loading) {
    return (
      <div className="hero-carousel loading">
        <div className="hero-loading">
          <div className="loading-spinner"></div>
          <p>Carregando destaques...</p>
        </div>
      </div>
    );
  }

  if (error || !items.length) {
    return (
      <div className="hero-carousel loading">
        <div className="hero-loading">
          <p>{error || 'Nenhum conteúdo encontrado'}</p>
          <button onClick={loadTrendingContent} className="retry-btn">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];
  const isFavorited = favorites.some(fav => fav.id === currentItem.id);
  const type = currentItem.media_type || (currentItem.title ? 'movie' : 'tv');

  return (
    <>
      <div className="hero-carousel">
        <div className="hero-slides">
          {items.map((item, index) => (
            <div 
              key={item.id}
              className={`hero-slide ${index === currentIndex ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${getBackdropUrl(item.backdrop_path)})`
              }}
            >
              <div className="hero-overlay"></div>
              
              <div className="hero-content">
                <div className="container">
                  <div className="hero-info">
                    <div className="hero-badge">
                      {type === 'movie' ? <Film size={16} /> : <Tv size={16} />}
                      <span>{type === 'movie' ? 'Filme' : 'Série'}</span>
                    </div>
                    
                    <h1 className="hero-title">
                      {item.title || item.name}
                    </h1>
                    
                    <div className="hero-meta">
                      <div className="hero-meta-item">
                        <Calendar size={16} />
                        <span>{new Date(item.release_date || item.first_air_date).getFullYear()}</span>
                      </div>
                      
                      {item.vote_average > 0 && (
                        <div className="hero-meta-item">
                          <Star size={16} fill="currentColor" />
                          <span>{item.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <p className="hero-overview">
                      {item.overview ? 
                        (item.overview.length > 200 ? 
                          item.overview.substring(0, 200) + '...' : 
                          item.overview
                        ) : 
                        'Descrição não disponível.'
                      }
                    </p>

                    <div className="hero-actions">
                      <Link 
                        to={`/${type}/${item.id}`}
                        className="hero-btn hero-btn-primary"
                      >
                        <Play size={20} fill="currentColor" />
                        <span>Assistir Agora</span>
                      </Link>

                      <button 
                        className="hero-btn hero-btn-secondary"
                        onClick={() => handleMoreInfo(item)}
                      >
                        <Info size={20} />
                        <span>Mais Informações</span>
                      </button>

                      <button 
                        className={`hero-btn-icon ${isFavorited ? 'favorited' : ''}`}
                        onClick={() => handleFavoriteToggle(currentItem)}
                        title={isFavorited ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                      >
                        <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controles de navegação */}
        <button className="hero-nav hero-nav-prev" onClick={goToPrevious} aria-label="Slide anterior">
          <ChevronLeft size={24} />
        </button>

        <button className="hero-nav hero-nav-next" onClick={goToNext} aria-label="Próximo slide">
          <ChevronRight size={24} />
        </button>

        {/* Indicadores */}
        <div className="hero-indicators">
          {items.map((_, index) => (
            <button
              key={index}
              className={`hero-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <PreviewModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        item={selectedItem}
        type={selectedItem?.media_type || (selectedItem?.title ? 'movie' : 'tv')}
      />
    </>
  );
};

export default HeroCarousel;