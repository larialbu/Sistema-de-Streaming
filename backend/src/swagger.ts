import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { Express } from "express"

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Music Streaming API",
      version: "1.0.0",
      description: "API para gerenciamento de músicas e playlists",
    },
    servers: [
      {
        url: "http://localhost:8080/api",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Onde suas rotas estão
}

const specs = swaggerJsdoc(options)

export function setupSwagger(app: Express) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs))
}
