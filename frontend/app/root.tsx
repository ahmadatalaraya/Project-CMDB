import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>CMDB - Configuration Management Database</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">BSI</div>
          <div className="brand-text">
            <h1>CMDB</h1>
            <span>Configuration Management Database</span>
          </div>
        </div>
        <nav>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
          <NavLink to="/applications" className={({ isActive }) => (isActive ? "active" : "")}>
            Applications
          </NavLink>
          <NavLink to="/ips" className={({ isActive }) => (isActive ? "active" : "")}>
            IP Address
          </NavLink>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Terjadi kesalahan";
  let details = "Silakan coba lagi beberapa saat lagi.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Halaman tidak ditemukan" : "Terjadi kesalahan";
    details = error.statusText || details;
  } else if (error instanceof Error) {
    details = error.message;
  }

  return (
    <div className="content">
      <h1 className="page-title">{message}</h1>
      <p className="page-subtitle">{details}</p>
    </div>
  );
}
