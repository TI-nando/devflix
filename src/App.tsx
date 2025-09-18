import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import Movies from "./pages/Movies.jsx";
import TVShows from "./pages/TVShows.jsx";
import TVShowDetails from "./pages/TVShowDetails.jsx";
import Favorites from "./pages/Favorites.jsx";
import "./index.css";

function App() {
  return (
    <Router>
      <>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tv/:id" element={<TVShowDetails />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TVShows />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
        <Footer />
      </>
    </Router>
  );
}

export default App;
