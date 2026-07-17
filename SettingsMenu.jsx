import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Home() { return <h2>Главная страница</h2>; }
function About() { return <h2>О нас</h2>; }

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Главная</Link> | <Link to="/about">О нас</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;