"use client"

import { BrowserRouter, Routes, Route } from "react-router"
import { useEffect, useState } from "react"

import App from "./Home"
import CandidateForm from "./pages/Candidates"
import JobForm from "./pages/Jobtype"
import UrlSubmit from "./pages/Crawler"
import AdminJobsTable from "./pages/Admin"
import AdminCandidateJobs from "./pages/Matching"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AppRouter() {
  const [password, setPassword] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem("cnear-unlocked")
    if (saved === "true") setUnlocked(true)
  }, [])

  const unlock = () => {
    if (password === "cnear") {
      localStorage.setItem("cnear-unlocked", "true")
      setUnlocked(true)
    } else {
      alert("Wrong password")
    }
  }
  if (!unlocked) {
    return (
      <div className="w-screen h-screen flex items-center  from-pink-500 via-red-500 to-yellow-500 bg-linear-to-r justify-center bg-background">
        <div className="w-[90vw] bg-white max-w-md space-y-5 p-6 border rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-center">
            Enter Access Password
          </h2>

          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <Button
            onClick={unlock}
            className="w-full from-pink-500 via-red-500 to-yellow-500 bg-linear-to-r"
          >
            Unlock
          </Button>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/candidatesform" element={<CandidateForm />} />
        <Route path="/jobtype" element={<JobForm />} />
        <Route path="/crawler" element={<UrlSubmit />} />
        <Route path="/admin" element={<AdminJobsTable />} />
        <Route path="/match" element={<AdminCandidateJobs />} />
      </Routes>
    </BrowserRouter>
  )
}
