import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AppPage from './app-page/AppPage';
import Layout from './global/Layout'
import Error from './global/Error'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RequireAuth, AuthProvider } from './context/auth'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<App />} />
          <Route
            path='appage'
            element={
              <RequireAuth>
                <AppPage />
              </RequireAuth>
            }
          >
          </Route>
          <Route path='*' element={<Error />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);