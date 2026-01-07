"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Link } from "react-router-dom"

export default function JobForm() {
  const [loading, setLoading ] = useState(false)
  const [form, setForm] = useState({
    title: "",
    companyName: "",
    description: "",
    experienceMin: "",
    experienceMax: "",
    location: "",
    isRemote: false,
    source: "",
    sourceJobId: "",
    jobUrl: "",
    skills: "",
    industries: "",
  })

  const update = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {

    setLoading(true)
    e.preventDefault()

    const skillsArray = form.skills
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)

    const industriesArray = form.industries
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)

    await fetch(`${import.meta.env.VITE_BACKEND}/api/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        skills: skillsArray,
        industries: industriesArray,
        experienceMin: form.experienceMin
          ? Number(form.experienceMin)
          : null,
        experienceMax: form.experienceMax
          ? Number(form.experienceMax)
          : null,
      }),
    })
    setLoading(false)
    toast("Job created successfully")
    setTimeout(()=>{
      window.location.href="/"
    }, 2000)
  }

  return (
    <div className="w-full raleway-500 flex justify-center items-center">
      <Toaster />
      <form onSubmit={onSubmit} className="space-y-6 py-3 lg:w-[60vw]">
        <h2 className="text-2xl font-semibold py-5 from-pink-500 via-red-500 to-yellow-500 bg-linear-to-r pl-6 rounded-md text-white">
          Job Posting
        </h2>

        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <Label>Job Title</Label>
            <Input value={form.title} onChange={e => update("title", e.target.value)} />
          </div>
          <div>
            <Label>Company Name</Label>
            <Input value={form.companyName} onChange={e => update("companyName", e.target.value)} />
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <Textarea value={form.description} onChange={e => update("description", e.target.value)} />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Input
            type="number"
            placeholder="Min Experience"
            value={form.experienceMin}
            onChange={e => update("experienceMin", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max Experience"
            value={form.experienceMax}
            onChange={e => update("experienceMax", e.target.value)}
          />
        </div>

        <Input
          placeholder="Location"
          value={form.location}
          onChange={e => update("location", e.target.value)}
        />

        <div className="flex items-center gap-3">
          <Switch checked={form.isRemote} onCheckedChange={v => update("isRemote", v)} />
          <Label>Remote Job</Label>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Input
            placeholder="Source"
            value={form.source}
            onChange={e => update("source", e.target.value)}
          />
          <Input
            placeholder="Source Job ID"
            value={form.sourceJobId}
            onChange={e => update("sourceJobId", e.target.value)}
          />
        </div>

        <Input
          placeholder="Job URL"
          value={form.jobUrl}
          onChange={e => update("jobUrl", e.target.value)}
        />

        {/* NEW */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <Label>Skills (comma separated)</Label>
            <Input
              placeholder="React, Node, PostgreSQL"
              value={form.skills}
              onChange={e => update("skills", e.target.value)}
            />
          </div>

          <div>
            <Label>Industries (comma separated)</Label>
            <Input
              placeholder="IT, FinTech, SaaS"
              value={form.industries}
              onChange={e => update("industries", e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-linear-to-r from-pink-500 via-red-500 to-yellow-500">
          Create Job
        </Button>

        <Link to="/" className="text-center w-full">
          <span className="w-full">
            Go Back
          </span> 
        </Link>
      </form>
    </div>
  )
}
