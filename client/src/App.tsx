import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import FilmDetailPage from './pages/FilmDetailPage';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>Une erreur inattendue est survenue.</p>
          <button
            className="back-btn"
            style={{ marginTop: '1rem' }}
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/film/:id" element={<FilmDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
