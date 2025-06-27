"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, DollarSign, ClipboardList, TrendingUp, AlertCircle, MapPin, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import EmployeeManagement from "./components/employee-management"
import CustomerManagement from "./components/customer-management"
import ComplaintManagement from "./components/complaint-management"
import LeaveManagement from "./components/leave-management"
import SalaryManagement from "./components/salary-management"
import Reports from "./components/reports"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Mock data for dashboard stats
  const dashboardStats = {
    totalEmployees: 25,
    activeEmployees: 23,
    totalCustomers: 150,
    pendingComplaints: 12,
    completedTasks: 45,
    monthlyRevenue: 125000,
    pendingPayments: 15000,
    totalSalaries: 85000,
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "employees", label: "Employees", icon: "👥" },
    { id: "customers", label: "Customers", icon: "🏢" },
    { id: "complaints", label: "Tasks", icon: "🔧" },
    { id: "leaves", label: "Leaves", icon: "📅" },
    { id: "salary", label: "Salary", icon: "💰" },
    { id: "reports", label: "Reports", icon: "📈" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="lg:hidden mr-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AC Service Pro</h1>
                <p className="text-sm text-gray-500 hidden sm:block">Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-medium">Online</span>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:transition-none`}
        >
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            <div className="flex-1 px-4 py-6 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
                      <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalEmployees}</div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full mr-1"></div>
                        {dashboardStats.activeEmployees} active
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
                      <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalCustomers}</div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12% this month
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">
                        ${dashboardStats.monthlyRevenue.toLocaleString()}
                      </div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +8% this month
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Active Tasks</CardTitle>
                      <ClipboardList className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{dashboardStats.pendingComplaints}</div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full mr-1"></div>
                        {dashboardStats.completedTasks} completed
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Activity and Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="bg-white shadow-sm border border-gray-200">
                      <CardHeader className="border-b border-gray-100">
                        <CardTitle className="flex items-center text-gray-900">
                          <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {[
                            {
                              message: "John completed AC installation at ABC Corp",
                              time: "2 min ago",
                              type: "success",
                            },
                            { message: "New customer Sarah Wilson registered", time: "5 min ago", type: "info" },
                            { message: "Payment received from XYZ Ltd - $2,500", time: "10 min ago", type: "success" },
                            {
                              message: "Leave request from Mike pending approval",
                              time: "15 min ago",
                              type: "warning",
                            },
                            { message: "Task assigned to Sarah - Emergency repair", time: "20 min ago", type: "info" },
                          ].map((activity, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div
                                className={`w-2 h-2 rounded-full mt-2 ${
                                  activity.type === "success"
                                    ? "bg-green-500"
                                    : activity.type === "warning"
                                      ? "bg-yellow-500"
                                      : "bg-blue-500"
                                }`}
                              ></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card className="bg-white shadow-sm border border-gray-200">
                      <CardHeader className="border-b border-gray-100">
                        <CardTitle className="flex items-center text-gray-900">
                          <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                          Quick Stats
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Pending Payments</span>
                          <span className="font-bold text-red-600">
                            ${dashboardStats.pendingPayments.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Monthly Salaries</span>
                          <span className="font-bold text-blue-600">
                            ${dashboardStats.totalSalaries.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Tasks Completed</span>
                          <span className="font-bold text-green-600">{dashboardStats.completedTasks}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Active Employees</span>
                          <span className="font-bold text-purple-600">{dashboardStats.activeEmployees}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900 text-white shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2" />
                          Live Tracking
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Employees Online</span>
                            <span className="text-lg font-bold">{dashboardStats.activeEmployees}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">On Field</span>
                            <span className="text-lg font-bold">18</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                          </div>
                          <p className="text-xs text-gray-400">78% field coverage active</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "employees" && <EmployeeManagement />}
            {activeTab === "customers" && <CustomerManagement />}
            {activeTab === "complaints" && <ComplaintManagement />}
            {activeTab === "leaves" && <LeaveManagement />}
            {activeTab === "salary" && <SalaryManagement />}
            {activeTab === "reports" && <Reports />}
          </div>
        </main>
      </div>
    </div>
  )
}
