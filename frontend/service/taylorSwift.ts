export interface Album {
  id: string
  title: string
  releaseDate: string
  cover: string
}

export interface Song {
  id: string
  title: string
  duration: string
}

export interface Lyrics {
  text: string
}
export type TaylorSong = {
  song_id: number
  title: string
  album_id: number
}

export interface FullAlbum {
  id: string
  title: string
  releaseDate: string
  cover: string
  songs: Song[]
}

export interface Album {
  id: string
  title: string
  releaseDate: string
  cover: string
}

export interface Song {
  song_id: number
  title: string
}


export async function fetchLyricsBySongId(songId: number): Promise<string> {
  const res = await fetch(`https://taylor-swift-api.sarbo.workers.dev/lyrics/${songId}`)
  if (!res.ok) throw new Error("Erro ao buscar letra da música")
  const data = await res.json()
  return data.lyrics || "Letra não disponível"
}

export async function fetchTaylorSwiftAlbums(): Promise<Album[]> {
  const res = await fetch("https://taylor-swift-api.sarbo.workers.dev/albums")
  if (!res.ok) throw new Error("Falha ao buscar álbuns")
  const data = await res.json()
  return data.map((album: any) => ({
    id: album.album_id.toString(),
    title: album.title,
    releaseDate: album.release_date,
    cover: album.cover_url || "",
  }))
}

export async function fetchSongsByAlbumId(albumId: string): Promise<Song[]> {
  const res = await fetch(`https://taylor-swift-api.sarbo.workers.dev/albums/${albumId}`)
  if (!res.ok) throw new Error("Falha ao buscar músicas")
  const data = await res.json()
  // data já é um array de músicas com song_id e title
  return data.map((song: any) => ({
    song_id: song.song_id,
    title: song.title,
  }))
}

export async function fetchAlbumById(albumId: string): Promise<Album> {
  const res = await fetch(`https://taylor-swift-api.sarbo.workers.dev/albums`) 
  if (!res.ok) throw new Error("Falha ao buscar álbum")
  const albums = await res.json()
  const album = albums.find((a: any) => a.album_id.toString() === albumId)
  if (!album) throw new Error("Álbum não encontrado")
  return {
    id: album.album_id.toString(),
    title: album.title,
    releaseDate: album.release_date,
    cover: album.cover_url || "",
  }
}
