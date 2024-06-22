// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Page.login';
import { AuthProvider, useAuth } from './context/Context.Auth';
import { ThemeProvider } from './context/Context.Theme';
import LayoutComponent from './components/Layout.Component';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {!isAuthenticated ? (
        <Route path="*" element={<Login />} />
      ) : (
        <>
          <Route path="/home" element={<LayoutComponent />} />
          <Route path="/login" element={<Login />} />
        </>
      )}
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
