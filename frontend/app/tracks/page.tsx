"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus, X } from "lucide-react"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { formatDuration } from "@/lib/data"
import { fetchTracks, Track } from "@/service/tracks"
import { fetchPlaylists, addTrackToPlaylist, Playlist } from "@/service/playlist"

export default function TracksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [playlistsLoading, setPlaylistsLoading] = useState(false)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    setLoading(true)
    fetchTracks()
      .then((data) => {
        setTracks(data)
        setError(null)
      })
      .catch(() => {
        setError("Erro ao carregar faixas")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const filteredTracks = tracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const openAddToPlaylistModal = async (trackId: string) => {
    setSelectedTrackId(trackId)
    setModalOpen(true)
    setPlaylistsLoading(true)

    try {
      const userPlaylists = await fetchPlaylists()
      setPlaylists(userPlaylists)
      window.alert(`${userPlaylists.length} playlists carregadas.`)
    } catch {
      window.alert("Erro ao carregar playlists")
    } finally {
      setPlaylistsLoading(false)
    }
  }

  const handleAddTrackToPlaylist = async () => {
    if (!selectedTrackId || !selectedPlaylistId) {
      window.alert("Selecione uma playlist")
      return
    }

    try {
      await addTrackToPlaylist(selectedPlaylistId, selectedTrackId)
      window.alert("Música adicionada à playlist com sucesso")
      setModalOpen(false)
      setSelectedTrackId(null)
      setSelectedPlaylistId(null)
    } catch (error) {
      window.alert("Erro ao adicionar faixa: " + (error as Error).message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Faixas</h1>
        <p className="text-muted-foreground">
          Explore nossa biblioteca de músicas e adicione às suas playlists
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por título ou artista..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p>Carregando faixas...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-4">
        {filteredTracks.map((track) => (
          <Card key={track.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={track.album_cover || "/placeholder.svg"}
                  alt={`${track.title} cover`}
                  width={60}
                  height={60}
                  className="rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{track.title}</h3>
                  <p className="text-sm text-muted-foreground">{track.artist}</p>
                </div>
                <div className="text-sm text-muted-foreground mr-4">
                  {formatDuration(track.duration)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openAddToPlaylistModal(track.id)}
                  title="Adicionar à playlist"
                >
                  <Plus className="h-5 w-5" />
                  <span className="sr-only">Adicionar à playlist</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!loading && filteredTracks.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Nenhuma faixa encontrada para "{searchTerm}"</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setModalOpen(false)
            setSelectedTrackId(null)
            setSelectedPlaylistId(null)
          }}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-md p-6 max-w-md w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Selecione a playlist
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setModalOpen(false)
                  setSelectedTrackId(null)
                  setSelectedPlaylistId(null)
                }}
                aria-label="Fechar modal"
              >
                <X className="h-5 w-5 text-gray-900 dark:text-gray-100" />
              </Button>
            </div>

            {playlistsLoading ? (
              <p className="text-gray-700 dark:text-gray-300">Carregando playlists...</p>
            ) : playlists.length === 0 ? (
              <p className="text-gray-700 dark:text-gray-300">
                Você não tem playlists. Crie uma para adicionar faixas.
              </p>
            ) : (
              <ul className="max-h-64 overflow-y-auto mb-4 border border-gray-200 dark:border-gray-700 rounded-md">
                {playlists.map((playlist) => (
                  <li key={playlist.id}>
                    <button
                      className={`w-full text-left py-2 px-3 rounded ${selectedPlaylistId === playlist.id
                        ? "bg-indigo-600 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      onClick={() => setSelectedPlaylistId(playlist.id)}
                    >
                      {playlist.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <Button disabled={!selectedPlaylistId} onClick={handleAddTrackToPlaylist} className="w-full">
              Adicionar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
