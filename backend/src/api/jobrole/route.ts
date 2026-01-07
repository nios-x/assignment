import { Router } from "express"
import { prisma } from "../../utils/db"

const router = Router()

const formatName = (s: string) =>s.trim().replace(/\s+/g, " ").replace(/\b\w/g, c => c.toUpperCase())


// 2.  Job Roles
router.post("/", async (req, res) => {
  try {
    const {
      title,
      companyName,
      description,
      experienceMin,
      experienceMax,
      location,
      isRemote,
      source,
      sourceJobId,
      jobUrl,
      skills = [],
      industries = [],
    } = req.body
    
    const job = await prisma.job.create({
      data: {
        title,
        companyName,
        description,
        experienceMin,
        experienceMax,
        location,
        isRemote,
        source,
        sourceJobId,
        jobUrl,
      },
    })
   
    for (const skillName of skills) {
      const skill = await prisma.skill.upsert({
        where: { name: formatName(skillName) },
        update: {},
        create: { name: formatName(skillName) },
      })

      await prisma.jobSkill.create({
        data: {
          jobId: job.id,
          skillId: skill.id,
        },
      })
    }

    for (const industryName of industries) {
      const industry = await prisma.industry.upsert({
        where: { name: formatName(industryName) },
        update: {},
        create: { name: formatName(industryName) },
      })

      await prisma.jobIndustry.create({
        data: {
          jobId: job.id,
          industryId: industry.id,
        },
      })
    }

    res.status(201).json(job)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
})

router.get("/", async (_req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
    })
    res.json(jobs)
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch jobs" })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    await prisma.job.delete({ where: { id } })
    res.json({ message: "Job deleted" })
  } catch (e) {
    res.status(500).json({ message: "Delete failed" })
  }
})

export default router
