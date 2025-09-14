import React from 'react';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">DevFlix</h3>
            <p className="footer-description">
              Descubra os melhores filmes e séries com informações completas, 
              trailers e avaliações da comunidade.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Links Rápidos</h4>
            <ul className="footer-links">
              <li><a href="#">Filmes Populares</a></li>
              <li><a href="#">Séries em Alta</a></li>
              <li><a href="#">Lançamentos</a></li>
              <li><a href="#">Favoritos</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Conecte-se</h4>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="GitHub">
                <Github />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <Linkedin />
              </a>
              <a href="#" className="social-link" aria-label="Email">
                <Mail />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 DevFlix. Feito com <Heart className="heart-icon" /> para os amantes do cinema.
          </p>
          <p className="footer-disclaimer">
            Este produto utiliza a API TMDb, mas não é endossado ou certificado pelo TMDb.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;