import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LanguageProvider } from './context/useLanguage';
import { AuthProvider } from './context/AuthContext';

const GOOGLE_CLIENT_ID = "644147848430-pv2j9s9v77b8fnh0b21rglpfsqj4snru.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);