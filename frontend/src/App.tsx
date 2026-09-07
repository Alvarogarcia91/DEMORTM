import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { VerificationDeskProvider } from './context/VerificationDeskContext';
import { NavigationModulesProvider } from './context/NavigationModulesContext';
import { LoginPage } from './components/LoginPage';
import { DashboardShell } from './components/DashboardShell';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider>
      <VerificationDeskProvider>
        <NavigationModulesProvider>
          <div className="min-h-screen bg-[#F4F4F6] text-zinc-900 font-sans selection:bg-[#1E3A8A] selection:text-white">
            {!isAuthenticated ? (
              <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
            ) : (
              <DashboardShell onLogout={() => setIsAuthenticated(false)} />
            )}
          </div>
        </NavigationModulesProvider>
      </VerificationDeskProvider>
    </ThemeProvider>
  );
};

export default App;
