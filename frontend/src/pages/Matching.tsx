"use client"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/sonner"

type Candidate = {
  id: string
  name: string
  email: string
}

type Job = {
  id: string
  title: string
  companyName: string
  location: string
  source: string
}

export default function AdminCandidateJobs() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND}/api/candidates`)
      .then(res => res.json())
      .then(setCandidates)
  }, [])

  const fetchJobsForCandidate = async (candidateId: string) => {
    setLoading(true)
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND}/api/candidates/${candidateId}/recommended`
    )
    const data = await res.json()
    setJobs(data.matchedJobs || [])
    setLoading(false)
  }

  return (
    <div className="w-screen flex justify-center raleway-500">
      <Toaster />

      <div className="lg:w-[80vw] w-full space-y-6 py-6 px-4">
        
        <h2 className="text-2xl font-semibold py-4 pl-6 rounded-md text-white
          from-pink-500 via-red-500 to-yellow-500 bg-linear-to-r">
          Admin – Candidate Job Matches
        </h2>

        
        <div className="rounded-md border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {candidates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                    No candidates found
                  </TableCell>
                </TableRow>
              )}

              {candidates.map(candidate => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">
                    {candidate.name}
                  </TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="from-pink-500 via-red-500 to-yellow-500 bg-linear-to-r"
                          onClick={() => {
                            setSelectedCandidate(candidate)
                            fetchJobsForCandidate(candidate.id)
                          }}
                        >
                          View Jobs
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-6xl w-[95vw]">
                            <DialogHeader>
                              <DialogTitle>
                                Jobs for {selectedCandidate?.name}
                              </DialogTitle>
                              <DialogDescription>
                                Recommended jobs based on candidate profile.
                              </DialogDescription>
                            </DialogHeader>
                            {loading && <Loader />}

                            
                            {!loading && jobs.length === 0 && (
                              <div className="text-center py-10 text-muted-foreground">
                                No jobs matched for this candidate.
                              </div>
                            )}

                            
                            {!loading && jobs.length > 0 && (
                              <div className="border rounded-md overflow-auto max-h-[60vh]">
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
                                    {jobs.map(job => (
                                      <TableRow key={job.id}>
                                        <TableCell className="font-medium">
                                          {job.title}
                                        </TableCell>
                                        <TableCell>{job.companyName}</TableCell>
                                        <TableCell>{job.location}</TableCell>
                                        <TableCell>{job.source}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}

                            <DialogFooter>
                              <Button variant="outline">Close</Button>
                            </DialogFooter>
                          </DialogContent>

                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

const Loader = () => (
  <div className="flex justify-center items-center py-12">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
  </div>
)