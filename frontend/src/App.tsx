import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LoginView } from './components/LoginView';
import { HomeView } from './components/HomeView';
import { ProduccionView } from './components/ProduccionView';
import { SuajesView } from './components/SuajesView';
import { CalidadView } from './components/CalidadView';
import { DisenoView } from './components/DisenoView';
import { AnaliticaView } from './components/AnaliticaView';
import { CuentasCobrarView } from './components/CuentasCobrarView';
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
    role: 'Jefe de Planta & Producción',
    email: 'admin@rtmimpresos.com.mx'
  });

  const [activeTab, setActiveTab] = useState<string>('inicio');
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
    setActiveTab('inicio');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // If not logged in, show the split Login screen matching reference
  if (!isLoggedIn) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="erp-app-shell">
      {/* Dark Navy Sidebar from reference */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={currentUser}
        onLogout={handleLogout}
      />

      <div className="erp-main-wrapper">
        {/* Crisp White Topbar from reference */}
        <Topbar 
          user={currentUser} 
          onBack={() => setActiveTab('inicio')} 
        />

        {/* Content routing */}
        {activeTab === 'inicio' && (
          <HomeView 
            user={currentUser}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'produccion' && (
          <div className="erp-content-area">
            <ProduccionView 
              ordenes={ordenes} 
              onOpenReporteModal={() => setIsReporteModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'suajes' && (
          <div className="erp-content-area">
            <SuajesView suajesList={suajes} />
          </div>
        )}

        {activeTab === 'calidad' && (
          <div className="erp-content-area">
            <CalidadView 
              inspecciones={inspeccionesQA} 
              onRefresh={loadAllData} 
            />
          </div>
        )}

        {activeTab === 'diseno' && (
          <div className="erp-content-area">
            <DisenoView muestras={muestras} />
          </div>
        )}

        {activeTab === 'cotizaciones' && (
          <div className="erp-content-area">
            <AnaliticaView />
          </div>
        )}

        {activeTab === 'cuentas_cobrar' && (
          <CuentasCobrarView />
        )}

        {activeTab === 'reportes' && (
          <div className="erp-content-area">
            <AnaliticaView />
          </div>
        )}
      </div>

      <ReporteOperadorModal 
        isOpen={isReporteModalOpen}
        onClose={() => setIsReporteModalOpen(false)}
        onSuccess={loadAllData}
      />
    </div>
  );
}

export default App;
