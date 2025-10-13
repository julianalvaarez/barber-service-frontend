import { Routes, Route } from 'react-router-dom'
import { LandingPage, PayPage, ConfirmPage, NotFound } from '../pages/landing'
import {ConfigPage, Dashboard, MonthlyBalance} from '../pages/admin'
import { UserLayouts, AdminLayouts } from '../layouts'

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
