import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Nav from "./components/Nav";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import GymWebsite from "./pages/gymwebsite"; // Import the GymWebsite page

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gymwebsite" element={<GymWebsite />} />
          </Routes>
        </main>
        <Nav />
      </div>
    </Router>
  );
}

export default App;
