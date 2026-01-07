  import { useEffect, useState } from "react"
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Button } from "@/components/ui/button"
  import { Switch } from "@/components/ui/switch"
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

  export default function AdminDashboard() {
    const [mode, setMode] = useState<"jobs" | "candidates">("jobs")
    const [jobs, setJobs] = useState<any[]>([])
    const [candidates, setCandidates] = useState<any[]>([])

    useEffect(() => {
      if (mode === "jobs") {
        fetch(`${import.meta.env.VITE_BACKEND}/api/jobs`)
          .then((r) => r.json())
          .then(setJobs)
      } else {
        fetch(`${import.meta.env.VITE_BACKEND}/api/candidates`)
          .then((r) => r.json())
          .then(setCandidates)
      }
    }, [mode])

    return (
      <div className="w-screen flex justify-center p-6">
        <div className="lg:w-[80vw] space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold bg-linear-to-r w-full mr-8 from-pink-500 via-red-500 to-yellow-500 text-white px-4 py-2 rounded-md">
              Admin  
            </h1>

            <div className="flex items-center gap-3">
              <span>Jobs</span>
              <Switch
                checked={mode === "candidates"}
                onCheckedChange={(v) =>
                  setMode(v ? "candidates" : "jobs")
                }
              />
              <span>Candidates</span>
            </div>
          </div>

          {mode === "jobs" ? <JobsTable jobs={jobs} /> : <CandidatesTable candidates={candidates} />}
        </div>
      </div>
    )
  }
  function JobsTable({ jobs }: { jobs: any[] }) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Source</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.companyName}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>{job.source}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  function CandidatesTable({ candidates }: { candidates: any[] }) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Job Type</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {candidates.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.experience} yrs</TableCell>
              <TableCell>{c.jobtype}</TableCell>
              <TableCell className="text-right">
                <CandidateDialog candidate={c} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
function CandidateDialog({ candidate }: { candidate: any }) {
  const [tab, setTab] = useState<"details" | "matched" | "recommended">("details")
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchJobs = async (type: "matched" | "recommended") => {
    setLoading(true)
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND}/api/candidates/${candidate.id}/${type === "matched" ? "jobs" : "recommended"}`
    )
    const data = await res.json()
    setJobs(type === "matched" ? data.jobs : data.matchedJobs)
    setLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{candidate.name}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-3 mb-4">
          <Button
            size="sm"
            variant={tab === "details" ? "default" : "outline"}
            onClick={() => setTab("details")}
          >
            Details
          </Button>
          <Button
            size="sm"
            variant={tab === "matched" ? "default" : "outline"}
            onClick={() => {
              setTab("matched")
              fetchJobs("matched")
            }}
          >
            Matched Jobs
          </Button>
          <Button
            size="sm"
            variant={tab === "recommended" ? "default" : "outline"}
            onClick={() => {
              setTab("recommended")
              fetchJobs("recommended")
            }}>
            Recommended Jobs
          </Button>
        </div>
        {tab === "details" && <CandidateDetails candidate={candidate} />}
        {(tab === "matched" || tab === "recommended") && (
          <JobsTableMini jobs={jobs} loading={loading} />
        )}
      </DialogContent>
    </Dialog>
  )
}


function CandidateDetails({ candidate }: { candidate: any }) {
  return (
    <div className="space-y-2 text-sm">
      <p><b>Email:</b> {candidate.email}</p>
      <p><b>Phone:</b> {candidate.phone || "—"}</p>
      <p><b>Experience:</b> {candidate.experience} yrs</p>
      <p><b>Expected Salary:</b> {candidate.expectedSalary || "—"}</p>
      <p><b>Location:</b> {candidate.district}, {candidate.state}</p>
      <p><b>Actively Looking:</b> {candidate.activelyLooking ? "Yes" : "No"}</p>

      <p><b>Skills:</b> {candidate.skills.map((s: any) => s.skill.name).join(", ")}</p>
      <p><b>Industries:</b> {candidate.industries.map((i: any) => i.industry.name).join(", ")}</p>
      <p><b>Roles:</b> {candidate.roles.map((r: any) => r.roles.name).join(", ")}</p>
    </div>
  )
}

function JobsTableMini({ jobs, loading }: { jobs: any[]; loading: boolean }) {
  if (loading) return <p className="text-sm">Loading jobs...</p>

  if (!jobs.length) {
    return <p className="text-sm text-muted-foreground">No jobs found</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Source</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell>{job.title}</TableCell>
            <TableCell>{job.companyName}</TableCell>
            <TableCell>{job.location}</TableCell>
            <TableCell>{job.source}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
