import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Commands from './pages/Commands'
import CommandEditor from './pages/CommandEditor'

function App() {
  return (
    <div className="dark relative flex min-h-screen w-full flex-col overflow-hidden bg-zinc-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
  <div className="absolute -top-40 left-1/2 aspect-square h-112 -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />
  <div className="absolute bottom-[-30%] left-[10%] aspect-square h-88 rounded-full bg-purple-500/15 blur-[140px]" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_55%)]" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(236,72,153,0.08),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,19,35,0.6),rgba(8,12,24,0.6))]" />
      </div>

      <Header />
      <main className="relative z-10 px-4 pt-20 pb-12 md:pt-24 md:pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/commands" element={<Commands />} />
          <Route path="/commands/new" element={<CommandEditor />} />
          <Route path="/commands/edit/:id" element={<CommandEditor />} />
        </Routes>
      </main>
    </div>
  )
}

export default App