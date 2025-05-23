import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"
import { setupSwagger } from "./swagger"



// Importar rotas
import tracksRouter from "./routes/tracks"
import playlistsRouter from "./routes/playlists"

// Carregar variáveis de ambiente
dotenv.config()
console.log("SUPABASE_URL:", process.env.SUPABASE_URL)
console.log("SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY)

const app = express() 
setupSwagger(app)

const PORT = process.env.PORT || 3001

export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)


app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(morgan("combined"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/tracks", tracksRouter)
app.use("/api/playlists", playlistsRouter)

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Algo deu errado!",
    message: process.env.NODE_ENV === "development" ? err.message : "Erro interno do servidor",
  })
})

app.use("*", (req, res) => {
  res.status(404).json({ error: "Rota não encontrada" })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📱 Frontend: ${process.env.FRONTEND_URL || "http://localhost:3000/"}`)
  console.log(`🔗 API: http://localhost:${PORT}/`)
})

export default app
