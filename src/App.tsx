import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx'; // AQUI
import Footer from './components/Footer.jsx'; // AQUI
import Home from './pages/Home.jsx'; // AQUI
import MovieDetails from './pages/MovieDetails.jsx'; // AQUI
import './index.css';

function App() {
  return (
    <Router basename="/devflix">
      <>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
          </Routes>
        </main>
        <Footer />
      </>
    </Router>
  );
}

export default App;