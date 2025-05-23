import express from "express"
import { supabase } from "../server"
import type { Track, ApiResponse } from "../types"

const router = express.Router()

/**
 * @swagger
 * /tracks:
 *   get:
 *     summary: Lista todas as faixas
 *     tags: [Tracks]
 *     responses:
 *       200:
 *         description: Lista de faixas
 */
/**
 * @swagger
 * /tracks/{id}:
 *   get:
 *     summary: Buscar faixa por ID
 *     tags: [Tracks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da faixa
 *     responses:
 *       200:
 *         description: Faixa encontrada
 *       404:
 *         description: Faixa não encontrada
 */
/**
 * @swagger
 * /tracks:
 *   post:
 *     summary: Criar nova faixa 
 *     tags: [Tracks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - artist
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Let It Be"
 *               artist:
 *                 type: string
 *                 example: "The Beatles"
 *               duration:
 *                 type: integer
 *                 example: 243
 *               album_cover:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/album_cover.jpg"
 *     responses:
 *       201:
 *         description: Faixa criada com sucesso
 *       400:
 *         description: Título, artista e duração são obrigatórios
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
/**
 * @swagger
 * /tracks/{id}:
 *   delete:
 *     summary: Deletar faixa por ID 
 *     tags: [Tracks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da faixa
 *     responses:
 *       200:
 *         description: Faixa deletada com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Faixa não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

// GET /api/tracks - Listar todas as faixas
router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query

    let query = supabase
      .from("tracks")
      .select("*")
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    if (search) {
      query = query.or(`title.ilike.%${search}%,artist.ilike.%${search}%`)
    }

    const { data: tracks, error } = await query

    if (error) {
      throw error
    }

    const response: ApiResponse<Track[]> = {
      success: true,
      data: tracks || [],
    }

    res.json(response)
  } catch (error: any) {
    console.error("Erro ao buscar faixas:", error)
    res.status(500).json({
      success: false,
      error: "Erro ao buscar faixas",
      message: error.message,
    })
  }
})

// GET /api/tracks/:id - Buscar faixa por ID
router.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params

    const { data: track, error } = await supabase.from("tracks").select("*").eq("id", id).single()

    if (error) {
      throw error
    }

    if (!track) {
      return res.status(404).json({
        success: false,
        error: "Faixa não encontrada",
      })
    }

    const response: ApiResponse<Track> = {
      success: true,
      data: track,
    }

    return res.json(response)
  } catch (error: any) {
    console.error("Erro ao buscar faixa:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao buscar faixa",
      message: error.message,
    })
  }
})

// POST /api/tracks - Criar nova faixa (sem autenticação)
router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const { title, artist, duration, album_cover } = req.body

    if (!title || !artist || !duration) {
      return res.status(400).json({
        success: false,
        error: "Título, artista e duração são obrigatórios",
      })
    }

    const { data: track, error } = await supabase
      .from("tracks")
      .insert([
        {
          title,
          artist,
          duration: Number(duration),
          album_cover,
        },
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    const response: ApiResponse<Track> = {
      success: true,
      data: track,
      message: "Faixa criada com sucesso",
    }

    return res.status(201).json(response)
  } catch (error: any) {
    console.error("Erro ao criar faixa:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao criar faixa",
      message: error.message,
    })
  }
})

// DELETE /api/tracks/:id - Deletar faixa por ID (sem autenticação)
router.delete("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from("tracks")
      .delete()
      .eq("id", id)

    if (error) {
      throw error
    }

    return res.json({
      success: true,
      message: "Faixa deletada com sucesso",
    })
  } catch (error: any) {
    console.error("Erro ao deletar faixa:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao deletar faixa",
      message: error.message,
    })
  }
})

export default router