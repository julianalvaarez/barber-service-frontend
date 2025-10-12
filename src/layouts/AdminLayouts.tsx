import { HeaderAdmin } from "@/components/admin/HeaderAdmin";
import { Outlet } from "react-router-dom";

export function AdminLayouts() {
  return (
    <div>
        <HeaderAdmin />
        <Outlet /> {/* 👈 aquí se renderizan las páginas hijas */}
    </div>
  );
}
