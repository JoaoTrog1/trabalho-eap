import { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { login } from '../services/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { extractApiErrorMessage } from '@/lib/api-error'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const state = location.state as { registered?: boolean } | null

    if (state?.registered) {
      setInfoMessage('Conta criada com sucesso! Agora é só entrar com suas credenciais.')
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      const res = await login({ username, password })
      const token = res.data?.token
      if (token) {
        localStorage.setItem('token', token)
        navigate('/')
      } else {
        setError('Resposta inválida do servidor')
      }
    } catch (err) {
      setError(extractApiErrorMessage(err, 'Não foi possível autenticar. Tente novamente.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center w-full px-4">
      <div className="relative w-full max-w-lg">
        <div className="pointer-events-none absolute -inset-x-10 -top-20 h-64 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative space-y-8">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200/80">
            Acesso seguro
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-white">
            Bem-vindo de volta
          </h1>
          <p className="text-base text-zinc-400">
            Conecte-se ao seu painel e acompanhe tudo em tempo real.
          </p>
        </div>

        <Card className="border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-white">Entrar na plataforma</CardTitle>
            <CardDescription className="text-zinc-400">
              Use suas credenciais para continuar sua jornada.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {infoMessage && (
              <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-100">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle className="text-emerald-100">Cadastro concluído</AlertTitle>
                <AlertDescription>{infoMessage}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="border-red-900/50 bg-red-950/40 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-red-200">Não foi possível entrar</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-300">Usuário</Label>
                <Input
                  id="username"
                  placeholder="ex: maria.silva"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  autoComplete="username"
                  className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500/40"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-linear-to-r from-blue-500 via-sky-500 to-purple-600 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition-transform hover:scale-[1.01] focus:scale-[0.99]"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-20" />
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Entrando...
                  </span>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-4 border-t border-white/10 py-6 text-sm text-zinc-400">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Autenticação protegida por JWT
            </div>
            <div className="flex w-full flex-col gap-4">
              <div className="text-center text-sm text-zinc-300">
                Novo por aqui?
              </div>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full border-white/10 text-white hover:bg-white/10"
              >
                <Link to="/register">Criar uma conta</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-zinc-500">
          Problemas de acesso? <a href="#" className="text-blue-300 hover:text-blue-200">Contate o suporte</a>
        </p>
      </div>
      </div>
    </div>
  )
}