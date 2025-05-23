export interface Track {
  id: string
  title: string
  artist: string
  duration: number
  album_cover?: string
  created_at?: string
}

export interface Playlist {
  id: string
  name: string
  user_id: string
  created_at?: string
  updated_at?: string
}

export interface PlaylistTrack {
  id: string
  playlist_id: string
  track_id: string
  added_at?: string
}

export interface User {
  id: string
  email: string
  created_at?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
