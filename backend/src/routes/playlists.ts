import express from "express"
import { supabase } from "../server"
import type { Playlist, ApiResponse } from "../types"
import { authenticateToken, type AuthenticatedRequest } from "../middleware/auth"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Playlists
 *   description: Gerenciamento de playlists
 */
/**
 * @swagger
 * /playlists:
 *   get:
 *     summary: Listar playlists do usuário autenticado
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de playlists retornada com sucesso
 *       401:
 *         description: Não autorizado
 */
/**
 * @swagger
 * /playlists:
 *   post:
 *     summary: Criar nova playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Minha Playlist Favorita
 *     responses:
 *       201:
 *         description: Playlist criada com sucesso
 *       400:
 *         description: Nome da playlist é obrigatório
 */
/**
 * @swagger
 * /playlists/{id}/tracks:
 *   post:
 *     summary: Adicionar faixa à playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da playlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               track_id:
 *                 type: string
 *                 example: abc123
 *     responses:
 *       201:
 *         description: Faixa adicionada com sucesso
 *       400:
 *         description: ID da faixa é obrigatório
 *       404:
 *         description: Playlist ou faixa não encontrada
 *       409:
 *         description: Faixa já está na playlist
 */
/**
 * @swagger
 * /playlists/{id}/tracks/{trackId}:
 *   delete:
 *     summary: Remover faixa da playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da playlist
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da faixa
 *     responses:
 *       200:
 *         description: Faixa removida com sucesso
 *       404:
 *         description: Playlist não encontrada
 */
/**
 * @swagger
 * /playlists/{id}:
 *   delete:
 *     summary: Deletar uma playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da playlist
 *     responses:
 *       200:
 *         description: Playlist deletada com sucesso
 *       404:
 *         description: Playlist não encontrada
 */


// GET /api/playlists - Listar todas playlists
router.get("/", async (req, res) => {
  try {
    const { data: playlists, error } = await supabase
      .from("playlists")
      .select(`
        *,
        playlist_tracks (
          track_id,
          added_at,
          tracks (*)
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    const response: ApiResponse<Playlist[]> = {
      success: true,
      data: playlists || [],
    }

    return res.json(response)
  } catch (error: any) {
    console.error("Erro ao buscar playlists:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao buscar playlists",
      message: error.message,
    })
  }
})

// POST /api/playlists - Criar nova playlist
router.post("/", async (req, res) => {
  try {
    const { name } = req.body

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Nome da playlist é obrigatório",
      })
    }

    const { data: playlist, error } = await supabase
      .from("playlists")
      .insert([{ name: name.trim() }])
      .select()
      .single()

    if (error) throw error

    const response: ApiResponse<Playlist> = {
      success: true,
      data: playlist,
      message: "Playlist criada com sucesso",
    }

    return res.status(201).json(response)
  } catch (error: any) {
    console.error("Erro ao criar playlist:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao criar playlist",
      message: error.message,
    })
  }
})

// POST /api/playlists/:id/tracks - Adicionar faixa
router.post("/:id/tracks", async (req, res) => {
  try {
    const { id: playlistId } = req.params
    const { track_id } = req.body

    if (!track_id) {
      return res.status(400).json({ success: false, error: "ID da faixa é obrigatório" })
    }

    const { data: track, error: trackError } = await supabase
      .from("tracks")
      .select("id")
      .eq("id", track_id)
      .single()

    if (trackError || !track) {
      return res.status(404).json({ success: false, error: "Faixa não encontrada" })
    }

    const { data: playlistTrack, error } = await supabase
      .from("playlist_tracks")
      .insert([{ playlist_id: playlistId, track_id }])
      .select()
      .single()

    if (error?.code === "23505") {
      return res.status(409).json({ success: false, error: "Faixa já está na playlist" })
    }

    if (error) throw error

    return res.status(201).json({
      success: true,
      data: playlistTrack,
      message: "Faixa adicionada à playlist com sucesso",
    })
  } catch (error: any) {
    console.error("Erro ao adicionar faixa:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao adicionar faixa",
      message: error.message,
    })
  }
})

// DELETE /api/playlists/:id/tracks/:trackId - Remover faixa
router.delete("/:id/tracks/:trackId", async (req, res) => {
  try {
    const { id: playlistId, trackId } = req.params

    const { error } = await supabase
      .from("playlist_tracks")
      .delete()
      .eq("playlist_id", playlistId)
      .eq("track_id", trackId)

    if (error) throw error

    return res.json({ success: true, message: "Faixa removida com sucesso" })
  } catch (error: any) {
    console.error("Erro ao remover faixa:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao remover faixa",
      message: error.message,
    })
  }
})

// DELETE /api/playlists/:id - Deletar playlist
router.delete("/:id", async (req, res) => {
  try {
    const { id: playlistId } = req.params

    const { error } = await supabase
      .from("playlists")
      .delete()
      .eq("id", playlistId)

    if (error) throw error

    return res.json({ success: true, message: "Playlist deletada com sucesso" })
  } catch (error: any) {
    console.error("Erro ao deletar playlist:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao deletar playlist",
      message: error.message,
    })
  }
})

export default router
