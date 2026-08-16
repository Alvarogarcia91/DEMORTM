import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { HomeView } from './components/HomeView';
import { ProduccionView } from './components/ProduccionView';
import { SuajesView } from './components/SuajesView';
import { CalidadView } from './components/CalidadView';
import { DisenoView } from './components/DisenoView';
import { ReporteOperadorModal } from './components/ReporteOperadorModal';
import { 
  fetchDashboardMetrics, 
  fetchOrdenes, 
  fetchSuajes, 
  fetchInspeccionesQA, 
  fetchMuestras 
} from './services/api';
import { DashboardData, OrdenProduccion, SuajeItem, QAInspection, MuestraDiseno } from './types';

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Carlos Mendoza',
    role: 'Jefe de Producción (Offset & Flexo)',
    email: 'carlos.mendoza@rtmimpresos.com.mx'
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([]);
  const [suajes, setSuajes] = useState<SuajeItem[]>([]);
  const [inspeccionesQA, setInspeccionesQA] = useState<QAInspection[]>([]);
  const [muestras, setMuestras] = useState<MuestraDiseno[]>([]);
  const [isReporteModalOpen, setIsReporteModalOpen] = useState<boolean>(false);

  const loadAllData = async () => {
    try {
      const [dash, ord, suj, qa, mue] = await Promise.all([
        fetchDashboardMetrics(),
        fetchOrdenes(),
        fetchSuajes(),
        fetchInspeccionesQA(),
        fetchMuestras()
      ]);
      setDashboardData(dash);
      setOrdenes(ord);
      setSuajes(suj);
      setInspeccionesQA(qa);
      setMuestras(mue);
      setBackendOnline(true);
    } catch (err) {
      console.error('Error fetching data:', err);
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (user: { name: string; role: string; email: string }) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // If not logged in, show the Login screen
  if (!isLoggedIn) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="app-container app-fade-in">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        backendOnline={backendOnline} 
        user={currentUser}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {activeTab === 'home' && (
          <HomeView 
            user={currentUser}
            data={dashboardData}
            ordenes={ordenes}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenReporteModal={() => setIsReporteModalOpen(true)}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'produccion' && (
          <ProduccionView 
            ordenes={ordenes} 
            onOpenReporteModal={() => setIsReporteModalOpen(true)}
          />
        )}

        {activeTab === 'suajes' && (
          <SuajesView suajesList={suajes} />
        )}

        {activeTab === 'calidad' && (
          <CalidadView 
            inspecciones={inspeccionesQA} 
            onRefresh={loadAllData} 
          />
        )}

        {activeTab === 'diseno' && (
          <DisenoView muestras={muestras} />
        )}
      </main>

      <ReporteOperadorModal 
        isOpen={isReporteModalOpen}
        onClose={() => setIsReporteModalOpen(false)}
        onSuccess={loadAllData}
      />
    </div>
  );
}

export default App;
