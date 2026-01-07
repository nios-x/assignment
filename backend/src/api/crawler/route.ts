import { Router } from "express"
import axios from "axios"
import * as cheerio from "cheerio"
import { prisma } from "../../utils/db"

const router = Router()

router.post("/", async (req, res) => {
  try {
    const { url } = req.body
    if (!url) {
      return res.status(400).json({ message: "URL required" })
    }
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
        "Accept-Language": "en-US,en;q=0.9",
      },
    })
    const html = response.data
    const $ = cheerio.load(html)
    const title = $("h1.lis-container__header__hero__company-info__title").text().trim()
    const location = $(".box--region").first().text().trim() || "Remote"
    const isRemote = location.toLowerCase().includes("anywhere")
    const jobTypeText = $(".box--jobType").text().toLowerCase()
    const jobType =
      jobTypeText.includes("contract") ? "CONTRACT" : "FULL_TIME"
    const description = $(".lis-container__job__sidebar__job-about")
      .text()
      .replace(/\s+/g, " ")
      .trim()
    const source = "WEWORKREMOTELY"
    const sourceJobId = url.split("/").pop()! 
    const companyName = sourceJobId.split("-")[0].toUpperCase()
    const job = await prisma.job.upsert({
      where: {
        source_sourceJobId: {
          source,
          sourceJobId,
        },
      },
      update: {},
      create: {
        title,
        companyName,
        description,
        location,
        isRemote,
        source,
        sourceJobId,
        jobUrl: url,
      },
    })
    res.status(200).json({
      message: "Job crawled & stored",
      job,
    })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: "Failed to crawl job" })
  }
})

export default router
