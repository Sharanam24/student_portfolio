import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import Contact from './pages/Contact';
import './App.css';

export const portfolioData = {
  name: "Sharanam Katwala",
  tagline: "I am an AI & ML Engineering student specializing in Artificial Intelligence & Machine Learning.",
  email: "24aiml063@charusat.edu.in",
  phone: "+91 8490849102",
  github: "https://github.com/Sharanam24",
  year: 2026,
  projects: [
    {
      title: "PRO-TRACK-AUTO",
      description: "Full-stack role-based ERP for engineering students that replaces physical project diaries with digital workflows. Supports Student, Guide, Coordinator, and Committee roles with logbook approvals, group management, and reporting.",
      tech: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Node.js", "Express.js", "PostgreSQL", "JWT", "Zustand"],
      category: ["Web", "AI / ML"],
      repo: "https://github.com/Sharanam24/PRO-TRACK-AUTO",
    },
    {
      title: "STOCK-PRICE-PREDICTOR",
      description: "Streamlit web app that predicts NSE/BSE stock prices using LSTM and Random Forest models with interactive charts, metrics, and buy/sell signals.",
      tech: ["Python", "Streamlit", "LSTM", "Random Forest", "Pandas", "Matplotlib"],
      category: ["AI / ML"],
      repo: "https://github.com/Sharanam24/STOCK-PRICE-PREDICTOR",
    },
    {
      title: "FINANCE-TRACKER",
      description: "Streamlit app to track personal expenses — log them manually or scan receipts with OCR, with category filters and spending charts.",
      tech: ["Python", "Streamlit", "OCR", "Pandas", "Matplotlib"],
      category: ["Web"],
      repo: "https://github.com/Sharanam24/FINANCE-TRACKER",
    },
    {
      title: "CHARUSAT-RESEARCH-PAPER-ANALYZER",
      description: "Centralized platform that fetches and stores CHARUSAT research papers, searchable by author name, department, year, and keywords.",
      tech: ["HTML", "CSS", "JavaScript"],
      category: ["Web"],
      repo: "https://github.com/Sharanam24/CHARUSAT-RESEARCH-PAPER-ANALYZER",
    },
    {
      title: "Currency-Converter",
      description: "A currency converter application to convert between different world currencies with live exchange rates.",
      tech: ["JavaScript", "HTML", "CSS"],
      category: ["Web"],
      repo: "https://github.com/Sharanam24/Currency-Converter",
    },
  ],
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark class to <html> so CSS vars work globally
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="portfolio">
      <NavBar
        name={portfolioData.name}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(prev => !prev)}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home data={portfolioData} />} />
          <Route path="/projects" element={<ProjectsPage projects={portfolioData.projects} />} />
          <Route path="/contact" element={<Contact data={portfolioData} />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <h3>Contact Info</h3>
        <div className="footer-links">
          <a href={`mailto:${portfolioData.email}`}>Email: {portfolioData.email}</a>
        </div>
        <div className="footer-links">
          <a href={portfolioData.github} target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <p className="site-footer__copy">&copy; {portfolioData.year} {portfolioData.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
