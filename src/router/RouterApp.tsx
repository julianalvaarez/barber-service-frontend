import { Routes, Route } from 'react-router-dom'

// Páginas usuario
import LandingPage from '../pages/LandingPage'
import PayPage from '../pages/PayPage'
import ConfirmPage from '../pages/ConfirmPage'
import {NotFound} from '../pages/NotFound'

// Páginas admin
import Dashboard from '../pages/admin/Dashboard'
import { UserLayouts } from '@/layouts/UserLayouts'
import { AdminLayouts } from '@/layouts/AdminLayouts'
import { ConfigPage } from '@/pages/admin/ConfigPage'
import { MonthlyBalance } from '@/pages/admin/MonthlyBalance'

export function RouterApp() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="mx-auto w-full">
        <Routes >
          {/* usuario */}
          <Route element={<UserLayouts />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pay" element={<PayPage />} />
            <Route path="/success" element={<ConfirmPage />} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<NotFound />} />
          {/* admin */}
          <Route element={<AdminLayouts />}>
            <Route path="/admin/*" element={<Dashboard />} />
            <Route path="/admin/settings" element={<ConfigPage />} />
            <Route path="/admin/monthlyBalance" element={<MonthlyBalance />} />
          </Route>
        </Routes>
      </main>
    </div>
  )
}
