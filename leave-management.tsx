"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Check, X, Clock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  leaveType: "paid" | "casual"
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "pending" | "approved" | "rejected"
  appliedAt: string
  reviewedAt?: string
  reviewedBy?: string
  comments?: string
}

export default function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      employeeId: "1",
      employeeName: "John Smith",
      leaveType: "casual",
      startDate: "2024-01-20",
      endDate: "2024-01-20",
      days: 1,
      reason: "Personal appointment",
      status: "pending",
      appliedAt: "2024-01-18T10:00:00Z",
    },
    {
      id: "2",
      employeeId: "2",
      employeeName: "Sarah Johnson",
      leaveType: "paid",
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      days: 5,
      reason: "Family vacation",
      status: "approved",
      appliedAt: "2024-01-15T14:30:00Z",
      reviewedAt: "2024-01-16T09:00:00Z",
      reviewedBy: "Admin",
      comments: "Approved - enjoy your vacation!",
    },
    {
      id: "3",
      employeeId: "1",
      employeeName: "John Smith",
      leaveType: "paid",
      startDate: "2024-01-25",
      endDate: "2024-01-27",
      days: 3,
      reason: "Medical treatment",
      status: "rejected",
      appliedAt: "2024-01-20T16:00:00Z",
      reviewedAt: "2024-01-21T10:00:00Z",
      reviewedBy: "Admin",
      comments: "Too many recent leave requests",
    },
  ])

  const [isAddingLeave, setIsAddingLeave] = useState(false)
  const [newLeave, setNewLeave] = useState({
    employeeName: "",
    leaveType: "casual" as const,
    startDate: "",
    endDate: "",
    reason: "",
  })

  // Track casual leaves used this month per employee
  const [casualLeavesUsed, setCasualLeavesUsed] = useState<{ [employeeId: string]: number }>({
    "1": 0, // John Smith has used 0 casual leaves this month
    "2": 1, // Sarah Johnson has used 1 casual leave this month
  })

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getLeaveTypeColor = (type: string) => {
    const colors = {
      paid: "bg-blue-100 text-blue-800",
      casual: "bg-lime-100 text-lime-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const addLeaveRequest = () => {
    const days = calculateDays(newLeave.startDate, newLeave.endDate)
    const leaveRequest: LeaveRequest = {
      id: Date.now().toString(),
      employeeId: Date.now().toString(),
      ...newLeave,
      days,
      status: "pending",
      appliedAt: new Date().toISOString(),
    }
    setLeaveRequests([...leaveRequests, leaveRequest])
    setNewLeave({
      employeeName: "",
      leaveType: "casual",
      startDate: "",
      endDate: "",
      reason: "",
    })
    setIsAddingLeave(false)
  }

  const updateLeaveStatus = (leaveId: string, newStatus: "approved" | "rejected", comments?: string) => {
    const updatedRequests = leaveRequests.map((request) =>
      request.id === leaveId
        ? {
            ...request,
            status: newStatus,
            reviewedAt: new Date().toISOString(),
            reviewedBy: "Admin",
            comments: comments || "",
          }
        : request,
    )
    setLeaveRequests(updatedRequests)
  }

  const pendingRequests = leaveRequests.filter((req) => req.status === "pending")
  const approvedRequests = leaveRequests.filter((req) => req.status === "approved")
  const rejectedRequests = leaveRequests.filter((req) => req.status === "rejected")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Leave Management</h2>
        <Dialog open={isAddingLeave} onOpenChange={setIsAddingLeave}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Leave Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add Leave Request</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeName">Employee Name *</Label>
                    <Input
                      id="employeeName"
                      value={newLeave.employeeName}
                      onChange={(e) => setNewLeave({ ...newLeave, employeeName: e.target.value })}
                      placeholder="Enter employee name"
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leaveType">Leave Type *</Label>
                    <Select
                      value={newLeave.leaveType}
                      onValueChange={(value) => setNewLeave({ ...newLeave, leaveType: value as any })}
                    >
                      <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual Leave (CL)</SelectItem>
                        <SelectItem value="paid">Paid Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newLeave.startDate}
                      onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newLeave.endDate}
                      onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Leave *</Label>
                  <Textarea
                    id="reason"
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                    placeholder="Please provide reason for leave request"
                    rows={3}
                    className="focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Leave Policy Information */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3">Leave Policy</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex items-center justify-between">
                      <span>• Casual Leave (CL):</span>
                      <span className="font-semibold">1 per month (Free)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>• Additional leaves:</span>
                      <span className="font-semibold">Counted as Paid Leave</span>
                    </div>
                    <div className="text-xs text-blue-600 mt-2 p-2 bg-blue-100 rounded">
                      If you exceed 1 casual leave per month, additional leaves will be automatically converted to paid
                      leave and deducted from your annual quota.
                    </div>
                  </div>
                </div>

                {newLeave.startDate && newLeave.endDate && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">Leave Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Total Days:</span>
                        <span className="font-bold">{calculateDays(newLeave.startDate, newLeave.endDate)} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Leave Type:</span>
                        <span className="font-bold capitalize">
                          {newLeave.leaveType === "casual" ? "Casual Leave (CL)" : "Paid Leave"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Salary Impact:</span>
                        <span className="font-bold text-green-600">
                          {newLeave.leaveType === "casual"
                            ? "No Deduction (if within limit)"
                            : "Deducted from annual quota"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsAddingLeave(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={addLeaveRequest} className="flex-1">
                    Submit Request
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Clock className="w-5 h-5" />
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 mb-2">{pendingRequests.length}</div>
            <p className="text-sm text-slate-600">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Check className="w-5 h-5" />
              Approved Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">{approvedRequests.length}</div>
            <p className="text-sm text-slate-600">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <X className="w-5 h-5" />
              Rejected Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-2">{rejectedRequests.length}</div>
            <p className="text-sm text-slate-600">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.employeeName}</TableCell>
                  <TableCell>
                    <Badge className={getLeaveTypeColor(request.leaveType)} variant="secondary">
                      {request.leaveType === "casual" ? "Casual (CL)" : "Paid"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(request.startDate).toLocaleDateString()} -{" "}
                    {new Date(request.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{request.days}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)} variant="secondary">
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                          onClick={() => updateLeaveStatus(request.id, "approved", "Leave approved")}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                          onClick={() => updateLeaveStatus(request.id, "rejected", "Leave rejected")}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    {request.status !== "pending" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Leave Request Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Employee</Label>
                                <p className="text-sm">{request.employeeName}</p>
                              </div>
                              <div>
                                <Label>Type</Label>
                                <Badge className={getLeaveTypeColor(request.leaveType)} variant="secondary">
                                  {request.leaveType === "casual" ? "Casual (CL)" : "Paid"}
                                </Badge>
                              </div>
                              <div>
                                <Label>Start Date</Label>
                                <p className="text-sm">{new Date(request.startDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <Label>End Date</Label>
                                <p className="text-sm">{new Date(request.endDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <Label>Days</Label>
                                <p className="text-sm">{request.days}</p>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <Badge className={getStatusColor(request.status)} variant="secondary">
                                  {request.status}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <Label>Reason</Label>
                              <p className="text-sm mt-1">{request.reason}</p>
                            </div>
                            {request.comments && (
                              <div>
                                <Label>Admin Comments</Label>
                                <p className="text-sm mt-1">{request.comments}</p>
                              </div>
                            )}
                            <div className="text-xs text-slate-500">
                              Applied: {new Date(request.appliedAt).toLocaleString()}
                              {request.reviewedAt && (
                                <span> | Reviewed: {new Date(request.reviewedAt).toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
