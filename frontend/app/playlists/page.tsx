"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  fetchPlaylists,
  createPlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  Playlist,
} from "@/service/playlist"

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [trackInputs, setTrackInputs] = useState<Record<string, string>>({})
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadPlaylists() {
      try {
        const data = await fetchPlaylists()
        setPlaylists(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar playlists",
          description: (error as Error).message,
          variant: "destructive",
        })
      }
    }
    loadPlaylists()
  }, [])

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newPlaylistName.trim()) {
      toast({
        title: "Nome inválido",
        description: "Por favor, insira um nome para a playlist",
        variant: "destructive",
      })
      return
    }

    try {
      const newPlaylist = await createPlaylist(newPlaylistName)
      setPlaylists((prev) => [...prev, newPlaylist])
      setNewPlaylistName("")
      toast({
        title: "Playlist criada",
        description: `A playlist "${newPlaylistName}" foi criada com sucesso`,
      })
      window.location.reload()
    } catch (error) {
      toast({
        title: "Erro ao criar playlist",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  const handleRemoveTrack = async (playlistId: string, trackId: string) => {
    try {
      await removeTrackFromPlaylist(playlistId, trackId)

      setPlaylists(
        playlists.map((playlist) =>
          playlist.id === playlistId
            ? {
              ...playlist,
              playlist_tracks: playlist.playlist_tracks.filter(
                (pt) => pt.track_id !== trackId,
              ),
            }
            : playlist,
        ),
      )

      toast({
        title: "Faixa removida",
        description: "A faixa foi removida da playlist",
      })

      window.location.reload()
    } catch (error) {
      toast({
        title: "Erro ao remover faixa",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  const handleAddTrackById = async (playlistId: string) => {
    const trackId = trackInputs[playlistId]?.trim()
    if (!trackId) {
      toast({
        title: "ID inválido",
        description: "Digite um ID de faixa para adicionar",
        variant: "destructive",
      })
      return
    }

    try {
      await addTrackToPlaylist(playlistId, trackId)
      toast({
        title: "Faixa adicionada",
        description: "A faixa foi adicionada com sucesso",
      })
      setTrackInputs((prev) => ({ ...prev, [playlistId]: "" }))
      window.location.reload()
    } catch (error) {
      toast({
        title: "Erro ao adicionar faixa",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Minhas Playlists</h1>
        <p className="text-muted-foreground">Gerencie suas playlists e organize suas músicas favoritas</p>
      </div>

      <div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancelar" : "Criar Playlist"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Playlist</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePlaylist} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="playlist-name" className="sr-only">
                  Nome da Playlist
                </Label>
                <Input
                  id="playlist-name"
                  placeholder="Nome da playlist"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                />
              </div>
              <Button type="submit">
                <Plus className="h-4 w-4 mr-2" />
                Criar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {playlists.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">Você ainda não tem playlists</p>
            <p className="mt-2">Clique em "Criar Playlist" para adicionar uma nova</p>
          </div>
        ) : (
          playlists.map((playlist) => (
            <Card key={playlist.id}>
              <CardHeader>
                <CardTitle>{playlist.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {playlist.playlist_tracks.length > 0 ? (
                    playlist.playlist_tracks.map(({ tracks }) => (
                      <div
                        key={tracks.id}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div className="truncate">
                          <p className="font-medium truncate">{tracks.title}</p>
                          <p className="text-sm text-muted-foreground">{tracks.artist}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveTrack(playlist.id, tracks.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover faixa</span>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Nenhuma faixa adicionada</p>
                      <Button asChild variant="link" className="mt-2">
                        <Link href="/tracks">Adicionar faixas</Link>
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-2 pt-4">
                    <Input
                      placeholder="ID da faixa"
                      value={trackInputs[playlist.id] || ""}
                      onChange={(e) =>
                        setTrackInputs((prev) => ({
                          ...prev,
                          [playlist.id]: e.target.value,
                        }))
                      }
                    />
                    <Button onClick={() => handleAddTrackById(playlist.id)}>
                      Adicionar faixa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
