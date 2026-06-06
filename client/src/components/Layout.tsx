import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/categories', label: 'Categories' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/profile', label: 'Profile' },
];

const Layout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link className="text-xl font-bold tracking-tight text-slate-900" to="/">
            Smart Gym Assistant
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-teal-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user?.role === 'admin' ? (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-amber-500 text-slate-900' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                Admin
              </NavLink>
            ) : null}
          </nav>
          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link className="btn-soft" to="/login">
                  Login
                </Link>
                <Link className="btn-primary" to="/register">
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="hidden text-sm font-medium text-slate-600 md:inline">{user?.name}</span>
                <button className="btn-soft" type="button" onClick={onLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
