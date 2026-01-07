import express from "express"
import cors from "cors"
import path from "path"
import candidateRouter from "./api/candidate/route"
import jobroleRouter from "./api/jobrole/route"
import crawlerRouter from "./api/crawler/route"

const app = express()
const PORT = process.env.PORT || 3000
const PATH = path.join(__dirname.split("\\").filter(e=>e!="src").join("\\"), "dist/dist")
// Serve static frontend files
app.use(cors())
app.use(express.json())
app.use(express.static(PATH))
app.use("/api/candidates", candidateRouter)
app.use("/api/jobs", jobroleRouter)
app.use("/api/submit-url", crawlerRouter)

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(PATH, "index.html"))
})  

app.listen(PORT, () => {
  console.log(`Cnear Assignment: Server is running at port: ${PORT}`)
})
