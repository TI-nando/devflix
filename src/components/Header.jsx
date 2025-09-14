import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Search, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <Film className="logo-icon" />
          <span className="logo-text">DevFlix</span>
        </Link>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Início
          </Link>
          <a href="#" className="nav-link" onClick={closeMenu}>Filmes</a>
          <a href="#" className="nav-link" onClick={closeMenu}>Séries</a>
          <a href="#" className="nav-link" onClick={closeMenu}>Favoritos</a>
        </nav>

        <div className="header-actions">
          <button className="search-btn" aria-label="Buscar">
            <Search className="search-icon" />
          </button>
          
          <button 
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;