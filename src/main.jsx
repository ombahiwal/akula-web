import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap first
import './index.css'
import './i18n/config'; // Initialize i18n
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
 <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
