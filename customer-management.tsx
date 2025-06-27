"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Edit, Eye, Phone, Mail, MapPin, Calendar, TrendingUp, Star, Download, Trash2 } from "lucide-react"

interface CustomerAddress {
  id: string
  label: string
  address: string
  isDefault: boolean
}

interface Customer {
  id: string
  name: string
  email?: string
  phone: string
  addresses: CustomerAddress[]
  status: "active" | "inactive"
  totalComplaints: number
  resolvedComplaints: number
  totalSpent: number
  joinDate: string
  lastContactDate: string
  monthlyData: {
    [month: string]: {
      complaints: number
      paymentsReceived: number
      servicesCompleted: number
      totalSpent: number
      satisfaction: number
      lastContact: string
    }
  }
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "ABC Corporation",
      email: "contact@abc.com",
      phone: "+91 98765 43210",
      addresses: [
        { id: "1", label: "Head Office", address: "123 Business Ave, Mumbai, Maharashtra 400001", isDefault: true },
        {
          id: "2",
          label: "Branch Office",
          address: "456 Corporate Blvd, Mumbai, Maharashtra 400002",
          isDefault: false,
        },
      ],
      status: "active",
      totalComplaints: 8,
      resolvedComplaints: 7,
      totalSpent: 185000,
      joinDate: "2023-06-15",
      lastContactDate: "2024-01-15",
      monthlyData: {
        "2024-01": {
          complaints: 2,
          paymentsReceived: 35000,
          servicesCompleted: 2,
          totalSpent: 35000,
          satisfaction: 95,
          lastContact: "2024-01-15",
        },
        "2024-02": {
          complaints: 1,
          paymentsReceived: 12000,
          servicesCompleted: 1,
          totalSpent: 12000,
          satisfaction: 92,
          lastContact: "2024-02-10",
        },
        "2023-12": {
          complaints: 3,
          paymentsReceived: 48000,
          servicesCompleted: 3,
          totalSpent: 48000,
          satisfaction: 88,
          lastContact: "2023-12-20",
        },
      },
    },
    {
      id: "2",
      name: "XYZ Ltd",
      phone: "+91 87654 32109",
      addresses: [
        { id: "3", label: "Main Office", address: "789 Corporate Blvd, Delhi, Delhi 110001", isDefault: true },
      ],
      status: "inactive",
      totalComplaints: 5,
      resolvedComplaints: 5,
      totalSpent: 120000,
      joinDate: "2023-08-20",
      lastContactDate: "2023-11-15",
      monthlyData: {
        "2024-01": {
          complaints: 1,
          paymentsReceived: 45000,
          servicesCompleted: 1,
          totalSpent: 45000,
          satisfaction: 98,
          lastContact: "2024-01-05",
        },
        "2023-12": {
          complaints: 2,
          paymentsReceived: 28000,
          servicesCompleted: 2,
          totalSpent: 28000,
          satisfaction: 94,
          lastContact: "2023-12-15",
        },
        "2023-11": {
          complaints: 0,
          paymentsReceived: 0,
          servicesCompleted: 0,
          totalSpent: 0,
          satisfaction: 100,
          lastContact: "2023-11-15",
        },
      },
    },
  ])

  const [isAddingCustomer, setIsAddingCustomer] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedMonth, setSelectedMonth] = useState("2024-01")
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    addresses: [{ label: "Primary Address", address: "", isDefault: true }],
  })

  const [isEditingCustomer, setIsEditingCustomer] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const addCustomer = () => {
    const customer: Customer = {
      id: Date.now().toString(),
      ...newCustomer,
      addresses: newCustomer.addresses.map((addr, index) => ({
        id: Date.now().toString() + index,
        ...addr,
      })),
      status: "active",
      totalComplaints: 0,
      resolvedComplaints: 0,
      totalSpent: 0,
      joinDate: new Date().toISOString().split("T")[0],
      lastContactDate: new Date().toISOString().split("T")[0],
      monthlyData: {},
    }
    setCustomers([...customers, customer])
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      addresses: [{ label: "Primary Address", address: "", isDefault: true }],
    })
    setIsAddingCustomer(false)
  }

  const addAddress = () => {
    setNewCustomer({
      ...newCustomer,
      addresses: [...newCustomer.addresses, { label: "", address: "", isDefault: false }],
    })
  }

  const removeAddress = (index: number) => {
    if (newCustomer.addresses.length > 1) {
      setNewCustomer({
        ...newCustomer,
        addresses: newCustomer.addresses.filter((_, i) => i !== index),
      })
    }
  }

  const updateAddress = (index: number, field: string, value: string) => {
    const updatedAddresses = newCustomer.addresses.map((addr, i) => (i === index ? { ...addr, [field]: value } : addr))
    setNewCustomer({ ...newCustomer, addresses: updatedAddresses })
  }

  const exportToExcel = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Primary Address",
      "Status",
      "Total Complaints",
      "Resolved Complaints",
      "Total Spent",
      "Join Date",
      "Last Contact",
    ]

    const csvContent = [
      headers.join(","),
      ...customers.map((customer) =>
        [
          customer.id,
          `"${customer.name}"`,
          customer.email || "",
          customer.phone,
          `"${customer.addresses.find((a) => a.isDefault)?.address || ""}"`,
          customer.status,
          customer.totalComplaints,
          customer.resolvedComplaints,
          customer.totalSpent,
          customer.joinDate,
          customer.lastContactDate,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `customers_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getCustomerRating = (customer: Customer) => {
    const currentMonth = customer.monthlyData[selectedMonth]
    if (!currentMonth) return 0
    return currentMonth.satisfaction
  }

  const getCustomerTrend = (customer: Customer) => {
    const months = Object.keys(customer.monthlyData).sort()
    if (months.length < 2) return 0

    const current = customer.monthlyData[months[months.length - 1]]?.totalSpent || 0
    const previous = customer.monthlyData[months[months.length - 2]]?.totalSpent || 0

    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const getInactiveCustomers = () => {
    const currentDate = new Date()
    const threeMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 3))

    return customers.filter((customer) => {
      const lastContact = new Date(customer.lastContactDate)
      return lastContact < threeMonthsAgo
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage customer relationships and track service history</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={exportToExcel} variant="outline" className="bg-green-50 hover:bg-green-100 border-green-200">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-02">February 2024</SelectItem>
              <SelectItem value="2024-01">January 2024</SelectItem>
              <SelectItem value="2023-12">December 2023</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Customer Name *</Label>
                      <Input
                        id="name"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        placeholder="Enter customer name"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      placeholder="customer@example.com"
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-semibold">Customer Addresses</Label>
                      <Button type="button" onClick={addAddress} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Address
                      </Button>
                    </div>

                    {newCustomer.addresses.map((address, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <Label className="font-medium">Address {index + 1}</Label>
                          {newCustomer.addresses.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeAddress(index)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`label-${index}`}>Address Label</Label>
                            <Input
                              id={`label-${index}`}
                              value={address.label}
                              onChange={(e) => updateAddress(index, "label", e.target.value)}
                              placeholder="e.g., Head Office, Home, Branch"
                              className="focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`address-${index}`}>Full Address *</Label>
                            <Textarea
                              id={`address-${index}`}
                              value={address.address}
                              onChange={(e) => updateAddress(index, "address", e.target.value)}
                              placeholder="Enter complete address including city, state, and pin code"
                              rows={3}
                              className="focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`default-${index}`}
                              checked={address.isDefault}
                              onChange={(e) => {
                                const updatedAddresses = newCustomer.addresses.map((addr, i) => ({
                                  ...addr,
                                  isDefault: i === index ? e.target.checked : false,
                                }))
                                setNewCustomer({ ...newCustomer, addresses: updatedAddresses })
                              }}
                              className="w-4 h-4 text-blue-600"
                            />
                            <Label htmlFor={`default-${index}`} className="text-sm">
                              Set as default address
                            </Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Customer Information</h4>
                    <p className="text-sm text-blue-700">
                      You can add multiple addresses for a single customer. This is useful when customers need services
                      at different locations.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsAddingCustomer(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={addCustomer} className="flex-1">
                      Add Customer
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Inactive Customers Alert */}
      {getInactiveCustomers().length > 0 && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-orange-800">
                {getInactiveCustomers().length} customers haven't been contacted in the last 3 months
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {customers.map((customer) => {
          const monthlyData = customer.monthlyData[selectedMonth]
          const trend = getCustomerTrend(customer)
          const rating = getCustomerRating(customer)
          const isInactive = getInactiveCustomers().some((c) => c.id === customer.id)

          return (
            <Card
              key={customer.id}
              className={`bg-white shadow-sm border hover:shadow-lg transition-all duration-200 ${
                isInactive ? "border-orange-300 bg-orange-50/30" : "border-gray-200"
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">{customer.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Customer since {new Date(customer.joinDate).toLocaleDateString()}
                    </p>
                    {isInactive && (
                      <Badge variant="outline" className="mt-2 border-orange-300 text-orange-700 bg-orange-50">
                        Inactive since 3+ months
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
                    {rating > 0 && (
                      <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{rating}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-3">
                  {customer.email && (
                    <div className="flex items-center gap-3 text-sm text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span className="truncate font-medium">{customer.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <Phone className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="font-medium">{customer.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="p-1.5 bg-purple-100 rounded-lg mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <span className="line-clamp-2 font-medium leading-relaxed">
                        {customer.addresses.find((a) => a.isDefault)?.address || customer.addresses[0]?.address}
                      </span>
                      {customer.addresses.length > 1 && (
                        <span className="text-xs text-purple-600 mt-1 block">
                          +{customer.addresses.length - 1} more address{customer.addresses.length > 2 ? "es" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Monthly Data */}
                {monthlyData && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-blue-900 text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {selectedMonth.split("-")[1]}/{selectedMonth.split("-")[0]} Data
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="text-center bg-white/70 p-3 rounded-lg">
                        <div className="text-lg font-bold text-red-600">{monthlyData.complaints}</div>
                        <div className="text-red-700 font-medium">Complaints</div>
                      </div>
                      <div className="text-center bg-white/70 p-3 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{monthlyData.servicesCompleted}</div>
                        <div className="text-green-700 font-medium">Services</div>
                      </div>
                      <div className="text-center col-span-2 bg-white/70 p-3 rounded-lg">
                        <div className="text-xl font-bold text-purple-600">
                          ₹{monthlyData.totalSpent.toLocaleString()}
                        </div>
                        <div className="text-purple-700 font-medium">Monthly Spending</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div className="text-xl font-bold text-blue-600">{customer.totalComplaints}</div>
                    <div className="text-xs text-gray-600 font-medium">Total Issues</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div className="text-xl font-bold text-green-600">{customer.resolvedComplaints}</div>
                    <div className="text-xs text-gray-600 font-medium">Resolved</div>
                  </div>
                </div>

                {/* Lifetime Value */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-800">Lifetime Value</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-600">₹{customer.totalSpent.toLocaleString()}</span>
                      {trend !== 0 && (
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <TrendingUp className={`w-3 h-3 ${trend > 0 ? "text-green-500" : "text-red-500"}`} />
                          <span className={trend > 0 ? "text-green-600" : "text-red-600"}>
                            {Math.abs(trend).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-blue-50 hover:border-blue-200 bg-transparent"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle className="text-xl">{customer.name} - Customer Profile</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="max-h-[calc(90vh-120px)]">
                        <Tabs defaultValue="overview" className="w-full">
                          <TabsList className="grid w-full grid-cols-4 mb-6">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="addresses">Addresses</TabsTrigger>
                            <TabsTrigger value="monthly">Monthly Data</TabsTrigger>
                            <TabsTrigger value="history">Service History</TabsTrigger>
                          </TabsList>

                          <TabsContent value="overview" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                  <Label className="text-sm font-semibold text-gray-700">Customer Name</Label>
                                  <p className="text-sm font-medium text-gray-800 mt-1">{customer.name}</p>
                                </div>
                                {customer.email && (
                                  <div className="bg-gray-50 p-4 rounded-xl">
                                    <Label className="text-sm font-semibold text-gray-700">Email</Label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{customer.email}</p>
                                  </div>
                                )}
                                <div className="bg-gray-50 p-4 rounded-xl">
                                  <Label className="text-sm font-semibold text-gray-700">Phone</Label>
                                  <p className="text-sm font-medium text-gray-800 mt-1">{customer.phone}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                  <Label className="text-sm font-semibold text-gray-700">Join Date</Label>
                                  <p className="text-sm font-medium text-gray-800 mt-1">
                                    {new Date(customer.joinDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                  <Label className="text-sm font-semibold text-gray-700">Status</Label>
                                  <Badge
                                    variant={customer.status === "active" ? "default" : "secondary"}
                                    className="ml-2 mt-1"
                                  >
                                    {customer.status}
                                  </Badge>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                                  <CardContent className="p-6">
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                      <div>
                                        <div className="text-3xl font-bold text-blue-600">
                                          {customer.totalComplaints}
                                        </div>
                                        <p className="text-xs text-blue-700 font-medium mt-1">Total Issues</p>
                                      </div>
                                      <div>
                                        <div className="text-3xl font-bold text-green-600">
                                          {customer.resolvedComplaints}
                                        </div>
                                        <p className="text-xs text-green-700 font-medium mt-1">Resolved</p>
                                      </div>
                                      <div className="col-span-2 pt-4 border-t border-blue-200">
                                        <div className="text-4xl font-bold text-purple-600">
                                          ₹{customer.totalSpent.toLocaleString()}
                                        </div>
                                        <p className="text-xs text-purple-700 font-medium mt-1">Total Spent</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                                  <CardContent className="p-6">
                                    <div className="text-center">
                                      <div className="text-3xl font-bold text-yellow-600">
                                        {customer.resolvedComplaints > 0
                                          ? Math.round((customer.resolvedComplaints / customer.totalComplaints) * 100)
                                          : 0}
                                        %
                                      </div>
                                      <p className="text-xs text-yellow-700 font-medium mt-1">Resolution Rate</p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="addresses" className="space-y-4">
                            <div className="grid gap-4">
                              {customer.addresses.map((address) => (
                                <Card key={address.id} className="border-gray-200">
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-semibold text-gray-900">{address.label}</h4>
                                      {address.isDefault && (
                                        <Badge
                                          variant="outline"
                                          className="border-green-300 text-green-700 bg-green-50"
                                        >
                                          Default
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600">{address.address}</p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </TabsContent>

                          <TabsContent value="monthly" className="space-y-6">
                            <div className="space-y-6">
                              {Object.entries(customer.monthlyData)
                                .sort(([a], [b]) => b.localeCompare(a))
                                .map(([month, data]) => (
                                  <Card key={month} className="border-gray-200 shadow-sm">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                                      <CardTitle className="text-lg flex items-center justify-between">
                                        <span className="font-bold text-gray-800">
                                          {new Date(month + "-01").toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric",
                                          })}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className={`${data.satisfaction >= 90 ? "border-green-300 text-green-700 bg-green-50" : data.satisfaction >= 80 ? "border-yellow-300 text-yellow-700 bg-yellow-50" : "border-red-300 text-red-700 bg-red-50"} px-3 py-1 rounded-full font-semibold`}
                                        >
                                          {data.satisfaction}% satisfaction
                                        </Badge>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                        <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                                          <div className="text-2xl font-bold text-red-600">{data.complaints}</div>
                                          <p className="text-xs text-red-700 font-medium mt-1">Complaints</p>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                                          <div className="text-2xl font-bold text-green-600">
                                            {data.servicesCompleted}
                                          </div>
                                          <p className="text-xs text-green-700 font-medium mt-1">Services</p>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                          <div className="text-2xl font-bold text-blue-600">
                                            ₹{data.paymentsReceived.toLocaleString()}
                                          </div>
                                          <p className="text-xs text-blue-700 font-medium mt-1">Payments</p>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                                          <div className="text-2xl font-bold text-purple-600">
                                            ₹{data.totalSpent.toLocaleString()}
                                          </div>
                                          <p className="text-xs text-purple-700 font-medium mt-1">Total Spent</p>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                                          <div className="text-2xl font-bold text-yellow-600">{data.satisfaction}%</div>
                                          <p className="text-xs text-yellow-700 font-medium mt-1">Satisfaction</p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                            </div>
                          </TabsContent>

                          <TabsContent value="history" className="space-y-4">
                            <div className="space-y-4">
                              {[
                                {
                                  id: "s1",
                                  date: "2024-01-15",
                                  service: "AC Repair - Compressor Replacement",
                                  technician: "John Smith",
                                  amount: 8500,
                                  status: "completed",
                                },
                                {
                                  id: "s2",
                                  date: "2024-01-08",
                                  service: "HVAC Maintenance",
                                  technician: "Sarah Johnson",
                                  amount: 2000,
                                  status: "completed",
                                },
                                {
                                  id: "s3",
                                  date: "2023-12-20",
                                  service: "Emergency AC Repair",
                                  technician: "John Smith",
                                  amount: 4500,
                                  status: "completed",
                                },
                              ].map((service) => (
                                <Card key={service.id} className="border-gray-200 hover:shadow-md transition-shadow">
                                  <CardContent className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                      <div className="space-y-2">
                                        <h4 className="font-bold text-gray-800 text-lg">{service.service}</h4>
                                        <p className="text-sm text-gray-600 font-medium">
                                          Technician: {service.technician}
                                        </p>
                                        <p className="text-xs text-gray-500 flex items-center gap-2">
                                          <Calendar className="w-3 h-3" />
                                          {new Date(service.date).toLocaleDateString()}
                                        </p>
                                      </div>
                                      <div className="text-right space-y-2">
                                        <p className="text-2xl font-bold text-green-600">
                                          ₹{service.amount.toLocaleString()}
                                        </p>
                                        <Badge
                                          variant="outline"
                                          className="border-green-300 text-green-700 bg-green-50 px-3 py-1 rounded-full font-semibold"
                                        >
                                          {service.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:bg-green-50 hover:border-green-200 bg-transparent"
                    onClick={() => {
                      setEditingCustomer(customer)
                      setIsEditingCustomer(true)
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditingCustomer} onOpenChange={setIsEditingCustomer}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editName">Customer Name *</Label>
                    <Input
                      id="editName"
                      value={editingCustomer.name}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editPhone">Phone Number *</Label>
                    <Input
                      id="editPhone"
                      value={editingCustomer.phone}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email Address (Optional)</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editingCustomer.email || ""}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editStatus">Status</Label>
                  <Select
                    value={editingCustomer.status}
                    onValueChange={(value) => setEditingCustomer({ ...editingCustomer, status: value as any })}
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

                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Customer Addresses</Label>
                  {editingCustomer.addresses.map((address, index) => (
                    <div key={address.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`edit-label-${index}`}>Address Label</Label>
                          <Input
                            id={`edit-label-${index}`}
                            value={address.label}
                            onChange={(e) => {
                              const updatedAddresses = editingCustomer.addresses.map((addr, i) =>
                                i === index ? { ...addr, label: e.target.value } : addr,
                              )
                              setEditingCustomer({ ...editingCustomer, addresses: updatedAddresses })
                            }}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-address-${index}`}>Full Address</Label>
                          <Textarea
                            id={`edit-address-${index}`}
                            value={address.address}
                            onChange={(e) => {
                              const updatedAddresses = editingCustomer.addresses.map((addr, i) =>
                                i === index ? { ...addr, address: e.target.value } : addr,
                              )
                              setEditingCustomer({ ...editingCustomer, addresses: updatedAddresses })
                            }}
                            rows={3}
                            className="focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`edit-default-${index}`}
                            checked={address.isDefault}
                            onChange={(e) => {
                              const updatedAddresses = editingCustomer.addresses.map((addr, i) => ({
                                ...addr,
                                isDefault: i === index ? e.target.checked : false,
                              }))
                              setEditingCustomer({ ...editingCustomer, addresses: updatedAddresses })
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <Label htmlFor={`edit-default-${index}`} className="text-sm">
                            Set as default address
                          </Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-900 mb-2">Update Information</h4>
                  <p className="text-sm text-yellow-700">
                    Changes will be saved immediately. Make sure all information is accurate before updating.
                  </p>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingCustomer(false)
                      setEditingCustomer(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setCustomers(customers.map((c) => (c.id === editingCustomer.id ? editingCustomer : c)))
                      setIsEditingCustomer(false)
                      setEditingCustomer(null)
                    }}
                    className="flex-1"
                  >
                    Update Customer
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
