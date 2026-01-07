import { Router } from "express"
import { prisma } from "../../utils/db"

const router = Router()

// 1. Create a Candidate 
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      resumeUrl,
      portfolioUrl,
      githubUrl,
      linkedinUrl,
      experience,
      expectedSalary,
      noticePeriodDays,
      activelyLooking,
      addressLine,
      district,
      state,
      country,
      jobtype,
      skills = [],
      industries = [],
      roles = [],
    } = req.body

    if (!name || !email || !addressLine || !district || !state || !country) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const candidate = await prisma.candidate.create({
      data: {
        name,
        email,
        phone,
        resumeUrl,
        portfolioUrl,
        githubUrl,
        linkedinUrl,
        experience,
        expectedSalary,
        noticePeriodDays,
        activelyLooking,
        addressLine,
        district,
        state,
        country,
        jobtype,
      },
    })

    const formatName = (s: string) =>
      s.trim().replace(/\s+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

    for (const skillName of skills) {
      const skill = await prisma.skill.upsert({
        where: { name: formatName(skillName) },
        update: {},
        create: { name: formatName(skillName) },
      })
      await prisma.candidateSkill.create({
        data: { candidateId: candidate.id, skillId: skill.id },
      })
    }

    for (const industryName of industries) {
      const industry = await prisma.industry.upsert({
        where: { name: formatName(industryName) },
        update: {},
        create: { name: formatName(industryName) },
      })
      await prisma.candidateIndustry.create({
        data: { candidateId: candidate.id, industryId: industry.id },
      })
    }

    for (const roleName of roles) {
      const role = await prisma.role.upsert({
        where: { name: formatName(roleName) },
        update: {},
        create: { name: formatName(roleName) },
      })
      await prisma.candidateRole.create({
        data: { candidateid: candidate.id, roleid: role.id },
      })
    }

    res.status(200).json(candidate)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
})




// Other APIs----------------------------------------------------------------------------------------------------------------------------------------------------------------------

router.get("/:id/jobs", async (req, res) => {
  try {
    const candidateId = req.params.id

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        skills: { include: { skill: true } },
        roles: { include: { roles: true } },
        industries: { include: { industry: true } },
      },
    })

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" })
    }

    const skillIds = candidate.skills.map((cs) => cs.skillId)
    const roleIds = candidate.roles.map((cr) => cr.roleid)
    const industryIds = candidate.industries.map((ci) => ci.industryId)

    const jobs = await prisma.job.findMany({
      where: {
        OR: [
          { skills: { some: { skillId: { in: skillIds } } } },
          { industries: { some: { industryId: { in: industryIds } } } },
        ],
      },
      include: {
        skills: true,
        industries: true,
      },
      orderBy: { createdAt: "desc" },
    })

    res.status(200).json({ candidate, jobs })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch matched jobs" })
  }
})

router.get("/:id/recommended", async (req, res) => {
  try {
    const candidateId = req.params.id

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        skills: { include: { skill: true } },
        roles: { include: { roles: true } },
        industries: { include: { industry: true } },
      },
    })

    if (!candidate) return res.status(404).json({ message: "Candidate not found" })

    const keywords = [
      ...candidate.skills.map((s) => s.skill.name.toLowerCase()),
      ...candidate.roles.map((r) => r.roles.name.toLowerCase()),
      ...candidate.industries.map((i) => i.industry.name.toLowerCase()),
    ]

    const allJobs = await prisma.job.findMany({
      include: { skills: { include: { skill: true } }, industries: { include: { industry: true } } },
    })

    const matchedJobs = allJobs.filter((job) => {
      const jobKeywords = [
        job.title.toLowerCase(),
        job.companyName.toLowerCase(),
        ...job.skills.map((js) => js.skill.name.toLowerCase()),
        ...job.industries.map((ji) => ji.industry.name.toLowerCase()),
      ]
      return keywords.some((kw) => jobKeywords.some((jk) => jk.includes(kw)))
    })

    res.status(200).json({ candidate, matchedJobs })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch recommended jobs" })
  }
})


router.get("/", async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        skills: { include: { skill: true } },
        roles: { include: { roles: true } },
        industries: { include: { industry: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.status(200).json(candidates)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch candidates" })
  }
})


export default router
