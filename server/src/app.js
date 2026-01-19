import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import testRoutes from "./routes/test.routes.js"
import postRoutes from "./routes/post.routes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/health", (_, res) => {
  res.json({ status: "ok" })
})

app.use("/api/auth", authRoutes)
app.use("/api/test", testRoutes)
app.use("/api/posts", postRoutes)

export default app