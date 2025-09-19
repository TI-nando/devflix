import React from 'react';
import { Heart, Github, Linkedin, Mail, Film, Star, Tv, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <Film className="footer-brand-icon" />
              <h3 className="footer-title">DevFlix</h3>
            </div>
            <p className="footer-description">
              Descubra os melhores filmes e séries com informações completas, 
              trailers e avaliações da comunidade. Sua plataforma definitiva 
              para entretenimento de qualidade.
            </p>
            <div className="footer-stats">
              <div className="footer-stat">
                <Star className="stat-icon" />
                <span>Milhares de títulos</span>
              </div>
              <div className="footer-stat">
                <Clock className="stat-icon" />
                <span>Sempre atualizado</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">
              <Film size={18} />
              Explorar
            </h4>
            <ul className="footer-links">
              <li><a href="/movies">Filmes Populares</a></li>
              <li><a href="/tv">Séries em Alta</a></li>
              <li><a href="/">Lançamentos</a></li>
              <li><a href="/favorites">Meus Favoritos</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">
              <Tv size={18} />
              Categorias
            </h4>
            <ul className="footer-links">
              <li><a href="#">Ação & Aventura</a></li>
              <li><a href="#">Drama & Romance</a></li>
              <li><a href="#">Comédia & Família</a></li>
              <li><a href="#">Ficção Científica</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">
              <Mail size={18} />
              Conecte-se
            </h4>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
            <p className="footer-contact">
              Entre em contato para sugestões e feedback
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © 2025 DevFlix. Feito com <Heart className="heart-icon" size={16} fill="currentColor" /> para os amantes do cinema.
            </p>
            <p className="footer-disclaimer">
              Este produto utiliza a API TMDb, mas não é endossado ou certificado pelo TMDb.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;