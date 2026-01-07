"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Link } from "react-router-dom"

export default function UrlSubmit() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [showImage, setShowImage] = useState(false)
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (url === "https://weworkremotely.com/remote-jobs") {
      alert("Find Job Post URL instead of Homepage URL")
      setLoading(false)
      return
    }
    const res = await fetch(`${import.meta.env.VITE_BACKEND}/api/submit-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
    const result = await res.json()
    setData(result.job)
    toast("URL submitted successfully")
    setLoading(false)
  }
  return (
    <div className="w-full min-h-screen  flex items-center justify-center raleway-500 mb-10">
      <Toaster />
      <form onSubmit={onSubmit} className="space-y-6 w-[90vw]  max-w-[60vw]">
        <h2 className="text-2xl  font-semibold py-4 bg-linear-to-r from-pink-500 via-red-500 to-yellow-500 rounded-md text-white text-center">
          Submit URL
        </h2>
        <div>
          <Label>URL</Label>
          <Input
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-linear-to-r from-pink-500 via-red-500 to-yellow-500"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Crawl and Add Job to DB"}
        </Button>

        <Link to="/" className="block text-center text-sm underline">
          Go Back
        </Link>

        <div className="text-center text-sm py-2">
          Find Jobs at:{" "}
          <Link
            to="https://weworkremotely.com/remote-jobs"
            className="underline"
          >
            weworkremotely.com
          </Link>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowImage((prev) => !prev)}
        >
          {showImage ? "Hide Image" : "Show Image"}
        </Button>
        {showImage && (
          <img
            src="scr.png"
            alt="Preview"
            className="w-full max-h-60 object-contain rounded-lg border"
          />
        )}
        {data && (
          <div className="overflow-x-auto mt-6">
            <table className="w-full border border-gray-300 rounded-md text-sm">
              <tbody>
                <TableRow label="Title" value={data.title} />
                <TableRow label="Company" value={data.companyName} />
                <TableRow label="Location" value={data.location} />
                <TableRow label="Remote" value={data.isRemote ? "Yes" : "No"} />
                <TableRow label="Source" value={data.source} />
                <TableRow label="Job URL" value={data.jobUrl} link />
                <TableRow label="Description" value={data.description} />
              </tbody>
            </table>
          </div>
        )}
      </form>
    </div>
  )
}
function TableRow({
  label,
  value,
  link = false,
}: {
  label: string
  value: string
  link?: boolean
}) {
  return (
    <tr className="border-b last:border-none">
      <td className="font-medium p-3 w-40 bg-gray-50">{label}</td>
      <td className="p-3">
        {link ? (
          <a href={value} target="_blank" className="text-blue-600 underline">
            {value}
          </a>
        ) : (
          value
        )}
      </td>
    </tr>
  )
}
