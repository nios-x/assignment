
import { Toaster } from "@/components/ui/sonner"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"

export default function CandidateForm() {
  const [loading,setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    resumeUrl: "",
    portfolioUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    experience: 0,
    expectedSalary: "",
    noticePeriodDays: "",
    addressLine: "",
    district: "",
    state: "",
    country: "",
    jobtype: "FULL_TIME",
    activelyLooking: true,
    skills: "",
    industries: "",
    roles: "",
  })

  const update = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const skillsArray = form.skills
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
    const industriesArray = form.industries
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
    const rolesArray = form.roles
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)

    await fetch(`${import.meta.env.VITE_BACKEND}/api/candidates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        skills: skillsArray,
        industries: industriesArray,
        roles: rolesArray,
        experience: Number(form.experience),
        expectedSalary: Number(form.expectedSalary),
        noticePeriodDays: Number(form.noticePeriodDays),
      }),
    })

    toast("Candidate created")
    setTimeout(()=>{
      window.location.href = "/"
    },200)
  }

  return (
    <div className="w-screen raleway-500 justify-center items-center flex">
      <form onSubmit={onSubmit} className="space-y-6 py-3 lg:w-[60vw]">
        <Toaster />
        <h2 className="text-2xl font-semibold py-5 from-pink-500 via-red-500 to-yellow-500 bg-linear-to-r pl-6 rounded-md text-white">
          Candidate Profile
        </h2>

        <div className="grid grid-cols lg:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input required
              placeholder="John Doe"
              value={form.name}
              onChange={e => update("name", e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input required
              placeholder="you@email.com"
              value={form.email}
              onChange={e => update("email", e.target.value)}
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input required
              placeholder="XXXXXXXXXX"
              value={form.phone}
              onChange={e => update("phone", e.target.value)}
            />
          </div>
          <div>
            <Label>Experience (years)</Label>
            <Input required
              min={0}
              type="number"
              value={form.experience}
              onChange={e => update("experience", e.target.value)}
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <Label>Resume URL</Label>
            <Input required
              value={form.resumeUrl}
              onChange={e => update("resumeUrl", e.target.value)}
            />
          </div>
          <div>
            <Label>Portfolio URL</Label>
            <Input required
              value={form.portfolioUrl}
              onChange={e => update("portfolioUrl", e.target.value)}
            />
          </div>
          <div>
            <Label>GitHub</Label>
            <Input required
              value={form.githubUrl}
              onChange={e => update("githubUrl", e.target.value)}
            />
          </div>
          <div>
            <Label>LinkedIn</Label>
            <Input required
              value={form.linkedinUrl}
              onChange={e => update("linkedinUrl", e.target.value)}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <Label>Address Line</Label>
            <Input required
              value={form.addressLine}
              onChange={e => update("addressLine", e.target.value)}
            />
          </div>
          <div>
            <Label>District</Label>
            <Input required
              value={form.district}
              onChange={e => update("district", e.target.value)}
            />
          </div>
          <div>
            <Label>State</Label>
            <Input required
              value={form.state}
              onChange={e => update("state", e.target.value)}
            />
          </div>
          <div>
            <Label>Country</Label>
            <Input required
              value={form.country}
              onChange={e => update("country", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Expected Salary</Label>
            <Input required
              type="number"
              value={form.expectedSalary}
              onChange={e => update("expectedSalary", e.target.value)}
            />
          </div>
          <div>
            <Label>Notice Period (days)</Label>
            <Input required
              type="number"
              value={form.noticePeriodDays}
              onChange={e => update("noticePeriodDays", e.target.value)}
            />
          </div>
          <div>
            <Label>Job Type</Label>
            <Select
              value={form.jobtype}
              onValueChange={v => update("jobtype", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FULL_TIME">Full Time</SelectItem>
                <SelectItem value="PART_TIME">Part Time</SelectItem>
                <SelectItem value="INTERNSHIP">Internship</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div>
            <Label>Skills (comma separated)</Label>
            <Input 
              placeholder="JavaScript, React, Node"
              value={form.skills}
              onChange={e => update("skills", e.target.value)}
            />
          </div>
          <div>
            <Label>Industries (comma separated)</Label>
            <Input 
              placeholder="IT, Finance, Health"
              value={form.industries}
              onChange={e => update("industries", e.target.value)}
            />
          </div>
          <div>
            <Label>Roles (comma separated)</Label>
            <Input 
              placeholder="Frontend Developer, Full Stack Developer"
              value={form.roles}
              onChange={e => update("roles", e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            checked={form.activelyLooking}
            onCheckedChange={v => update("activelyLooking", v)}
          />
          <Label>Actively Looking</Label>
        </div>

        <Button
          type="submit"
          className="w-full from-pink-500 via-red-500 to-yellow-500 bg-linear-to-r cursor-pointer"
          disabled={loading}
        >
          Create Candidate
        </Button>
        <Link to="/" className="w-full text-center cursor-pointer">
          Go Back
        </Link>
      </form>
    </div>
  )
}
