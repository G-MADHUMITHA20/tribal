import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { AppRoutes } from './routes/AppRoutes';
import { ChatbotWidget } from './components/common/ChatbotWidget';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
          <ChatbotWidget />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;
