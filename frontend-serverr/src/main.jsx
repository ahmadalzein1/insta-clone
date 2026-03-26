import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext/AuthProvider.jsx';
import { ThemeProvider } from './context/ThemeContext/ThemeProvider.jsx';
import { SocketProvider } from './context/SocketContext/SocketProvider.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <AuthProvider>
      <SocketProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  </BrowserRouter>

);
