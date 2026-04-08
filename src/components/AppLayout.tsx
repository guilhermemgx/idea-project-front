import { Link, NavLink } from 'react-router-dom';
import { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <Link to="/ideas" className="brand">
            D+Ideias
          </Link>
          <p className="subtitle">MVP para cadastro e gestão de ideias</p>
        </div>

        <nav className="nav-links">
          <NavLink
            to="/ideas"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            Listagem
          </NavLink>
          <NavLink
            to="/ideas/new"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            Nova ideia
          </NavLink>
        </nav>
      </header>

      <main className="page-content">{children}</main>
    </div>
  );
}
