const BASE_URL = process.env.NEXT_DATA_BACKEND || "http://localhost:8080/api"

export type Track = {
  id: string
  title: string
  artist: string
  duration: number
  album_cover: string
  created_at: string
}

export type TracksResponse = {
  success: boolean
  data: Track[]
}

export async function fetchTracks(): Promise<Track[]> {
  const res = await fetch(`${BASE_URL}/tracks`)
  if (!res.ok) {
    throw new Error("Falha ao buscar faixas")
  }
  const json: TracksResponse = await res.json()
  if (!json.success) {
    throw new Error("API retornou sucesso falso")
  }
  return json.data
}