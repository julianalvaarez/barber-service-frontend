import { Footer } from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import { Outlet } from "react-router-dom";

export function UserLayouts() {
  return (
    <div>
        <Header />
        <Outlet /> {/* 👈 aquí se renderizan las páginas hijas */}
        <Footer />
    </div>
  );
}
