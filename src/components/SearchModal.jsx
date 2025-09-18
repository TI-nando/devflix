import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, X, Star, Calendar, Tv, Film } from "lucide-react";
import { searchMulti, getImageUrl } from "../services/api";

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchMulti(searchQuery);
      const filteredResults = data.results.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
      );
      setResults(filteredResults);
    } catch (err) {
      setError("Erro ao buscar. Tente novamente.");
      console.error("Erro na busca:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setError(null);
    }
  }, [isOpen]);

  const getTitle = (item) => {
    return item.media_type === "movie" ? item.title : item.name;
  };

  const getReleaseDate = (item) => {
    const date =
      item.media_type === "movie" ? item.release_date : item.first_air_date;
    return date ? new Date(date).getFullYear() : "N/A";
  };

  const getLink = (item) => {
    return item.media_type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <div className="search-input-container">
            <Search className="search-input-icon" />
            <input
              type="text"
              placeholder="Buscar filmes e séries..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
          </div>
          <button className="search-close-btn" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="search-results">
          {loading && (
            <div className="search-loading">
              <div className="loading-spinner"></div>
              <p>Buscando...</p>
            </div>
          )}

          {error && (
            <div className="search-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && query && results.length === 0 && (
            <div className="search-no-results">
              <p>Nenhum resultado encontrado para "{query}"</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="search-results-list">
              {results.slice(0, 10).map((item) => (
                <Link
                  key={`${item.media_type}-${item.id}`}
                  to={getLink(item)}
                  className="search-result-item"
                  onClick={onClose}
                >
                  <div className="search-result-poster">
                    <img
                      src={
                        getImageUrl(item.poster_path) ||
                        "/placeholder-movie.jpg"
                      }
                      alt={getTitle(item)}
                      loading="lazy"
                    />
                  </div>
                  <div className="search-result-info">
                    <div className="search-result-header">
                      <h3 className="search-result-title">{getTitle(item)}</h3>
                      <div className="search-result-type">
                        {item.media_type === "movie" ? (
                          <Film className="media-type-icon" />
                        ) : (
                          <Tv className="media-type-icon" />
                        )}
                      </div>
                    </div>
                    <div className="search-result-meta">
                      <div className="search-result-year">
                        <Calendar className="meta-icon" />
                        <span>{getReleaseDate(item)}</span>
                      </div>
                      {item.vote_average > 0 && (
                        <div className="search-result-rating">
                          <Star className="meta-icon" />
                          <span>{item.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    {item.overview && (
                      <p className="search-result-overview">
                        {item.overview.length > 150
                          ? `${item.overview.substring(0, 150)}...`
                          : item.overview}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
