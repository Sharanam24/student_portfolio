import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Footer from './components/Footer';
import './App.css';

const portfolioData = {
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
      category: "Web",
      repo: "https://github.com/Sharanam24/PRO-TRACK-AUTO",
    },
    {
      title: "STOCK-PRICE-PREDICTOR",
      description: "Streamlit web app that predicts NSE/BSE stock prices using LSTM and Random Forest models with interactive charts, metrics, and buy/sell signals.",
      tech: ["Python", "Streamlit", "LSTM", "Random Forest", "Pandas", "Matplotlib"],
      category: "AI / ML",
      repo: "https://github.com/Sharanam24/STOCK-PRICE-PREDICTOR",
    },
    {
      title: "FINANCE-TRACKER",
      description: "Streamlit app to track personal expenses — log them manually or scan receipts with OCR, with category filters and spending charts.",
      tech: ["Python", "Streamlit", "OCR", "Pandas", "Matplotlib"],
      category: "Web",
      repo: "https://github.com/Sharanam24/FINANCE-TRACKER",
    },
    {
      title: "CHARUSAT-RESEARCH-PAPER-ANALYZER",
      description: "Centralized platform that fetches and stores CHARUSAT research papers, searchable by author name, department, year, and keywords.",
      tech: ["HTML", "CSS", "JavaScript"],
      category: "Web",
      repo: "https://github.com/Sharanam24/CHARUSAT-RESEARCH-PAPER-ANALYZER",
    },
    {
      title: "Currency-Converter",
      description: "A currency converter application to convert between different world currencies with live exchange rates.",
      tech: ["JavaScript", "HTML", "CSS"],
      category: "Web",
      repo: "https://github.com/Sharanam24/Currency-Converter",
    },
  ],
};

export default function App() {
  return (
    <div className="portfolio">
      <Header name={portfolioData.name} />
      <Hero name={portfolioData.name} tagline={portfolioData.tagline} />
      <Projects projects={portfolioData.projects} />
      <Footer email={portfolioData.email} phone={portfolioData.phone} github={portfolioData.github} year={portfolioData.year} />
    </div>
  );
}
