import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import api from '@/services/auth'
import { extractApiErrorMessage } from '@/lib/api-error'
import { ArrowLeft, Save, Trash2, Coffee, Code, Terminal, Database, GitBranch, Box, FileText, AlertTriangle } from 'lucide-react'

interface Command {
  id: number
  title: string
  content: string
  technology: string
  createdAt: string
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

export default function CommandEditor() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const isEdit = !!id
  const commandFromState = location.state?.command as Command | undefined

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    technology: 'TEXT'
  })
  const [combinedText, setCombinedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (isEdit && commandFromState) {
      setFormData({
        title: commandFromState.title,
        content: commandFromState.content,
        technology: commandFromState.technology
      })
      setCombinedText(commandFromState.title + '\n' + commandFromState.content)
    } else if (isEdit && id) {
      // If no state, fetch the command
      const fetchCommand = async () => {
        setLoading(true)
        try {
          const response = await api.get<Command>(`/commands/${id}`)
          setFormData({
            title: response.data.title,
            content: response.data.content,
            technology: response.data.technology
          })
          setCombinedText(response.data.title + '\n' + response.data.content)
        } catch (err) {
          setFormError(extractApiErrorMessage(err, 'Erro ao carregar comando'))
        } finally {
          setLoading(false)
        }
      }
      fetchCommand()
    }
  }, [isEdit, id, commandFromState])

  const handleSave = async () => {
    const lines = combinedText.split('\n')
    const title = lines[0]?.trim() || ''
    const content = lines.slice(1).join('\n').trim()

    if (!title || !content || !formData.technology) {
      setFormError('Preencha o título (primeira linha), conteúdo e tecnologia')
      return
    }

    setFormError(null)
    setLoading(true)
    try {
      const dataToSend = { title, content, technology: formData.technology }
      if (isEdit && id) {
        await api.put(`/commands/${id}`, dataToSend)
      } else {
        await api.post('/commands', dataToSend)
      }
      navigate('/commands')
    } catch (err) {
      setFormError(extractApiErrorMessage(err, isEdit ? 'Erro ao editar comando' : 'Erro ao criar comando'))
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/commands')
  }

  const handleDelete = async () => {
    if (!id) return

    setLoading(true)
    setShowDeleteDialog(false)
    try {
      await api.delete(`/commands/${id}`)
      navigate('/commands')
    } catch (err) {
      setFormError(extractApiErrorMessage(err, 'Erro ao deletar comando'))
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8 p-6">
        <div className="animate-pulse">
          <div className="h-12 bg-zinc-700 rounded mb-4"></div>
          <div className="h-32 bg-zinc-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
        <div className="w-full max-w-7xl mx-auto space-y-8 p-6 transition-all duration-500 ease-in-out">

      <div className="flex items-center justify-between p-6 shrink-0">
        <div className="flex items-center gap-4 bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-4 h-14">
          <Button variant="ghost" onClick={handleBack} className="text-zinc-300 hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-4 h-14">
            <Select value={formData.technology} onValueChange={(value: string) => setFormData(prev => ({ ...prev, technology: value }))}>
              <SelectTrigger className="border border-white/10 bg-zinc-900/50 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500/40 h-10 w-48 rounded-xl px-3 py-2">
                <SelectValue placeholder="Tecnologia" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-zinc-900/90 rounded-xl">
                <SelectItem value="select" className="text-zinc-300 rounded-lg">Selecione a tecnologia</SelectItem>
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
            <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white h-10 w-10 p-0 rounded-xl">
              <Save className="h-4 w-4" />
            </Button>
          </div>
          {isEdit && (
            <Button variant="outline" onClick={() => setShowDeleteDialog(true)} disabled={loading} className="border-red-500/50 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300 h-10 px-4 rounded-xl">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 px-4">
        <Textarea
          id="combined"
          placeholder="Digite o título na primeira linha&#10;Conteúdo do comando aqui..."
          value={combinedText}
          onChange={(e) => setCombinedText(e.target.value)}
          className="w-full h-full border-none bg-transparent! text-white placeholder:text-zinc-500 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none resize-none text-lg leading-relaxed font-mono"
        />
      </div>

      {formError && (
        <div className="fixed bottom-6 left-6 right-6">
          <Alert variant="destructive" className="border-red-900/50 bg-red-950/40 text-red-200 rounded-xl">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        </div>
      )}

      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="group relative overflow-hidden rounded-2xl border border-red-500/20 bg-zinc-900/95 p-6 max-w-md mx-4 shadow-lg shadow-red-500/10">
            <div className="absolute -top-1 -right-1 h-28 w-28 rounded-full bg-red-500/10 blur-3xl" />
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Confirmar exclusão</h3>
              <p className="text-zinc-400 mb-6">
                Tem certeza que deseja deletar este comando? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/10 h-10 rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white h-10 rounded-xl"
                >
                  {loading ? 'Excluindo...' : 'Excluir'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}