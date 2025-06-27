"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Eye,
  DollarSign,
  Package,
  User,
  Wrench,
  Settings,
  Thermometer,
  Wind,
  Edit,
  Clock,
  Calendar,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Complaint {
  id: string
  customerId: string
  customerName: string
  employeeId: string
  employeeName: string
  title: string
  description: string
  status: "pending" | "assigned" | "in-progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  createdAt: string
  completedAt?: string
  paymentStatus: "pending" | "partial" | "paid"
  estimatedAmount: number
  actualPrice: number
  discount: number
  finalPrice: number
  estimatedTime: number
  paidAmount: number
  serviceType: "repair" | "installation" | "maintenance" | "emergency" | "consultation"
  acServiceDetails: {
    serviceCategory: string
    partsUsed: ACPart[]
    laborCost: number
    totalServiceCost: number
  }
  notes: string
}

interface ACPart {
  id: string
  name: string
  category: "compressor" | "condenser" | "evaporator" | "filter" | "thermostat" | "refrigerant" | "other"
  condition: "new" | "repaired" | "replaced"
  originalPrice: number
  salePrice: number
  quantity: number
  profit: number
  loss: number
}

// Add these mock data arrays at the top of the component
const customers = [
  { id: "1", name: "ABC Corporation" },
  { id: "2", name: "XYZ Ltd" },
  { id: "3", name: "Tech Solutions Inc" },
]

