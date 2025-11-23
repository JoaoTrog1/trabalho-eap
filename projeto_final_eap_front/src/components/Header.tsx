import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Button } from './ui/button'
import { decodeToken } from '@/lib/jwt'
import { LogOut, UserRound } from 'lucide-react'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')
  
  let username = ''
  if (token) {
    const decoded = decodeToken(token)
    username = decoded?.sub || ''
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/60 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link to="/" className="group flex items-center gap-3 transition">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-[0_15px_45px_rgba(37,99,235,0.35)] transition-transform group-hover:scale-[1.03]">
            <span className="text-lg font-semibold text-white">C</span>
            <span className="absolute inset-0 rounded-2xl border border-white/15 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-[0.4em] text-blue-300/80">Command</span>
            <span className="text-lg font-semibold text-white">Control Hub</span>
          </div>
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              isActive('/') 
                ? 'text-blue-400' 
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            Início
          </Link>

          {token && (
            <Link
              to="/commands"
              className={`text-sm font-medium transition-colors ${
                isActive('/commands')
                  ? 'text-blue-400'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              Comandos
            </Link>
          )}

          {token ? (
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                  <UserRound className="h-4 w-4 text-blue-300" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs uppercase tracking-[0.28em] text-zinc-500">Usuário</span>
                  <span className="font-medium text-white">{username}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden gap-2 rounded-full border-white/20 bg-white/10 text-white transition-colors hover:bg-red-500/20 hover:text-red-200 sm:flex"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-red-500/20 hover:text-red-200 sm:hidden"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full px-4 text-sm transition-colors ${
                    isActive('/login')
                      ? 'bg-white/10 text-blue-300'
                      : 'text-zinc-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="rounded-full bg-linear-to-r from-blue-500 to-purple-600 px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(99,102,241,0.35)] hover:from-blue-400 hover:to-purple-500"
                >
                  Registrar
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
