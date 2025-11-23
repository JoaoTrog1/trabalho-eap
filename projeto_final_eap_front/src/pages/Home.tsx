import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { decodeToken } from '@/lib/jwt'
import {
  ArrowRight,
  Code,
  Hash,
  Search,
  Terminal,
  Zap
} from 'lucide-react'

const features = [
  {
    icon: Terminal,
    title: 'Salve comandos',
    description: 'Armazene seus comandos favoritos de terminal ou snippets de código com facilidade e rapidez.'
  },
  {
    icon: Hash,
    title: 'Organize com tags',
    description: 'Categorize seus comandos com tags personalizadas para encontrar exatamente o que precisa.'
  },
  {
    icon: Search,
    title: 'Busque por linguagem',
    description: 'Filtre comandos por linguagem de programação, facilitando o acesso a soluções específicas.'
  }
]

export default function Home() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const decoded = token ? decodeToken(token) : null
  const username = decoded?.sub ?? ''
  const friendlyName = username ? username.split('@')[0]?.split(' ')[0] ?? username : null
  const isAuthenticated = Boolean(token)

  return (
    <div className="relative w-full max-w-5xl mx-auto space-y-16">
      <section className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/80">
            Gerenciador de comandos
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
            Centralize e organize seus comandos em um só lugar
          </h1>
          <p className="text-lg leading-relaxed text-zinc-300">
            {friendlyName ? (
              <span>
                Bem-vindo de volta, <span className="text-white font-semibold">{friendlyName}</span>! Continue salvando e organizando seus comandos por linguagem e tags.
              </span>
            ) : (
              'Salve snippets de código, comandos de terminal e organize tudo com tags e filtros por linguagem de programação.'
            )}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {isAuthenticated ? (
              <Button
                asChild
                className="h-12 rounded-full bg-linear-to-r from-blue-500 via-sky-500 to-purple-600 px-6 text-base font-semibold text-white shadow-[0_20px_40px_rgba(56,189,248,0.25)] transition-transform hover:scale-[1.02]"
              >
                <Link to="/commands">
                  Ver meus comandos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  className="h-12 rounded-full bg-linear-to-r from-blue-500 via-sky-500 to-purple-600 px-6 text-base font-semibold text-white shadow-[0_20px_40px_rgba(56,189,248,0.25)] transition-transform hover:scale-[1.02]"
                >
                  <Link to="/login">
                    Começar agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-6 text-base text-white transition-colors hover:bg-white/15"
                >
                  <Link to="/register">Criar conta gratuita</Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Sincronização em tempo real
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-blue-400" />
              Suporte a múltiplas linguagens
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-300" />
              Busca instantânea
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-blue-500/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_40px_100px_rgba(10,10,20,0.45)]">
            <div className="grid gap-4">
              <div className="flex items-start justify-between rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-blue-300/80">Dashboard</span>
                  <p className="mt-2 text-2xl font-semibold text-white">Seus comandos organizados</p>
                  <p className="text-sm text-zinc-400">Acesse rapidamente snippets salvos por linguagem e tags.</p>
                </div>
                <Terminal className="h-8 w-8 text-blue-300" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    Comandos salvos
                    <span className="text-emerald-400">+12 hoje</span>
                  </div>
                  <p className="mt-2 text-3xl font-semibold text-white">247</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    Linguagens
                    <span className="text-blue-400">8 ativas</span>
                  </div>
                  <p className="mt-2 text-3xl font-semibold text-white">12</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-linear-to-r from-blue-500/20 via-purple-500/10 to-transparent p-5 text-sm text-zinc-200">
                Organize seus comandos com tags como #git, #docker, #python e filtre por linguagem para produtividade máxima.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-[0_25px_60px_rgba(12,12,35,0.45)] transition-transform hover:-translate-y-1">
            <div className="absolute -top-1 -right-1 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl transition-opacity group-hover:opacity-80" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/10">
              <Icon className="h-6 w-6 text-blue-200" />
            </div>
            <h3 className="relative mt-6 text-lg font-semibold text-white">{title}</h3>
            <p className="relative mt-3 text-sm leading-relaxed text-zinc-300">{description}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
