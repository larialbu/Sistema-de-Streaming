"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { fetchTaylorSwiftAlbums, Album } from "@/service/taylorSwift"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function TaylorSwiftPage() {
    const [albums, setAlbums] = useState<Album[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        async function loadAlbums() {
            try {
                const data = await fetchTaylorSwiftAlbums()
                setAlbums(data)
            } catch (error) {
                toast({
                    title: "Erro ao carregar álbuns",
                    description: (error as Error).message,
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }
        loadAlbums()
    }, [])

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Álbuns de Taylor Swift</h1>

            {loading ? (
                <p>Carregando álbuns...</p>
            ) : albums.length === 0 ? (
                <p>Nenhum álbum encontrado.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {albums.map((album) => (
                        <Link key={album.id} href={`/taylor-swift/${album.id}`} className="block">
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
                                <CardHeader>
                                    <CardTitle>{album.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {album.cover && (
                                        <img src={album.cover} alt={album.title} className="mb-4 w-full rounded" />
                                    )}
                                    <p>Data de lançamento: {album.releaseDate}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
