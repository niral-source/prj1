"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, DollarSign, Package, Download, Activity } from "lucide-react"

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState("January")
  const [selectedYear, setSelectedYear] = useState("2024")

  // Mock data for reports
  const monthlyData = {
    totalIncome: 125000,
    totalPayments: 110000,
    totalSalaries: 85000,
    productsSold: 45,
    servicesDone: 32,
    netProfit: 40000,
    expenses: 70000,
    customerGrowth: 12,
  }

  const revenueData = [
    { month: "Jan", income: 125000, expenses: 70000, profit: 55000 },
    { month: "Feb", income: 135000, expenses: 75000, profit: 60000 },
    { month: "Mar", income: 145000, expenses: 80000, profit: 65000 },
    { month: "Apr", income: 155000, expenses: 85000, profit: 70000 },
    { month: "May", income: 165000, expenses: 90000, profit: 75000 },
    { month: "Jun", income: 175000, expenses: 95000, profit: 80000 },
  ]

  const serviceData = [
    { name: "HVAC Repair", value: 35, color: "#3B82F6" },
    { name: "Installation", value: 25, color: "#10B981" },
    { name: "Maintenance", value: 20, color: "#F59E0B" },
    { name: "Emergency", value: 15, color: "#EF4444" },
    { name: "Consultation", value: 5, color: "#8B5CF6" },
  ]

  const employeePerformance = [
    { name: "John Smith", tasksCompleted: 28, revenue: 15000 },
    { name: "Sarah Johnson", tasksCompleted: 32, revenue: 18000 },
    { name: "Mike Wilson", tasksCompleted: 25, revenue: 12000 },
    { name: "Lisa Brown", tasksCompleted: 30, revenue: 16000 },
  ]

  const paymentStatusData = [
    { name: "Paid", value: 75, color: "#10B981" },
    { name: "Partial", value: 15, color: "#F59E0B" },
    { name: "Pending", value: 10, color: "#EF4444" },
  ]

  const exportReportToExcel = () => {
    // Create comprehensive report data
    const reportData = {
      summary: {
        month: selectedMonth,
        year: selectedYear,
        totalIncome: monthlyData.totalIncome,
        totalExpenses: monthlyData.expenses,
        netProfit: monthlyData.netProfit,
        servicesDone: monthlyData.servicesDone,
        productsSold: monthlyData.productsSold,
      },
      revenueData,
      employeePerformance,
      serviceDistribution: serviceData,
      paymentStatus: paymentStatusData,
    }

    // Create CSV content for comprehensive report
    const headers = [
      "Report Type",
      "Month",
      "Year",
      "Total Income",
      "Total Expenses",
      "Net Profit",
      "Services Done",
      "Products Sold",
      "Employee Name",
      "Tasks Completed",
      "Revenue Generated",
    ]

    const csvRows = [
      headers.join(","),
      // Summary row
      [
        "Summary",
        selectedMonth,
        selectedYear,
        monthlyData.totalIncome,
        monthlyData.expenses,
        monthlyData.netProfit,
        monthlyData.servicesDone,
        monthlyData.productsSold,
        "",
        "",
        "",
      ].join(","),
      // Employee performance rows
      ...employeePerformance.map((emp) =>
        [
          "Employee Performance",
          selectedMonth,
          selectedYear,
          "",
          "",
          "",
          "",
          "",
          `"${emp.name}"`,
          emp.tasksCompleted,
          emp.revenue,
        ].join(","),
      ),
      // Revenue data rows
      ...revenueData.map((rev) =>
        ["Monthly Revenue", rev.month, selectedYear, rev.income, rev.expenses, rev.profit, "", "", "", "", ""].join(
          ",",
        ),
      ),
    ]

    const csvContent = csvRows.join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `business_report_${selectedMonth}_${selectedYear}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="January">January</SelectItem>
              <SelectItem value="February">February</SelectItem>
              <SelectItem value="March">March</SelectItem>
              <SelectItem value="April">April</SelectItem>
              <SelectItem value="May">May</SelectItem>
              <SelectItem value="June">June</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full sm:w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReportToExcel} className="bg-green-600 hover:bg-green-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">${monthlyData.totalIncome.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">${monthlyData.netProfit.toLocaleString()}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Services Done</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{monthlyData.servicesDone}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{monthlyData.productsSold}</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +22% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Revenue Trends (6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="income" fill="#3B82F6" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="#10B981" name="Profit" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Service Distribution */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Service Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Payment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Performance */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Employee Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-4 pr-4">
              {employeePerformance.map((employee, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                    <p className="text-sm text-gray-600">{employee.tasksCompleted} tasks completed</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-lg">${employee.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Revenue generated</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Financial Summary - {selectedMonth} {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-gray-900">Income</h4>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-800 font-medium">Service Revenue</span>
                  <span className="font-bold text-green-700">${(monthlyData.totalIncome * 0.7).toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-800 font-medium">Product Sales</span>
                  <span className="font-bold text-blue-700">${(monthlyData.totalIncome * 0.3).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-3 bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-900">Total Income</span>
                  <span className="text-gray-900">${monthlyData.totalIncome.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-gray-900">Expenses</h4>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-red-800 font-medium">Employee Salaries</span>
                  <span className="font-bold text-red-700">${monthlyData.totalSalaries.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-orange-800 font-medium">Operational Costs</span>
                  <span className="font-bold text-orange-700">
                    ${(monthlyData.expenses - monthlyData.totalSalaries).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t pt-3 bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-900">Total Expenses</span>
                  <span className="text-gray-900">${monthlyData.expenses.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-green-800">Net Profit</span>
              <span className="text-3xl font-bold text-green-600">
                ${(monthlyData.totalIncome - monthlyData.expenses).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-green-700 mt-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Profit Margin:{" "}
              {(((monthlyData.totalIncome - monthlyData.expenses) / monthlyData.totalIncome) * 100).toFixed(1)}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