const employees = [
  { id: "1", fullName: "John Smith", position: "Field Technician" },
  { id: "2", fullName: "Sarah Johnson", position: "Senior Technician" },
  { id: "3", fullName: "Mike Wilson", position: "HVAC Specialist" },
]

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "1",
      customerId: "1",
      customerName: "ABC Corporation",
      employeeId: "1",
      employeeName: "John Smith",
      title: "AC Unit Not Cooling",
      description: "Central AC system not cooling properly, temperature not dropping below 75°F",
      status: "in-progress",
      priority: "high",
      createdAt: "2024-01-15T09:00:00Z",
      paymentStatus: "partial",
      estimatedAmount: 900,
      actualPrice: 850,
      discount: 50,
      finalPrice: 800,
      estimatedTime: 4,
      paidAmount: 300,
      serviceType: "repair",
      acServiceDetails: {
        serviceCategory: "Compressor Repair",
        partsUsed: [
          {
            id: "p1",
            name: "AC Compressor",
            category: "compressor",
            condition: "replaced",
            originalPrice: 200,
            salePrice: 280,
            quantity: 1,
            profit: 80,
            loss: 0,
          },
          {
            id: "p2",
            name: "Refrigerant R-410A",
            category: "refrigerant",
            condition: "new",
            originalPrice: 45,
            salePrice: 65,
            quantity: 2,
            profit: 40,
            loss: 0,
          },
        ],
        laborCost: 200,
        totalServiceCost: 850,
      },
      notes: "Customer reported strange noises and poor cooling. Compressor failed, replaced with new unit.",
    },
  ])

  const [isAddingComplaint, setIsAddingComplaint] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [newComplaint, setNewComplaint] = useState({
    customerId: "",
    customerName: "",
    employeeId: "",
    employeeName: "",
    title: "",
    description: "",
    priority: "medium" as const,
    serviceType: "repair" as const,
    estimatedAmount: 0,
    estimatedTime: 0,
    notes: "",
  })

  const [isEditingComplaint, setIsEditingComplaint] = useState(false)
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null)

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      assigned: "bg-blue-100 text-blue-800",
      "in-progress": "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: "bg-red-100 text-red-800",
      partial: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getServiceIcon = (serviceType: string) => {
    const icons = {
      repair: Wrench,
      installation: Settings,
      maintenance: Thermometer,
      emergency: Wind,
      consultation: User,
    }
    return icons[serviceType as keyof typeof icons] || Wrench
  }

  const addComplaint = () => {
    const complaint: Complaint = {
      id: Date.now().toString(),
      ...newComplaint,
      status: "pending",
      createdAt: new Date().toISOString(),
      paymentStatus: "pending",
      actualPrice: newComplaint.estimatedAmount,
      discount: 0,
      finalPrice: newComplaint.estimatedAmount,
      paidAmount: 0,
      acServiceDetails: {
        serviceCategory: "",
        partsUsed: [],
        laborCost: 0,
        totalServiceCost: newComplaint.estimatedAmount,
      },
    }
    setComplaints([...complaints, complaint])
    setNewComplaint({
      customerId: "",
      customerName: "",
      employeeId: "",
      employeeName: "",
      title: "",
      description: "",
      priority: "medium",
      serviceType: "repair",
      estimatedAmount: 0,
      estimatedTime: 0,
      notes: "",
    })
    setIsAddingComplaint(false)
  }

  const updateComplaintStatus = (complaintId: string, newStatus: string) => {
    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === complaintId
        ? {
            ...complaint,
            status: newStatus as any,
            completedAt: newStatus === "completed" ? new Date().toISOString() : complaint.completedAt,
          }
        : complaint,
    )
    setComplaints(updatedComplaints)
  }

  const updatePaymentStatus = (complaintId: string, newStatus: string, paidAmount?: number) => {
    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === complaintId
        ? {
            ...complaint,
            paymentStatus: newStatus as any,
            paidAmount: paidAmount !== undefined ? paidAmount : complaint.paidAmount,
          }
        : complaint,
    )
    setComplaints(updatedComplaints)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AC Service Management</h1>
          <p className="text-gray-600 mt-1">Manage service requests and track progress</p>
        </div>
        <Dialog open={isAddingComplaint} onOpenChange={setIsAddingComplaint}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Service Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add New Service Request</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Service Title *</Label>
                      <Input
                        id="title"
                        value={newComplaint.title}
                        onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                        placeholder="Enter service title"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerSelect">Customer *</Label>
                      <Select
                        value={newComplaint.customerId}
                        onValueChange={(value) => {
                          if (value === "other") {
                            setNewComplaint({ ...newComplaint, customerId: "other", customerName: "" })
                          } else {
                            const customer = customers.find((c) => c.id === value)
                            setNewComplaint({
                              ...newComplaint,
                              customerId: value,
                              customerName: customer?.name || "",
                            })
                          }
                        }}
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Other (Enter manually)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newComplaint.customerId === "other" && (
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Customer Name *</Label>
                        <Input
                          id="customerName"
                          value={newComplaint.customerName}
                          onChange={(e) => setNewComplaint({ ...newComplaint, customerName: e.target.value })}
                          placeholder="Enter customer name"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="employeeSelect">Assigned Technician *</Label>
                      <Select
                        value={newComplaint.employeeId}
                        onValueChange={(value) => {
                          if (value === "other") {
                            setNewComplaint({ ...newComplaint, employeeId: "other", employeeName: "" })
                          } else {
                            const employee = employees.find((e) => e.id === value)
                            setNewComplaint({
                              ...newComplaint,
                              employeeId: value,
                              employeeName: employee?.fullName || "",
                            })
                          }
                        }}
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select technician" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.fullName} - {employee.position}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Other (Enter manually)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newComplaint.employeeId === "other" && (
                      <div className="space-y-2">
                        <Label htmlFor="employeeName">Technician Name *</Label>
                        <Input
                          id="employeeName"
                          value={newComplaint.employeeName}
                          onChange={(e) => setNewComplaint({ ...newComplaint, employeeName: e.target.value })}
                          placeholder="Enter technician name"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="serviceType">Service Type *</Label>
                        <Select
                          value={newComplaint.serviceType}
                          onValueChange={(value) => setNewComplaint({ ...newComplaint, serviceType: value as any })}
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="repair">Repair</SelectItem>
                            <SelectItem value="installation">Installation</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="consultation">Consultation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority *</Label>
                        <Select
                          value={newComplaint.priority}
                          onValueChange={(value) => setNewComplaint({ ...newComplaint, priority: value as any })}
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="estimatedAmount">Estimated Amount ($) *</Label>
                        <Input
                          id="estimatedAmount"
                          type="number"
                          value={newComplaint.estimatedAmount}
                          onChange={(e) =>
                            setNewComplaint({ ...newComplaint, estimatedAmount: Number(e.target.value) })
                          }
                          placeholder="0"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estimatedTime">Estimated Time (hours) *</Label>
                        <Input
                          id="estimatedTime"
                          type="number"
                          value={newComplaint.estimatedTime}
                          onChange={(e) => setNewComplaint({ ...newComplaint, estimatedTime: Number(e.target.value) })}
                          placeholder="0"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Service Description *</Label>
                  <Textarea
                    id="description"
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                    placeholder="Describe the service request in detail"
                    rows={4}
                    className="focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={newComplaint.notes}
                    onChange={(e) => setNewComplaint({ ...newComplaint, notes: e.target.value })}
                    placeholder="Any additional notes or special instructions"
                    rows={3}
                    className="focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Service Request Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 font-medium">Estimated Cost:</span>
                      <span className="ml-2 font-bold">${newComplaint.estimatedAmount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Estimated Duration:</span>
                      <span className="ml-2 font-bold">{newComplaint.estimatedTime} hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsAddingComplaint(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={addComplaint} className="flex-1">
                Create Service Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Service Request Cards */}
      <div className="space-y-6">
        {complaints.map((complaint) => {
          const ServiceIcon = getServiceIcon(complaint.serviceType)
          return (
            <Card
              key={complaint.id}
              className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <ServiceIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900">{complaint.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        #{complaint.id} - {complaint.customerName}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Created: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{complaint.estimatedTime}h estimated</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                    <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                    <Badge variant="outline">{complaint.serviceType}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">{complaint.description}</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Technician: {complaint.employeeName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Final Price: ${complaint.finalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">Payment Status</span>
                      <Badge className={getPaymentStatusColor(complaint.paymentStatus)}>
                        {complaint.paymentStatus}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Paid: ${complaint.paidAmount.toLocaleString()}</span>
                        <span className="text-gray-600">
                          Remaining: ${(complaint.finalPrice - complaint.paidAmount).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((complaint.paidAmount / complaint.finalPrice) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 text-center">
                        {Math.round((complaint.paidAmount / complaint.finalPrice) * 100)}% completed
                      </div>
                    </div>
                  </div>
                </div>

                {/* AC Service Details */}
                {complaint.acServiceDetails.partsUsed.length > 0 && (
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Package className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">AC Parts & Services Used</span>
                    </div>
                    <div className="space-y-4">
                      <div className="text-sm font-medium text-blue-700 bg-white p-3 rounded-lg">
                        Service Category: {complaint.acServiceDetails.serviceCategory}
                      </div>
                      <div className="space-y-3">
                        {complaint.acServiceDetails.partsUsed.map((part) => (
                          <div key={part.id} className="bg-white p-4 rounded-lg border border-blue-200">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div>
                                <span className="font-medium text-gray-900">{part.name}</span>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {part.category}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      part.condition === "new"
                                        ? "border-green-300 text-green-700"
                                        : part.condition === "replaced"
                                          ? "border-blue-300 text-blue-700"
                                          : "border-orange-300 text-orange-700"
                                    }`}
                                  >
                                    {part.condition}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">
                                  <span>Qty: {part.quantity}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  <span>Sale: ${part.salePrice}</span>
                                </div>
                                <div className="text-sm font-medium text-green-600">Profit: ${part.profit}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-blue-200 pt-4 bg-white p-4 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-700">Labor Cost:</span>
                            <span className="font-medium">${complaint.acServiceDetails.laborCost}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-700">Parts Total:</span>
                            <span className="font-medium">
                              $
                              {complaint.acServiceDetails.partsUsed.reduce(
                                (sum, part) => sum + part.salePrice * part.quantity,
                                0,
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between font-semibold text-blue-900 border-t border-blue-200 pt-2">
                            <span>Total Service Cost:</span>
                            <span>${complaint.acServiceDetails.totalServiceCost}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-4 border-t border-gray-200">
                  <Select
                    value={complaint.status}
                    onValueChange={(value) => updateComplaintStatus(complaint.id, value)}
                  >
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={complaint.paymentStatus}
                    onValueChange={(value) => updatePaymentStatus(complaint.id, value)}
                  >
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(complaint)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{complaint.title} - Service Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <Label>Customer</Label>
                              <p className="text-sm mt-1">{complaint.customerName}</p>
                            </div>
                            <div>
                              <Label>Assigned Technician</Label>
                              <p className="text-sm mt-1">{complaint.employeeName}</p>
                            </div>
                            <div>
                              <Label>Service Type</Label>
                              <Badge variant="outline" className="ml-2">
                                {complaint.serviceType}
                              </Badge>
                            </div>
                            <div>
                              <Label>Created</Label>
                              <p className="text-sm mt-1">{new Date(complaint.createdAt).toLocaleString()}</p>
                            </div>
                            {complaint.completedAt && (
                              <div>
                                <Label>Completed</Label>
                                <p className="text-sm mt-1">{new Date(complaint.completedAt).toLocaleString()}</p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label>Priority</Label>
                              <Badge className={`${getPriorityColor(complaint.priority)} ml-2`}>
                                {complaint.priority}
                              </Badge>
                            </div>
                            <div>
                              <Label>Status</Label>
                              <Badge className={`${getStatusColor(complaint.status)} ml-2`}>{complaint.status}</Badge>
                            </div>
                            <div>
                              <Label>Payment Status</Label>
                              <Badge className={`${getPaymentStatusColor(complaint.paymentStatus)} ml-2`}>
                                {complaint.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label>Description</Label>
                          <p className="text-sm mt-2 p-3 bg-gray-50 rounded-lg">{complaint.description}</p>
                        </div>

                        {complaint.notes && (
                          <div>
                            <Label>Technician Notes</Label>
                            <p className="text-sm mt-2 p-3 bg-blue-50 rounded-lg">{complaint.notes}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">${complaint.finalPrice.toLocaleString()}</p>
                            <p className="text-xs text-gray-600">Final Amount</p>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">
                              ${complaint.paidAmount.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600">Paid Amount</p>
                          </div>
                          <div className="text-center p-4 bg-red-50 rounded-lg">
                            <p className="text-2xl font-bold text-red-600">
                              ${(complaint.finalPrice - complaint.paidAmount).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600">Remaining</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingComplaint(complaint)
                      setIsEditingComplaint(true)
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Pricing
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Edit Pricing Dialog */}
      <Dialog open={isEditingComplaint} onOpenChange={setIsEditingComplaint}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Service Pricing</DialogTitle>
          </DialogHeader>
          {editingComplaint && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editEstimatedAmount">Estimated Amount ($)</Label>
                <Input
                  id="editEstimatedAmount"
                  type="number"
                  value={editingComplaint.estimatedAmount}
                  onChange={(e) =>
                    setEditingComplaint({
                      ...editingComplaint,
                      estimatedAmount: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editActualPrice">Actual Price ($)</Label>
                <Input
                  id="editActualPrice"
                  type="number"
                  value={editingComplaint.actualPrice}
                  onChange={(e) =>
                    setEditingComplaint({
                      ...editingComplaint,
                      actualPrice: Number(e.target.value),
                      finalPrice: Number(e.target.value) - editingComplaint.discount,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDiscount">Discount ($)</Label>
                <Input
                  id="editDiscount"
                  type="number"
                  value={editingComplaint.discount}
                  onChange={(e) =>
                    setEditingComplaint({
                      ...editingComplaint,
                      discount: Number(e.target.value),
                      finalPrice: editingComplaint.actualPrice - Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEstimatedTime">Estimated Time (hours)</Label>
                <Input
                  id="editEstimatedTime"
                  type="number"
                  value={editingComplaint.estimatedTime}
                  onChange={(e) =>
                    setEditingComplaint({
                      ...editingComplaint,
                      estimatedTime: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Label>Final Price</Label>
                <p className="text-lg font-bold text-green-600 mt-1">${editingComplaint.finalPrice.toLocaleString()}</p>
              </div>
              <Button
                onClick={() => {
                  setComplaints(complaints.map((c) => (c.id === editingComplaint.id ? editingComplaint : c)))
                  setIsEditingComplaint(false)
                  setEditingComplaint(null)
                }}
                className="w-full"
              >
                Update Pricing
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
