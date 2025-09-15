# DevFlix

DevFlix é uma aplicação web para descobrir, explorar e visualizar informações sobre filmes, utilizando a [API TMDb](https://www.themoviedb.org/). Com uma interface moderna e responsiva, permite ao usuário navegar por filmes populares, ver detalhes completos, trailers, elenco e muito mais.

## 🚀 Tecnologias Utilizadas

- **React**: Biblioteca principal para construção da interface.
- **React Router DOM**: Navegação entre páginas.
- **Vite**: Ferramenta de build e desenvolvimento rápido.
- **TypeScript**: Tipagem estática para maior segurança no código.
- **Tailwind CSS**: Estilização rápida e responsiva.
- **Lucide React**: Ícones SVG modernos.
- **TMDb API**: Fonte dos dados de filmes.

## ⚙️ Principais Funcionalidades

- **Listagem de Filmes Populares**  
  Exibe uma grade com os filmes mais populares do momento.

- **Detalhes do Filme**  
  Página dedicada com informações completas: sinopse, nota, ano, duração, gêneros, diretor, elenco principal, orçamento, bilheteria e trailer.

- **Busca de Filmes**  
  (A implementar) Permite pesquisar filmes pelo nome.

- **Navegação Rápida**  
  Menu fixo com links para páginas principais.

- **Design Responsivo**  
  Interface adaptada para desktop, tablet e mobile.

- **Feedback de Carregamento e Erro**  
  Estados visuais para carregamento e falhas na comunicação com a API.

- **Rodapé com Links Sociais**  
  Informações sobre o projeto e links para redes sociais.

## 🛠️ Como Rodar o Projeto

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/username/devflix.git
   cd devflix
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   ```

3. **Configure a chave da API TMDb:**
   - Copie o arquivo `.env.example` para `.env`
   - Adicione sua chave TMDb em `VITE_TMDB_API_KEY`

4. **Inicie o servidor de desenvolvimento:**
   ```sh
   npm run dev
   ```

5. **Acesse:**  
   [http://localhost:5173/devflix](http://localhost:5173/devflix)

## 📁 Estrutura do Projeto

- `src/components/` — Componentes reutilizáveis (Header, Footer)
- `src/pages/` — Páginas principais (Home, MovieDetails)
- `src/services/` — Integração com a API TMDb
- `src/App.tsx` — Configuração das rotas e layout principal

## 📦 Deploy

O projeto está pronto para deploy no GitHub Pages. Use:

```sh
npm run deploy
```

## 📝 Licença

Este projeto utiliza a API TMDb, mas não é endossado ou certificado pelo TMDb.

---

Feito com ❤️ para os amantes do cinema!