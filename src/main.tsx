import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './global.css';
import './lib/i18n';
import { registerSW } from 'virtual:pwa-register';

const AppShell = lazy(() => import('./app/AppShell').then(m => ({ default: m.AppShell })));
const AdminLayout = lazy(() => import('./admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import('./admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminScenarios = lazy(() => import('./admin/AdminScenarios').then(m => ({ default: m.AdminScenarios })));
const AdminScenarioEditor = lazy(() => import('./admin/AdminScenarioEditor').then(m => ({ default: m.AdminScenarioEditor })));

import { AuthProvider } from './lib/auth';

registerSW({ immediate: true });

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
      <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white rounded-full" />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="scenarios" element={<AdminScenarios />} />
              <Route path="scenarios/new" element={<AdminScenarioEditor />} />
              <Route path="scenarios/:id/edit" element={<AdminScenarioEditor />} />
            </Route>
            <Route path="/*" element={<AppShell />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
