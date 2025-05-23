const BASE_URL = process.env.NEXT_DATA_BACKEND || "http://localhost:8080/api"

export type Track = {
  id: string
  title: string
  artist: string
  duration: number
  album_cover: string
  created_at: string
}

export type PlaylistTrack = {
  tracks: Track
  added_at: string
  track_id: string
}

export type Playlist = {
  id: string
  name: string
  user_id: string
  created_at: string
  updated_at: string
  playlist_tracks: PlaylistTrack[]
}

export type PlaylistsResponse = {
  success: boolean
  data: Playlist[]
}

export async function fetchPlaylists(): Promise<Playlist[]> {
  const res = await fetch(`${BASE_URL}/playlists`)
  if (!res.ok) {
    throw new Error("Falha ao buscar playlists")
  }
  const json: PlaylistsResponse = await res.json()
  if (!json.success) {
    throw new Error("API retornou sucesso falso")
  }
  return json.data
}

export async function createPlaylist(name: string): Promise<Playlist> {
  const res = await fetch(`${BASE_URL}/playlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
    }),
  })

  if (!res.ok) {
    throw new Error("Erro ao criar playlist")
  }

  const json = await res.json()
  if (!json.success) {
    throw new Error(json.message || "Erro desconhecido ao criar playlist")
  }

  return json.data
}

export async function addTrackToPlaylist(playlistId: string, trackId: string) {
  const res = await fetch(`${BASE_URL}/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ track_id: trackId }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Erro ao adicionar faixa à playlist")
  }

  const json = await res.json()
  return json
}

export async function removeTrackFromPlaylist(playlistId: string, trackId: string) {
  const res = await fetch(`${BASE_URL}/playlists/${playlistId}/tracks/${trackId}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Erro ao remover faixa da playlist")
  }

  const json = await res.json()
  return json
}