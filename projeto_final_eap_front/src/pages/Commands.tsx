import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import api from '@/services/auth'
import { extractApiErrorMessage } from '@/lib/api-error'
import { Plus, Search, ChevronLeft, ChevronRight, Copy, Check, Code, Terminal, Database, GitBranch, Box, FileText, Coffee } from 'lucide-react'

interface Command {
  id: number
  title: string
  content: string
  technology: string
  createdAt: string
}

interface CommandsResponse {
  content: Command[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

const technologies = [
  { value: 'JAVA', label: 'Java', icon: Coffee, color: 'from-orange-500/20 to-red-500/20', iconColor: 'text-orange-400' },
  { value: 'PYTHON', label: 'Python', icon: Code, color: 'from-blue-500/20 to-green-500/20', iconColor: 'text-blue-400' },
  { value: 'BASH', label: 'Bash', icon: Terminal, color: 'from-gray-500/20 to-slate-500/20', iconColor: 'text-gray-400' },
  { value: 'SQL', label: 'SQL', icon: Database, color: 'from-cyan-500/20 to-blue-500/20', iconColor: 'text-cyan-400' },
  { value: 'GIT', label: 'Git', icon: GitBranch, color: 'from-orange-500/20 to-red-500/20', iconColor: 'text-orange-400' },
  { value: 'DOCKER', label: 'Docker', icon: Box, color: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-blue-400' },
  { value: 'COMMAND', label: 'Command', icon: Terminal, color: 'from-purple-500/20 to-pink-500/20', iconColor: 'text-purple-400' },
  { value: 'TEXT', label: 'Text', icon: FileText, color: 'from-zinc-500/20 to-gray-500/20', iconColor: 'text-zinc-400' }
]

const getTechnologyInfo = (value: string) => {
  const tech = technologies.find(t => t.value === value)
  return tech || technologies[7] // fallback to TEXT
}

export default function Commands() {
  const navigate = useNavigate()
  const [commands, setCommands] = useState<Command[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [size] = useState(6)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [technology, setTechnology] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchCommands = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      })
      if (debouncedSearch) params.append('search', debouncedSearch)
      if (technology) params.append('technology', technology)

      const response = await api.get<CommandsResponse>(`/commands?${params}`)
      setCommands(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      setError(extractApiErrorMessage(err, 'Erro ao carregar comandos'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommands()
  }, [page, debouncedSearch, technology])

  const copyContent = async (id: number, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch (err) {
      // fallback: attempt to create a temporary textarea
      try {
        const ta = document.createElement('textarea')
        ta.value = content
        ta.style.position = 'fixed'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 1500)
      } catch (e) {
        console.error('Copy failed', e)
      }
    }
  }

  // Pagination helper: returns a window of page numbers centered on current
  const getPageNumbers = (current: number, total: number, maxButtons = 5) => {
    const half = Math.floor(maxButtons / 2)
    let start = Math.max(0, current - half)
    let end = Math.min(total - 1, start + maxButtons - 1)
    if (end - start + 1 < maxButtons) start = Math.max(0, end - maxButtons + 1)
    const nums: number[] = []
    for (let i = start; i <= end; i++) nums.push(i)
    return { nums, start, end }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6 transition-all duration-500 ease-in-out">

      <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/5 via-white/5 to-transparent p-6 shadow-[0_25px_60px_rgba(12,12,35,0.45)] transition-all duration-300 hover:-translate-y-1">
        <div className="absolute -top-1 -right-1 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl transition-opacity group-hover:opacity-80" />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                <Search className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Meus Comandos</h3>
                <p className="text-zinc-400 text-sm">Gerencie seus snippets e comandos salvos</p>
              </div>
            </div>
            <Button onClick={() => navigate('/commands/new')} className="group relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-lg bg-linear-to-r from-blue-500 via-sky-500 to-purple-600 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition-transform hover:scale-[1.01] focus:scale-[0.99] px-6">
              <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-20" />
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              Novo Comando
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <Input
                  id="search"
                  placeholder="Buscar por título ou conteúdo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-12 border-white/10 bg-zinc-900/50 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500/40 rounded-xl autofill:bg-zinc-900/50 autofill:text-white"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <Label htmlFor="technology-filter" className="sr-only">Tecnologia</Label>
              <Select value={technology || "all"} onValueChange={(value: string) => setTechnology(value === "all" ? "" : value)}>
                <SelectTrigger className="border-white/10 bg-zinc-900/50 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500/40 h-12 w-full rounded-xl px-3 py-3 min-h-12">
                  <SelectValue placeholder="Todas as tecnologias" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-zinc-900/90 rounded-xl">
                  <SelectItem value="all" className="text-zinc-300 rounded-lg">Todas as tecnologias</SelectItem>
                  {technologies.map((tech) => {
                    const TechIcon = tech.icon
                    return (
                      <SelectItem key={tech.value} value={tech.value} className="text-zinc-300 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TechIcon className={`h-4 w-4 ${tech.iconColor}`} />
                          {tech.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={`loading-${i}`} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/5 via-white/5 to-transparent p-4 text-left shadow-[0_20px_50px_rgba(12,12,35,0.45)] animate-pulse min-h-[260px]">
              <div className="absolute -top-1 -right-1 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="relative flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/10"></div>
                  <div>
                    <div className="h-5 bg-zinc-700 rounded mb-2 w-32"></div>
                    <div className="h-4 bg-zinc-700 rounded w-20"></div>
                  </div>
                </div>
              </div>
              <div className="relative mb-3">
                <div className="h-3 bg-zinc-700 rounded mb-2 w-24"></div>
                <div className="rounded-lg border border-white/5 bg-zinc-900/30 p-3">
                  <div className="h-4 bg-zinc-700 rounded mb-1"></div>
                  <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                </div>
              </div>
              <div className="relative flex gap-2">
                <div className="flex-1 h-9 rounded-lg bg-zinc-700"></div>
                <div className="flex-1 h-9 rounded-lg bg-zinc-700"></div>
              </div>
            </div>
          ))
        ) : commands.length === 0 ? (
          <div className="col-span-full flex items-center justify-center min-h-[300px]">
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/5 via-white/5 to-transparent p-6 text-center shadow-[0_20px_50px_rgba(12,12,35,0.45)] transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-1 -right-1 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl transition-opacity group-hover:opacity-80" />
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/10 mx-auto mb-4">
                  <Plus className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Nenhum comando encontrado</h3>
                <p className="text-zinc-400 text-sm">Crie seu primeiro comando para começar a organizar seus snippets!</p>
              </div>
            </div>
          </div>
        ) : (
          commands.map((command) => {
            const techInfo = getTechnologyInfo(command.technology)
            const TechIcon = techInfo.icon
            return (
              <div key={command.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/5 via-white/5 to-transparent p-4 text-left shadow-[0_20px_50px_rgba(12,12,35,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_35px_80px_rgba(56,189,248,0.25)] min-h-[200px] cursor-pointer" onClick={() => navigate(`/commands/edit/${command.id}`, { state: { command } })}>
                <div className={`absolute -top-1 -right-1 h-28 w-28 rounded-full ${techInfo.color} blur-3xl transition-opacity group-hover:opacity-80`} />
                <div className="relative flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 shrink-0">
                      <TechIcon className={`h-5 w-5 ${techInfo.iconColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-white leading-tight truncate">{command.title}</h3>
                      <div className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-linear-to-r ${techInfo.color} px-2.5 py-1 text-xs font-medium ${techInfo.iconColor} mt-1`}>
                        <TechIcon className="h-3 w-3" />
                        {techInfo.label}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); copyContent(command.id, command.content) }}
                      aria-label="Copiar conteúdo"
                      title="Copiar conteúdo"
                      className="h-10 w-10 p-0 rounded-lg text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {copiedId === command.id ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="relative mb-2">
                  <div className="rounded-lg border border-white/5 bg-zinc-900/30 p-2 h-20 overflow-y-auto pr-3 content-scroll" style={{ scrollbarGutter: 'stable' }}>
                    <p className="text-zinc-200 text-sm leading-5 font-mono h-full">
                      {command.content}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {totalPages > 1 && (() => {
        const { nums, start, end } = getPageNumbers(page, totalPages, 7)
        return (
          <div className="w-full flex justify-start">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(0)}
                disabled={page === 0}
                className="h-9 px-3 text-zinc-300 hover:bg-white/6 disabled:opacity-50"
                title="Primeira página"
              >
                Primeiro
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                disabled={page === 0}
                className="h-9 px-2 text-zinc-300 hover:bg-white/6 disabled:opacity-50"
                title="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {start > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setPage(0)} className="h-9 px-2 text-zinc-300 hover:bg-white/6">1</Button>
              )}
              {start > 1 && <span className="px-2 text-zinc-500">…</span>}

              {nums.map(n => (
                <Button
                  key={n}
                  variant={n === page ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPage(n)}
                  className={`h-9 px-2 ${n === page ? 'bg-white/10 text-white' : 'text-zinc-300 hover:bg-white/6'}`}
                >
                  {n + 1}
                </Button>
              ))}

              {end < totalPages - 2 && <span className="px-2 text-zinc-500">…</span>}
              {end < totalPages - 1 && (
                <Button variant="ghost" size="sm" onClick={() => setPage(totalPages - 1)} className="h-9 px-2 text-zinc-300 hover:bg-white/6">{totalPages}</Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={page === totalPages - 1}
                className="h-9 px-2 text-zinc-300 hover:bg-white/6 disabled:opacity-50"
                title="Próxima página"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      })()}

    </div>
  )
}