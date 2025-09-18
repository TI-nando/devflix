import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Film, Search, Menu, X } from "lucide-react";
import SearchModal from "./SearchModal.jsx";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={closeMenu}
          >
            Início
          </Link>
          <Link
            to="/movies"
            className={`nav-link ${
              location.pathname === "/movies" ? "active" : ""
            }`}
            onClick={closeMenu}
          >
            Filmes
          </Link>
          <Link
            to="/tv"
            className={`nav-link ${
              location.pathname === "/tv" ? "active" : ""
            }`}
            onClick={closeMenu}
          >
            Séries
          </Link>
          <Link
            to="/favorites"
            className={`nav-link ${
              location.pathname === "/favorites" ? "active" : ""
            }`}
            onClick={closeMenu}
          >
            Favoritos
          </Link>
        </nav>

        <div className="header-actions">
          <button
            className="search-btn"
            aria-label="Buscar"
            onClick={() => setIsSearchOpen(true)}
          >
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

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
};

export default Header;
