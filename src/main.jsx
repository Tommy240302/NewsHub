import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: '"Merriweather", serif',
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={{
          'html, body, #root': {
            fontFamily: '"Merriweather", serif !important',
          },
          '*': {
            fontFamily: '"Merriweather", serif !important',
          },
        }} />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
