import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Login from './pages/Login';
import GameLibrary from './pages/GameLibrary';
import GameDetail from './pages/GameDetail';
import Header from './components/Header';
import { isAuthenticated } from './utils/auth';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = await isAuthenticated();
    setAuthenticated(isAuth);
    setLoading(false);
  };

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthenticated(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default'
        }}
      >
        Loading...
      </Box>
    );
  }

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {authenticated && <Header onLogout={handleLogout} />}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Routes>
            <Route
              path="/login"
              element={
                authenticated ? (
                  <Navigate to="/library" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/library"
              element={
                authenticated ? (
                  <GameLibrary />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/game/:id"
              element={
                authenticated ? (
                  <GameDetail />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/"
              element={
                <Navigate to={authenticated ? '/library' : '/login'} replace />
              }
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
