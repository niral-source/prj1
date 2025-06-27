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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Plus,
  Eye,
  Phone,
  Mail,
  MapPinIcon,
  Calendar,
  Navigation,
  Clock,
  Edit,
  Upload,
  FileText,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Employee {
  id: string
  fullName: string
  email: string
  phone: string
  address: string
  position: string
  baseSalary: number
  status: "active" | "inactive" | "deleted"
  profileImage?: string
  documents: {
    panCard?: string
    aadharCard?: string
    electionCard?: string
    drivingLicense?: string
  }
  currentLocation?: {
    lat: number
    lng: number
    address: string
    lastUpdated: string
    isOnline: boolean
  }
  dailyTasks: DailyTask[]
  monthlyData: {
    [month: string]: {
      tasksCompleted: number
      salary: number
      leaveDays: number
      paidLeaveDays: number
      casualLeaveDays: number
      tasksAssigned: number
      performance: number
    }
  }
  totalLeaves: number
  usedLeaves: number
  paidLeaves: number
  casualLeaves: number
  leaveDetails: LeaveDetail[]
}

interface LeaveDetail {
  id: string
  date: string
  type: "paid" | "casual"
  reason: string
}

interface DailyTask {
  id: string
  date: string
  customerId: string
  customerName: string
  description: string
  status: "assigned" | "reached" | "checking" | "working" | "completed" | "in-progress"
  notes: string
  assignedAt: string
  completedAt?: string
}

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      fullName: "John Smith",
      email: "john@company.com",
      phone: "+91 98765 43210",
      address: "123 Main St, Mumbai, Maharashtra",
      position: "Field Technician",
      baseSalary: 35000,
      status: "active",
      documents: {
        panCard: "ABCDE1234F",
        aadharCard: "1234 5678 9012",
      },
      currentLocation: {
        lat: 40.7128,
        lng: -74.006,
        address: "456 Customer St, Mumbai, Maharashtra",
        lastUpdated: "2024-01-15 14:30:00",
        isOnline: true,
      },
      dailyTasks: [
        {
          id: "t1",
          date: "2024-01-15",
          customerId: "c1",
          customerName: "ABC Corp",
          description: "Fix air conditioning unit",
          status: "working",
          notes: "Unit needs new compressor",
          assignedAt: "2024-01-15 09:00:00",
        },
      ],
      monthlyData: {
        "2024-01": {
          tasksCompleted: 28,
          salary: 33500,
          leaveDays: 2,
          paidLeaveDays: 1,
          casualLeaveDays: 1,
          tasksAssigned: 30,
          performance: 93,
        },
        "2024-02": {
          tasksCompleted: 25,
          salary: 34000,
          leaveDays: 1,
          paidLeaveDays: 0,
          casualLeaveDays: 1,
          tasksAssigned: 27,
          performance: 89,
        },
      },
      totalLeaves: 24,
      usedLeaves: 8,
      paidLeaves: 5,
      casualLeaves: 3,
      leaveDetails: [
        { id: "l1", date: "2024-01-10", type: "paid", reason: "Flu" },
        { id: "l2", date: "2024-01-15", type: "casual", reason: "Personal work" },
      ],
    },
    {
      id: "2",
      fullName: "Sarah Johnson",
      email: "sarah@company.com",
      phone: "+91 87654 32109",
      address: "456 Oak Ave, Delhi, Delhi",
      position: "Senior Technician",
      status: "active",
      documents: {
        panCard: "FGHIJ5678K",
        drivingLicense: "DL1234567890",
      },
      currentLocation: {
        lat: 40.7589,
        lng: -73.9851,
        address: "789 Business Blvd, Delhi, Delhi",
        lastUpdated: "2024-01-15 15:45:00",
        isOnline: true,
      },
      dailyTasks: [
        {
          id: "t2",
          date: "2024-01-15",
          customerId: "c2",
          customerName: "XYZ Ltd",
          description: "Install new HVAC system",
          status: "completed",
          notes: "Installation completed successfully",
          assignedAt: "2024-01-15 08:00:00",
          completedAt: "2024-01-15 16:00:00",
        },
      ],
      monthlyData: {
        "2024-01": {
          tasksCompleted: 32,
          salary: 42000,
          leaveDays: 1,
          tasksAssigned: 33,
          performance: 97,
          paidLeaveDays: 0,
          casualLeaveDays: 1,
        },
        "2024-02": {
          tasksCompleted: 30,
          salary: 42800,
          leaveDays: 0,
          tasksAssigned: 31,
          performance: 95,
          paidLeaveDays: 0,
          casualLeaveDays: 0,
        },
      },
      totalLeaves: 24,
      usedLeaves: 5,
      paidLeaves: 0,
      casualLeaves: 5,
      leaveDetails: [],
    },
  ])

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isAddingEmployee, setIsAddingEmployee] = useState(false)
  const [isAssigningTask, setIsAssigningTask] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    position: "",
    baseSalary: 0,
    documents: {
      panCard: "",
      aadharCard: "",
      electionCard: "",
      drivingLicense: "",
    },
  })
  const [newTask, setNewTask] = useState({
    customerId: "",
    customerName: "",
    description: "",
    notes: "",
  })

  const [isEditingEmployee, setIsEditingEmployee] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  const getStatusColor = (status: string) => {
    const colors = {
      assigned: "bg-blue-100 text-blue-800 border-blue-200",
      reached: "bg-yellow-100 text-yellow-800 border-yellow-200",
      checking: "bg-orange-100 text-orange-800 border-orange-200",
      working: "bg-purple-100 text-purple-800 border-purple-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      "in-progress": "bg-indigo-100 text-indigo-800 border-indigo-200",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const addEmployee = () => {
    const employee: Employee = {
      id: Date.now().toString(),
      ...newEmployee,
      status: "active",
      dailyTasks: [],
      monthlyData: {},
      totalLeaves: 24,
      usedLeaves: 0,
      paidLeaves: 0,
      casualLeaves: 0,
      leaveDetails: [],
    }
    setEmployees([...employees, employee])
    setNewEmployee({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      position: "",
      baseSalary: 0,
      documents: {
        panCard: "",
        aadharCard: "",
        electionCard: "",
        drivingLicense: "",
      },
    })
    setIsAddingEmployee(false)
  }

  const assignTask = () => {
    if (!selectedEmployee) return

    const task: DailyTask = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      ...newTask,
      status: "assigned",
      assignedAt: new Date().toISOString(),
    }

    const updatedEmployees = employees.map((emp) =>
      emp.id === selectedEmployee.id ? { ...emp, dailyTasks: [...emp.dailyTasks, task] } : emp,
    )

    setEmployees(updatedEmployees)
    setNewTask({ customerId: "", customerName: "", description: "", notes: "" })
    setIsAssigningTask(false)
  }

  const updateTaskStatus = (employeeId: string, taskId: string, newStatus: string) => {
    const updatedEmployees = employees.map((emp) =>
      emp.id === employeeId
        ? {
            ...emp,
            dailyTasks: emp.dailyTasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    status: newStatus as any,
                    completedAt: newStatus === "completed" ? new Date().toISOString() : task.completedAt,
                  }
                : task,
            ),
          }
        : emp,
    )
    setEmployees(updatedEmployees)
  }

  const updateEmployee = () => {
    if (!editingEmployee) return

    const updatedEmployees = employees.map((emp) => (emp.id === editingEmployee.id ? editingEmployee : emp))
    setEmployees(updatedEmployees)
    setIsEditingEmployee(false)
    setEditingEmployee(null)
  }

  const updateEmployeeStatus = (employeeId: string, newStatus: "active" | "inactive" | "deleted") => {
    const updatedEmployees = employees.map((emp) => (emp.id === employeeId ? { ...emp, status: newStatus } : emp))
    setEmployees(updatedEmployees)
  }

  // Filter out deleted employees from main view
  const activeEmployees = employees.filter((emp) => emp.status !== "deleted")

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Employee Management
          </h2>
          <p className="text-slate-600 mt-1">Manage your team and track their performance</p>
        </div>
        <Dialog open={isAddingEmployee} onOpenChange={setIsAddingEmployee}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
              <div className="space-y-6 py-4">
                {/* Profile Image Upload */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Profile Information</h3>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {newEmployee.profileImage ? (
                        <img
                          src={newEmployee.profileImage || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Profile Photo</Label>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                      <p className="text-xs text-gray-500">JPG, PNG up to 2MB</p>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={newEmployee.fullName}
                        onChange={(e) => setNewEmployee({ ...newEmployee, fullName: e.target.value })}
                        placeholder="Enter full name"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position *</Label>
                      <Input
                        id="position"
                        value={newEmployee.position}
                        onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                        placeholder="Job position"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                        placeholder="employee@company.com"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Address & Salary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      value={newEmployee.address}
                      onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                      placeholder="Enter complete address including city, state, and pin code"
                      rows={3}
                      className="focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baseSalary">Base Salary (₹) *</Label>
                    <Input
                      id="baseSalary"
                      type="number"
                      value={newEmployee.baseSalary}
                      onChange={(e) => setNewEmployee({ ...newEmployee, baseSalary: Number(e.target.value) })}
                      placeholder="Enter monthly salary"
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-4">Identity Documents (At least one required)</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="panCard">PAN Card Number</Label>
                      <Input
                        id="panCard"
                        value={newEmployee.documents.panCard}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            documents: { ...newEmployee.documents, panCard: e.target.value },
                          })
                        }
                        placeholder="ABCDE1234F"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aadharCard">Aadhar Card Number</Label>
                      <Input
                        id="aadharCard"
                        value={newEmployee.documents.aadharCard}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            documents: { ...newEmployee.documents, aadharCard: e.target.value },
                          })
                        }
                        placeholder="1234 5678 9012"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="electionCard">Election Card Number</Label>
                      <Input
                        id="electionCard"
                        value={newEmployee.documents.electionCard}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            documents: { ...newEmployee.documents, electionCard: e.target.value },
                          })
                        }
                        placeholder="ABC1234567"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="drivingLicense">Driving License Number</Label>
                      <Input
                        id="drivingLicense"
                        value={newEmployee.documents.drivingLicense}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            documents: { ...newEmployee.documents, drivingLicense: e.target.value },
                          })
                        }
                        placeholder="DL1234567890"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Employee Benefits */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-2">Employee Benefits</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• 24 annual paid leave days</li>
                    <li>• 1 casual leave per month</li>
                    <li>• Performance-based bonuses</li>
                    <li>• Field work allowances</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsAddingEmployee(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={addEmployee} className="flex-1">
                    Add Employee
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {activeEmployees.map((employee) => (
          <Card
            key={employee.id}
            className="bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
          >
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200/60">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {employee.profileImage ? (
                      <img
                        src={employee.profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-600">
                        {employee.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-800">{employee.fullName}</CardTitle>
                    <p className="text-sm text-slate-600 font-medium">{employee.position}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant={employee.status === "active" ? "default" : "secondary"}
                    className={employee.status === "active" ? "bg-green-100 text-green-800 border-green-200" : ""}
                  >
                    {employee.status}
                  </Badge>
                  {employee.currentLocation?.isOnline && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Online
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">{employee.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">{employee.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPinIcon className="w-4 h-4 text-slate-500" />
                  <span className="truncate text-slate-700">{employee.address}</span>
                </div>
              </div>

              {/* Live Location Tracking */}
              {employee.currentLocation && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200/60">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-1 bg-green-500 rounded-full">
                      <Navigation className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-semibold text-green-800 text-sm">Live Location</span>
                    {employee.currentLocation.isOnline && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <p className="text-xs text-green-700 mb-1">{employee.currentLocation.address}</p>
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <Clock className="w-3 h-3" />
                    <span>Updated: {new Date(employee.currentLocation.lastUpdated).toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Leave Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-blue-800 text-sm">Leave Balance</span>
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">Paid Leaves: {employee.paidLeaves}</span>
                    <span className="text-blue-700">Casual: {employee.casualLeaves}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">Used: {employee.usedLeaves}</span>
                    <span className="text-blue-700">Remaining: {employee.totalLeaves - employee.usedLeaves}</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(employee.usedLeaves / employee.totalLeaves) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-blue-600">Monthly allowance: 1 casual leave per month</div>
                </div>
              </div>

              {/* Today's Tasks */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-700">Today's Tasks</span>
                  <Badge variant="outline" className="border-slate-300">
                    {employee.dailyTasks.length}
                  </Badge>
                </div>
                {employee.dailyTasks.slice(0, 2).map((task) => (
                  <div key={task.id} className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm text-slate-800">{task.customerName}</span>
                      <Badge className={`${getStatusColor(task.status)} text-xs border`} variant="secondary">
                        {task.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">{task.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-300 hover:bg-slate-50 bg-transparent"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl">{employee.fullName} - Employee Details</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="tasks">Tasks</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly Data</TabsTrigger>
                        <TabsTrigger value="location">Location</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Email</Label>
                            <p className="text-sm">{employee.email}</p>
                          </div>
                          <div>
                            <Label>Phone</Label>
                            <p className="text-sm">{employee.phone}</p>
                          </div>
                          <div className="col-span-2">
                            <Label>Address</Label>
                            <p className="text-sm">{employee.address}</p>
                          </div>
                          <div>
                            <Label>Base Salary</Label>
                            <p className="text-sm">₹{employee.baseSalary.toLocaleString()}</p>
                          </div>
                          <div>
                            <Label>Status</Label>
                            <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                              {employee.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {employee.totalLeaves - employee.usedLeaves}
                              </div>
                              <p className="text-xs text-slate-600">Leaves Remaining</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-green-600">{employee.dailyTasks.length}</div>
                              <p className="text-xs text-slate-600">Active Tasks</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-purple-600">
                                {employee.monthlyData["2024-02"]?.performance || 0}%
                              </div>
                              <p className="text-xs text-slate-600">Performance</p>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="documents" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {employee.documents.panCard && (
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <FileText className="w-8 h-8 text-blue-600" />
                                  <div>
                                    <h4 className="font-semibold">PAN Card</h4>
                                    <p className="text-sm text-gray-600">{employee.documents.panCard}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                          {employee.documents.aadharCard && (
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <FileText className="w-8 h-8 text-green-600" />
                                  <div>
                                    <h4 className="font-semibold">Aadhar Card</h4>
                                    <p className="text-sm text-gray-600">{employee.documents.aadharCard}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                          {employee.documents.electionCard && (
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <FileText className="w-8 h-8 text-purple-600" />
                                  <div>
                                    <h4 className="font-semibold">Election Card</h4>
                                    <p className="text-sm text-gray-600">{employee.documents.electionCard}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                          {employee.documents.drivingLicense && (
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <FileText className="w-8 h-8 text-orange-600" />
                                  <div>
                                    <h4 className="font-semibold">Driving License</h4>
                                    <p className="text-sm text-gray-600">{employee.documents.drivingLicense}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="tasks" className="space-y-4">
                        <div className="space-y-3">
                          {employee.dailyTasks.map((task) => (
                            <div key={task.id} className="border p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{task.customerName}</span>
                                <Select
                                  value={task.status}
                                  onValueChange={(value) => updateTaskStatus(employee.id, task.id, value)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="assigned">Assigned</SelectItem>
                                    <SelectItem value="reached">Reached</SelectItem>
                                    <SelectItem value="checking">Checking</SelectItem>
                                    <SelectItem value="working">Working</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <p className="text-sm text-slate-600">{task.description}</p>
                              {task.notes && <p className="text-xs text-slate-500 mt-1">Notes: {task.notes}</p>}
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="monthly" className="space-y-4">
                        <div className="space-y-4">
                          {Object.entries(employee.monthlyData).map(([month, data]) => (
                            <Card key={month}>
                              <CardHeader>
                                <CardTitle className="text-lg">{month}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                  <div className="text-center">
                                    <div className="text-xl font-bold text-blue-600">{data.tasksAssigned}</div>
                                    <p className="text-xs text-slate-600">Tasks Assigned</p>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xl font-bold text-green-600">{data.tasksCompleted}</div>
                                    <p className="text-xs text-slate-600">Tasks Completed</p>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xl font-bold text-purple-600">
                                      ₹{data.salary.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-slate-600">Salary</p>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xl font-bold text-orange-600">{data.leaveDays}</div>
                                    <p className="text-xs text-slate-600">Total Leaves</p>
                                    <div className="text-xs text-slate-500 mt-1">
                                      Paid: {data.paidLeaveDays} | Casual: {data.casualLeaveDays}
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xl font-bold text-indigo-600">{data.performance}%</div>
                                    <p className="text-xs text-slate-600">Performance</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="location" className="space-y-4">
                        {employee.currentLocation ? (
                          <div className="space-y-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <MapPin className="w-5 h-5" />
                                  Current Location
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  <div>
                                    <Label>Address</Label>
                                    <p className="text-sm">{employee.currentLocation.address}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Latitude</Label>
                                      <p className="text-sm">{employee.currentLocation.lat}</p>
                                    </div>
                                    <div>
                                      <Label>Longitude</Label>
                                      <p className="text-sm">{employee.currentLocation.lng}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Last Updated</Label>
                                    <p className="text-sm">
                                      {new Date(employee.currentLocation.lastUpdated).toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Label>Status</Label>
                                    <Badge variant={employee.currentLocation.isOnline ? "default" : "secondary"}>
                                      {employee.currentLocation.isOnline ? "Online" : "Offline"}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Mock Map Placeholder */}
                            <Card>
                              <CardContent className="p-6">
                                <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                  <div className="text-center">
                                    <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                                    <p className="text-blue-700 font-medium">Live Location Map</p>
                                    <p className="text-blue-600 text-sm">Real-time tracking enabled</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                            <p className="text-slate-600">Location tracking not available</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>

                <Dialog open={isAssigningTask} onOpenChange={setIsAssigningTask}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Assign
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign Task to {employee.fullName}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="customerId">Customer ID</Label>
                        <Input
                          id="customerId"
                          value={newTask.customerId}
                          onChange={(e) => setNewTask({ ...newTask, customerId: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="customerName">Customer Name</Label>
                        <Input
                          id="customerName"
                          value={newTask.customerName}
                          onChange={(e) => setNewTask({ ...newTask, customerName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Task Description</Label>
                        <Textarea
                          id="description"
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={newTask.notes}
                          onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                        />
                      </div>
                      <Button onClick={assignTask} className="w-full">
                        Assign Task
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
                    onClick={() => {
                      setEditingEmployee(employee)
                      setIsEditingEmployee(true)
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  <Select
                    value={employee.status}
                    onValueChange={(value) => updateEmployeeStatus(employee.id, value as any)}
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="deleted">Delete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditingEmployee} onOpenChange={setIsEditingEmployee}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {editingEmployee && (
            <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
              <div className="space-y-6 py-4">
                {/* Profile Image Upload */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Profile Information</h3>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {editingEmployee.profileImage ? (
                        <img
                          src={editingEmployee.profileImage || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-gray-600">
                          {editingEmployee.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Profile Photo</Label>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-xs text-gray-500">JPG, PNG up to 2MB</p>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="editFullName">Full Name *</Label>
                      <Input
                        id="editFullName"
                        value={editingEmployee.fullName}
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, fullName: e.target.value })}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editPosition">Position *</Label>
                      <Input
                        id="editPosition"
                        value={editingEmployee.position}
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editEmail">Email Address *</Label>
                      <Input
                        id="editEmail"
                        type="email"
                        value={editingEmployee.email}
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editPhone">Phone Number *</Label>
                      <Input
                        id="editPhone"
                        value={editingEmployee.phone}
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Address & Salary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="editAddress">Full Address *</Label>
                    <Textarea
                      id="editAddress"
                      value={editingEmployee.address}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, address: e.target.value })}
                      rows={3}
                      className="focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="editBaseSalary">Base Salary (₹) *</Label>
                      <Input
                        id="editBaseSalary"
                        type="number"
                        value={editingEmployee.baseSalary}
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, baseSalary: Number(e.target.value) })}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editStatus">Status</Label>
                      <Select
                        value={editingEmployee.status}
                        onValueChange={(value) => setEditingEmployee({ ...editingEmployee, status: value as any })}
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-4">Identity Documents</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="editPanCard">PAN Card Number</Label>
                      <Input
                        id="editPanCard"
                        value={editingEmployee.documents?.panCard || ""}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            documents: { ...editingEmployee.documents, panCard: e.target.value },
                          })
                        }
                        placeholder="ABCDE1234F"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editAadharCard">Aadhar Card Number</Label>
                      <Input
                        id="editAadharCard"
                        value={editingEmployee.documents?.aadharCard || ""}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            documents: { ...editingEmployee.documents, aadharCard: e.target.value },
                          })
                        }
                        placeholder="1234 5678 9012"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editElectionCard">Election Card Number</Label>
                      <Input
                        id="editElectionCard"
                        value={editingEmployee.documents?.electionCard || ""}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            documents: { ...editingEmployee.documents, electionCard: e.target.value },
                          })
                        }
                        placeholder="ABC1234567"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editDrivingLicense">Driving License Number</Label>
                      <Input
                        id="editDrivingLicense"
                        value={editingEmployee.documents?.drivingLicense || ""}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            documents: { ...editingEmployee.documents, drivingLicense: e.target.value },
                          })
                        }
                        placeholder="DL1234567890"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsEditingEmployee(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={updateEmployee} className="flex-1">
                    Update Employee
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
