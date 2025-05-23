import type { Request, Response, NextFunction } from "express"
import { supabase } from "../server"

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
  }
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "Token de acesso requerido" })
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(403).json({ error: "Token inválido" })
    }

    req.user = {
      id: user.id,
      email: user.email!,
    }

    return next()
  } catch (error) {
    console.error("Erro na autenticação:", error)
    return res.status(500).json({ error: "Erro interno do servidor" })
  }
}
