import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Film, Search, Menu, X, Star, Heart } from "lucide-react";
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

  const navItems = [
    { path: "/", label: "Início", icon: Film },
    { path: "/movies", label: "Filmes", icon: Film },
    { path: "/tv", label: "Séries", icon: Star },
    { path: "/favorites", label: "Favoritos", icon: Heart },
  ];

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <div className="logo-icon-wrapper">
            <Film className="logo-icon" />
          </div>
          <span className="logo-text">DevFlix</span>
        </Link>

        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
                onClick={closeMenu}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <button
            className="search-btn"
            aria-label="Buscar"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="search-icon" />
            <span className="search-text">Buscar</span>
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
