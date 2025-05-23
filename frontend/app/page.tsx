import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Music } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="mb-8">
        <Music className="h-20 w-20 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">Bem-vindo à Plataforma de Streaming de Música</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Descubra novas músicas, crie playlists personalizadas e compartilhe suas faixas favoritas.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/tracks">Explorar Faixas</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/playlists">Minhas Playlists</Link>
        </Button>
      </div>
    </div>
  )
}
