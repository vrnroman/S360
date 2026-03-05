import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Survey from './components/Survey';
import Report from './components/Report';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <header className="bg-slate-900 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold tracking-tight">
                  360 Feedback System
                </Link>
              </div>
              <nav className="flex space-x-4">
                <Link to="/" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/survey/:id" element={<Survey />} />
            <Route path="/report/:id" element={<Report />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
