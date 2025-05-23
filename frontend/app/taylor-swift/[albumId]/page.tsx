"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchAlbumById, fetchSongsByAlbumId, Album, Song } from "@/service/taylorSwift"

export default function AlbumDetailPage() {
    const { albumId } = useParams() as { albumId: string }
    const [album, setAlbum] = useState<Album | null>(null)
    const [songs, setSongs] = useState<Song[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        async function load() {
            if (!albumId) return
            try {
                const [albumData, songsData] = await Promise.all([
                    fetchAlbumById(albumId),
                    fetchSongsByAlbumId(albumId),
                ])
                setAlbum(albumData)
                setSongs(songsData)
            } catch (err) {
                toast({
                    title: "Erro ao carregar dados do álbum",
                    description: (err as Error).message,
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [albumId])

    if (loading) return <p>Carregando álbum e músicas...</p>
    if (!album) return <p>Álbum não encontrado.</p>

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">{album.title}</h1>
            {album.cover && (
                <img src={album.cover} alt={album.title} className="w-full max-w-md rounded" />
            )}
            <p>Data de lançamento: {album.releaseDate}</p>

            <h2 className="text-2xl font-semibold mt-6">Músicas</h2>
            {songs.length > 0 ? (
                <div className="grid gap-4">
                    {songs.map((song) => (
                        <Card key={song.song_id}>
                            <CardHeader>
                                <CardTitle>{song.title}</CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            ) : (
                <p>Nenhuma música disponível.</p>
            )}
        </div>
    )
}
