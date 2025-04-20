"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAuth } from "@/contexts/auth-context"
import { Eye, CheckCircle, Clock, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

type ContactSubmission = {
  id: string
  user_id: string | null
  name: string
  email: string
  subject: string
  category: string
  message: string
  status: "new" | "in_progress" | "resolved" | "closed"
  admin_notes: string | null
  created_at: string
}

export default function ContactSubmissionsPage() {
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [status, setStatus] = useState<string>("")
  const [updating, setUpdating] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const { data, error } = await supabase
          .from("contact_submissions")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error

        setSubmissions(data || [])
      } catch (error) {
        console.error("Error fetching submissions:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.role === "admin") {
      fetchSubmissions()
    }
  }, [user, supabase])

  const handleViewSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission)
    setAdminNotes(submission.admin_notes || "")
    setStatus(submission.status)
    setViewDialogOpen(true)
  }

  const handleUpdateSubmission = async () => {
    if (!selectedSubmission) return

    setUpdating(true)
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({
          status,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedSubmission.id)

      if (error) throw error

      // Update local state
      setSubmissions(
        submissions.map((sub) =>
          sub.id === selectedSubmission.id ? { ...sub, status, admin_notes: adminNotes } : sub,
        ),
      )

      setViewDialogOpen(false)
    } catch (error) {
      console.error("Error updating submission:", error)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            New
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            In Progress
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Resolved
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Closed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "general":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            General
          </Badge>
        )
      case "technical":
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            Technical
          </Badge>
        )
      case "payment":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Payment
          </Badge>
        )
      case "credits":
        return (
          <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
            Credits
          </Badge>
        )
      case "counseling":
        return (
          <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
            Counseling
          </Badge>
        )
      case "feedback":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Feedback
          </Badge>
        )
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  if (user?.role !== "admin") {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Contact Submissions</h1>
        <p className="text-muted-foreground">Loading submissions...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Submissions</h1>

      {submissions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-muted-foreground">No contact submissions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm">{new Date(submission.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">{submission.name}</td>
                  <td className="px-4 py-3 text-sm">{submission.subject}</td>
                  <td className="px-4 py-3 text-sm">{getCategoryBadge(submission.category)}</td>
                  <td className="px-4 py-3 text-sm">{getStatusBadge(submission.status)}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewSubmission(submission)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedSubmission && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedSubmission.subject}</DialogTitle>
              <DialogDescription>
                Submitted by {selectedSubmission.name} ({selectedSubmission.email}) on{" "}
                {new Date(selectedSubmission.created_at).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryBadge(selectedSubmission.category)}
                  {getStatusBadge(selectedSubmission.status)}
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">Message:</h4>
                <p className="text-sm whitespace-pre-wrap">{selectedSubmission.message}</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status:
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
                        New
                      </div>
                    </SelectItem>
                    <SelectItem value="in_progress">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-amber-600" />
                        In Progress
                      </div>
                    </SelectItem>
                    <SelectItem value="resolved">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Resolved
                      </div>
                    </SelectItem>
                    <SelectItem value="closed">
                      <div className="flex items-center">
                        <X className="h-4 w-4 mr-2 text-gray-600" />
                        Closed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="admin-notes" className="text-sm font-medium">
                  Admin Notes:
                </label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this submission"
                  className="min-h-32"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateSubmission} disabled={updating}>
                {updating ? "Updating..." : "Update"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
