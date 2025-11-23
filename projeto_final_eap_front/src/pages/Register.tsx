import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, UserPlus } from 'lucide-react'
import { extractApiErrorMessage } from '@/lib/api-error'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await register({ username, password })
      navigate('/login', {
        state: {
          registered: true,
        },
      })
    } catch (err) {
      setError(extractApiErrorMessage(err, 'Não foi possível concluir o cadastro.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center w-full px-4">
      <div className="relative w-full max-w-lg">
        <div className="pointer-events-none absolute -inset-x-10 -top-24 h-64 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative space-y-8">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-200/80">
            Comece agora
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-white">
            Crie sua conta
          </h1>
          <p className="text-base text-zinc-400">
            Em poucos minutos você desbloqueia todos os recursos da plataforma.
          </p>
        </div>

        <Card className="border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-white">Vamos começar</CardTitle>
            <CardDescription className="text-zinc-400">
              Informe seus dados para criar o acesso.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {error && (
              <Alert variant="destructive" className="border-red-900/50 bg-red-950/40 text-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="text-red-200">Ops, algo deu errado</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-300">Usuário</Label>
                <Input
                  id="username"
                  placeholder="ex: ana.costa"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  autoComplete="username"
                  className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/40"
                />
                <p className="text-xs text-zinc-500">Mínimo 3 caracteres, sem espaços.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Escolha uma senha forte"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="new-password"
                  className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/40"
                />
                <p className="text-xs text-zinc-500">Use pelo menos 6 caracteres, misturando letras e números.</p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/10 p-4 text-xs text-zinc-400">
                Ao continuar, você concorda com os nossos{' '}
                <a href="#" className="text-purple-300 hover:text-purple-200">Termos de Serviço</a>{' '}
                e{' '}
                <a href="#" className="text-purple-300 hover:text-purple-200">Política de Privacidade</a>.
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-linear-to-r from-purple-500 via-violet-500 to-blue-500 text-base font-semibold text-white shadow-lg shadow-purple-500/20 transition-transform hover:scale-[1.01] focus:scale-[0.99]"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-20" />
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Registrando...
                  </span>
                ) : (
                  <>
                    Criar conta
                    <UserPlus className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-4 border-t border-white/10 py-6 text-sm text-zinc-400">
            <div className="flex h-10 w-full items-center justify-between rounded-lg border border-white/5 bg-white/5 px-4 text-xs uppercase tracking-[0.2em] text-zinc-500">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Cadastro protegido
              </span>
              <span className="text-zinc-400">Criptografia em repouso</span>
            </div>
            <Button
              asChild
              variant="outline"
              className="h-12 w-full border-white/10 text-white hover:bg-white/10"
            >
              <Link to="/login">Já tenho conta</Link>
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-zinc-500">
          Dúvidas? <a href="#" className="text-purple-300 hover:text-purple-200">Visite nosso FAQ</a>
        </p>
      </div>
    </div>
  </div>
  )
}