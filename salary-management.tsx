"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DollarSign, Plus, Edit, Download, Calendar } from "lucide-react"

interface SalaryRecord {
  id: string
  employeeId: string
  employeeName: string
  position: string
  baseSalary: number
  overtime: number
  bonus: number
  deductions: number
  leaveDeductions: number
  paidLeavesTaken: number
  unpaidLeavesTaken: number
  casualLeavesTaken: number
  netSalary: number
  month: string
  year: number
  status: "pending" | "paid" | "processing"
  payDate?: string
  paymentMethod: "bank" | "cash" | "check"
}

export default function SalaryManagement() {
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([
    {
      id: "1",
      employeeId: "1",
      employeeName: "John Smith",
      position: "Field Technician",
      baseSalary: 3500,
      overtime: 200,
      bonus: 150,
      deductions: 350,
      leaveDeductions: 150,
      paidLeavesTaken: 1,
      unpaidLeavesTaken: 1,
      casualLeavesTaken: 0,
      netSalary: 3350,
      month: "January",
      year: 2024,
      status: "paid",
      payDate: "2024-01-31",
      paymentMethod: "bank",
    },
    {
      id: "2",
      employeeId: "2",
      employeeName: "Sarah Johnson",
      position: "Senior Technician",
      baseSalary: 4200,
      overtime: 300,
      bonus: 200,
      deductions: 420,
      leaveDeductions: 0,
      paidLeavesTaken: 0,
      unpaidLeavesTaken: 0,
      casualLeavesTaken: 0,
      netSalary: 4280,
      month: "January",
      year: 2024,
      status: "pending",
      paymentMethod: "bank",
    },
  ])

  const [isAddingSalary, setIsAddingSalary] = useState(false)
  const [newSalary, setNewSalary] = useState({
    employeeName: "",
    position: "",
    baseSalary: 0,
    overtime: 0,
    bonus: 0,
    deductions: 0,
    paidLeavesTaken: 0,
    unpaidLeavesTaken: 0,
    casualLeavesTaken: 0,
    month: "",
    year: 2024,
    paymentMethod: "bank" as const,
  })

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const calculateNetSalary = (
    base: number,
    overtime: number,
    bonus: number,
    deductions: number,
    leaveDeductions: number,
  ) => {
    return base + overtime + bonus - deductions - leaveDeductions
  }

  const addSalaryRecord = () => {
    const dailySalary = newSalary.baseSalary / 30
    const leaveDeductions = Math.max(0, (newSalary.unpaidLeavesTaken - 1) * dailySalary)

    const netSalary = calculateNetSalary(
      newSalary.baseSalary,
      newSalary.overtime,
      newSalary.bonus,
      newSalary.deductions,
      leaveDeductions,
    )

    const salaryRecord: SalaryRecord = {
      id: Date.now().toString(),
      employeeId: Date.now().toString(),
      ...newSalary,
      leaveDeductions,
      netSalary,
      status: "pending",
    }
    setSalaryRecords([...salaryRecords, salaryRecord])
    setNewSalary({
      employeeName: "",
      position: "",
      baseSalary: 0,
      overtime: 0,
      bonus: 0,
      deductions: 0,
      paidLeavesTaken: 0,
      unpaidLeavesTaken: 0,
      casualLeavesTaken: 0,
      month: "",
      year: 2024,
      paymentMethod: "bank",
    })
    setIsAddingSalary(false)
  }

  const updateSalaryStatus = (salaryId: string, newStatus: "pending" | "paid" | "processing") => {
    const updatedRecords = salaryRecords.map((record) =>
      record.id === salaryId
        ? {
            ...record,
            status: newStatus,
            payDate: newStatus === "paid" ? new Date().toISOString().split("T")[0] : record.payDate,
          }
        : record,
    )
    setSalaryRecords(updatedRecords)
  }

  const exportSalaryData = () => {
    // Create CSV content for salary records
    const headers = [
      "ID",
      "Employee Name",
      "Position",
      "Month",
      "Year",
      "Base Salary",
      "Overtime",
      "Bonus",
      "Deductions",
      "Leave Deductions",
      "Paid Leaves",
      "Unpaid Leaves",
      "Net Salary",
      "Status",
      "Payment Method",
      "Pay Date",
    ]

    const csvContent = [
      headers.join(","),
      ...salaryRecords.map((record) =>
        [
          record.id,
          `"${record.employeeName}"`,
          `"${record.position}"`,
          record.month,
          record.year,
          record.baseSalary,
          record.overtime,
          record.bonus,
          record.deductions,
          record.leaveDeductions,
          record.paidLeavesTaken,
          record.unpaidLeavesTaken,
          record.netSalary,
          record.status,
          record.paymentMethod,
          record.payDate || "",
        ].join(","),
      ),
    ].join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `salary_records_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalSalaries = salaryRecords.reduce((sum, record) => sum + record.netSalary, 0)
  const pendingSalaries = salaryRecords.filter((record) => record.status === "pending")
  const paidSalaries = salaryRecords.filter((record) => record.status === "paid")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salary Management</h1>
          <p className="text-gray-600 mt-1">Manage employee salaries and payroll processing</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={exportSalaryData}
            variant="outline"
            className="bg-green-50 hover:bg-green-100 border-green-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Dialog open={isAddingSalary} onOpenChange={setIsAddingSalary}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Salary Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Add Salary Record</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
                <div className="space-y-6 py-4">
                  {/* Employee Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4">Employee Information</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="employeeName">Employee Name *</Label>
                        <Input
                          id="employeeName"
                          value={newSalary.employeeName}
                          onChange={(e) => setNewSalary({ ...newSalary, employeeName: e.target.value })}
                          placeholder="Enter employee name"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Position *</Label>
                        <Input
                          id="position"
                          value={newSalary.position}
                          onChange={(e) => setNewSalary({ ...newSalary, position: e.target.value })}
                          placeholder="Job position"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select
                          value={newSalary.paymentMethod}
                          onValueChange={(value) => setNewSalary({ ...newSalary, paymentMethod: value as any })}
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="check">Check</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Salary Period */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-4">Salary Period</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="month">Month *</Label>
                        <Select
                          value={newSalary.month}
                          onValueChange={(value) => setNewSalary({ ...newSalary, month: value })}
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="January">January</SelectItem>
                            <SelectItem value="February">February</SelectItem>
                            <SelectItem value="March">March</SelectItem>
                            <SelectItem value="April">April</SelectItem>
                            <SelectItem value="May">May</SelectItem>
                            <SelectItem value="June">June</SelectItem>
                            <SelectItem value="July">July</SelectItem>
                            <SelectItem value="August">August</SelectItem>
                            <SelectItem value="September">September</SelectItem>
                            <SelectItem value="October">October</SelectItem>
                            <SelectItem value="November">November</SelectItem>
                            <SelectItem value="December">December</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Year *</Label>
                        <Input
                          id="year"
                          type="number"
                          value={newSalary.year}
                          onChange={(e) => setNewSalary({ ...newSalary, year: Number(e.target.value) })}
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Salary Components */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-4">Salary Components</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="baseSalary">Base Salary ($) *</Label>
                        <Input
                          id="baseSalary"
                          type="number"
                          value={newSalary.baseSalary}
                          onChange={(e) => setNewSalary({ ...newSalary, baseSalary: Number(e.target.value) })}
                          placeholder="0"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="overtime">Overtime ($)</Label>
                        <Input
                          id="overtime"
                          type="number"
                          value={newSalary.overtime}
                          onChange={(e) => setNewSalary({ ...newSalary, overtime: Number(e.target.value) })}
                          placeholder="0"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bonus">Bonus ($)</Label>
                        <Input
                          id="bonus"
                          type="number"
                          value={newSalary.bonus}
                          onChange={(e) => setNewSalary({ ...newSalary, bonus: Number(e.target.value) })}
                          placeholder="0"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="font-semibold text-red-900 mb-4">Deductions</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="deductions">Other Deductions ($)</Label>
                        <Input
                          id="deductions"
                          type="number"
                          value={newSalary.deductions}
                          onChange={(e) => setNewSalary({ ...newSalary, deductions: Number(e.target.value) })}
                          placeholder="0"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="casualLeavesTaken">Casual Leaves (CL) Taken</Label>
                          <Input
                            id="casualLeavesTaken"
                            type="number"
                            value={newSalary.casualLeavesTaken || 0}
                            onChange={(e) => setNewSalary({ ...newSalary, casualLeavesTaken: Number(e.target.value) })}
                            placeholder="0"
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paidLeaves">Paid Leaves Taken</Label>
                          <Input
                            id="paidLeaves"
                            type="number"
                            value={newSalary.paidLeavesTaken}
                            onChange={(e) => setNewSalary({ ...newSalary, paidLeavesTaken: Number(e.target.value) })}
                            placeholder="0"
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="unpaidLeaves">Unpaid Leaves Taken</Label>
                          <Input
                            id="unpaidLeaves"
                            type="number"
                            value={newSalary.unpaidLeavesTaken}
                            onChange={(e) => setNewSalary({ ...newSalary, unpaidLeavesTaken: Number(e.target.value) })}
                            placeholder="0"
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leave Summary */}
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-900 mb-3">Leave Summary & Deductions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-yellow-800">Casual Leaves (CL):</span>
                          <span className="font-medium">{newSalary.casualLeavesTaken || 0} (1 free per month)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-yellow-800">Paid Leaves:</span>
                          <span className="font-medium">{newSalary.paidLeavesTaken} (No deduction)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-yellow-800">Unpaid Leaves:</span>
                          <span className="font-medium">{newSalary.unpaidLeavesTaken}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-yellow-800">CL Deduction:</span>
                          <span className="font-bold text-red-600">
                            -$
                            {Math.max(
                              0,
                              ((newSalary.casualLeavesTaken || 0) - 1) * (newSalary.baseSalary / 30),
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-yellow-800">Unpaid Leave Deduction:</span>
                          <span className="font-bold text-red-600">
                            -${(newSalary.unpaidLeavesTaken * (newSalary.baseSalary / 30)).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-yellow-300 pt-2">
                          <span className="text-yellow-800 font-semibold">Total Leave Deduction:</span>
                          <span className="font-bold text-red-600">
                            -$
                            {(
                              Math.max(0, ((newSalary.casualLeavesTaken || 0) - 1) * (newSalary.baseSalary / 30)) +
                              newSalary.unpaidLeavesTaken * (newSalary.baseSalary / 30)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Salary Calculation */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-4">Net Salary Calculation</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-green-800">Base Salary:</span>
                            <span className="font-medium">${newSalary.baseSalary.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-800">Overtime:</span>
                            <span className="font-medium text-green-600">+${newSalary.overtime.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-800">Bonus:</span>
                            <span className="font-medium text-green-600">+${newSalary.bonus.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-green-800">Other Deductions:</span>
                            <span className="font-medium text-red-600">-${newSalary.deductions.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-800">Leave Deductions:</span>
                            <span className="font-medium text-red-600">
                              -$
                              {(
                                Math.max(0, ((newSalary.casualLeavesTaken || 0) - 1) * (newSalary.baseSalary / 30)) +
                                newSalary.unpaidLeavesTaken * (newSalary.baseSalary / 30)
                              ).toFixed(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-green-300 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-green-900">Net Salary:</span>
                          <span className="text-3xl font-bold text-green-600">
                            $
                            {calculateNetSalary(
                              newSalary.baseSalary,
                              newSalary.overtime,
                              newSalary.bonus,
                              newSalary.deductions,
                              Math.max(0, ((newSalary.casualLeavesTaken || 0) - 1) * (newSalary.baseSalary / 30)) +
                                newSalary.unpaidLeavesTaken * (newSalary.baseSalary / 30),
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsAddingSalary(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={addSalaryRecord} className="flex-1">
                  Add Salary Record
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <DollarSign className="w-5 h-5" />
              Total Salaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 mb-2">${totalSalaries.toLocaleString()}</div>
            <p className="text-sm text-blue-600">All records</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Calendar className="w-5 h-5" />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-700 mb-2">{pendingSalaries.length}</div>
            <p className="text-sm text-yellow-600">
              ${pendingSalaries.reduce((sum, record) => sum + record.netSalary, 0).toLocaleString()} total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Download className="w-5 h-5" />
              Paid This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 mb-2">{paidSalaries.length}</div>
            <p className="text-sm text-green-600">
              ${paidSalaries.reduce((sum, record) => sum + record.netSalary, 0).toLocaleString()} total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Salary Records</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Base Salary</TableHead>
                  <TableHead>Overtime</TableHead>
                  <TableHead>Bonus</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Leave Deductions</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaryRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{record.employeeName}</div>
                        <div className="text-sm text-gray-500">{record.position}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {record.month} {record.year}
                    </TableCell>
                    <TableCell className="font-medium">${record.baseSalary.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600 font-medium">${record.overtime.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600 font-medium">${record.bonus.toLocaleString()}</TableCell>
                    <TableCell className="text-red-600 font-medium">${record.deductions.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-gray-600">Paid: {record.paidLeavesTaken}</div>
                        <div className="text-gray-600">Unpaid: {record.unpaidLeavesTaken}</div>
                        <div className="text-red-600 font-medium">-${record.leaveDeductions.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-lg text-gray-900">
                      ${record.netSalary.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(record.status)} variant="secondary">
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {record.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => updateSalaryStatus(record.id, "paid")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark Paid
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="hover:bg-blue-50">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md max-h-[85vh]">
                            <DialogHeader>
                              <DialogTitle>Salary Details - {record.employeeName}</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="max-h-[calc(85vh-120px)] pr-4">
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <Label className="text-sm font-semibold text-gray-700">Employee</Label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{record.employeeName}</p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <Label className="text-sm font-semibold text-gray-700">Position</Label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{record.position}</p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <Label className="text-sm font-semibold text-gray-700">Period</Label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">
                                      {record.month} {record.year}
                                    </p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <Label className="text-sm font-semibold text-gray-700">Payment Method</Label>
                                    <p className="text-sm font-medium text-gray-800 mt-1 capitalize">
                                      {record.paymentMethod}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-3 border-t pt-4">
                                  <h4 className="font-semibold text-gray-900">Salary Breakdown</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                                      <span className="text-blue-800 font-medium">Base Salary:</span>
                                      <span className="font-bold text-blue-700">
                                        ${record.baseSalary.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                                      <span className="text-green-800 font-medium">Overtime:</span>
                                      <span className="font-bold text-green-700">
                                        +${record.overtime.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                                      <span className="text-green-800 font-medium">Bonus:</span>
                                      <span className="font-bold text-green-700">
                                        +${record.bonus.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                                      <span className="text-red-800 font-medium">Deductions:</span>
                                      <span className="font-bold text-red-700">
                                        -${record.deductions.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                                      <span className="text-red-800 font-medium">Leave Deductions:</span>
                                      <span className="font-bold text-red-700">
                                        -${record.leaveDeductions.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500 pl-4">
                                      Paid Leaves: {record.paidLeavesTaken} | Unpaid: {record.unpaidLeavesTaken}
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-3 bg-gray-50 p-3 rounded-lg">
                                      <span className="text-gray-900">Net Salary:</span>
                                      <span className="text-gray-900">${record.netSalary.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>

                                {record.payDate && (
                                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <Label className="text-sm font-semibold text-green-800">Payment Information</Label>
                                    <p className="text-sm text-green-700 mt-1">
                                      Paid on: {new Date(record.payDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-green-700">
                                      Method:{" "}
                                      {record.paymentMethod.charAt(0).toUpperCase() + record.paymentMethod.slice(1)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
