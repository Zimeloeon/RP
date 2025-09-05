/**
 * Application Entry Point
 * 
 * This file bootstraps the React application with necessary providers:
 * - React Router for client-side routing
 * - Material-UI date picker localization
 * - Toast notification container
 * - React Strict Mode for development warnings
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';

// Create root element and render the application with all necessary providers
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Router provider for client-side navigation */}
    <BrowserRouter>
      {/* Date picker localization provider using Day.js */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* Main application component */}
        <App />
        {/* Global toast notification container */}
        <ToastContainer
          position="top-right"          // Position notifications in top-right corner
          autoClose={3000}              // Auto-close after 3 seconds
          hideProgressBar={false}       // Show progress bar for timing
          newestOnTop                   // Stack newest notifications on top
          closeOnClick                  // Allow click to dismiss
          rtl={false}                   // Left-to-right text direction
          pauseOnFocusLoss              // Pause timer when window loses focus
          draggable                     // Allow drag to dismiss
          pauseOnHover                  // Pause timer on hover
        />
      </LocalizationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
