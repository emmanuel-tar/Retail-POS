"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Shield, UserPlus, History, Key, Lock } from "lucide-react"

interface UserInterface {
  id: string
  userId: string
  name: string
  email: string
  role: "seller" | "supervisor" | "manager"
  permissions: string[]
  status: "active" | "inactive" | "locked"
  lastLogin: string
  createdAt: string
}

interface UserActivity {
  id: string
  userId: string
  action: string
  timestamp: string
  details: string
}

const AVAILABLE_PERMISSIONS = [
  { id: "sales", label: "Sales Processing", description: "Process sales transactions" },
  { id: "inventory", label: "Inventory Management", description: "Manage product inventory" },
  { id: "purchase", label: "Purchase Management", description: "Create and manage purchase orders" },
  { id: "reports", label: "View Reports", description: "Access sales and inventory reports" },
  { id: "user_management", label: "User Management", description: "Manage users and permissions" },
  { id: "settings", label: "System Settings", description: "Modify system configuration" },
  { id: "price_override", label: "Price Override", description: "Override product prices during sales" },
  { id: "discount_approval", label: "Discount Approval", description: "Approve large discounts" },
  { id: "void_transactions", label: "Void Transactions", description: "Cancel completed transactions" },
  { id: "cash_management", label: "Cash Management", description: "Manage cash drawer operations" },
  { id: "supplier_management", label: "Supplier Management", description: "Manage suppliers and orders" },
  { id: "customer_management", label: "Customer Management", description: "Manage customer information" },
]

const ROLE_PERMISSIONS = {
  seller: ["sales", "inventory"],
  supervisor: ["sales", "inventory", "reports", "price_override", "discount_approval", "cash_management"],
  manager: [
    "sales",
    "inventory",
    "purchase",
    "reports",
    "user_management",
    "settings",
    "price_override",
    "discount_approval",
    "void_transactions",
    "cash_management",
    "supplier_management",
    "customer_management",
  ],
}

export default function EnhancedUserManagement() {
  const [users, setUsers] = useState<UserInterface[]>([
    {
      id: "1",
      userId: "MGR001",
      name: "John Manager",
      email: "manager@pos.com",
      role: "manager",
      permissions: ROLE_PERMISSIONS.manager,
      status: "active",
      lastLogin: "2024-01-15 09:30",
      createdAt: "2023-12-01",
    },
    {
      id: "2",
      userId: "SUP001",
      name: "Jane Supervisor",
      email: "supervisor@pos.com",
      role: "supervisor",
      permissions: ROLE_PERMISSIONS.supervisor,
      status: "active",
      lastLogin: "2024-01-15 08:45",
      createdAt: "2023-12-05",
    },
    {
      id: "3",
      userId: "SEL001",
      name: "Bob Seller",
      email: "seller@pos.com",
      role: "seller",
      permissions: ROLE_PERMISSIONS.seller,
      status: "active",
      lastLogin: "2024-01-15 10:15",
      createdAt: "2023-12-10",
    },
    {
      id: "4",
      userId: "SEL002",
      name: "Alice Seller",
      email: "alice@pos.com",
      role: "seller",
      permissions: ROLE_PERMISSIONS.seller,
      status: "inactive",
      lastLogin: "2024-01-10 14:20",
      createdAt: "2023-12-15",
    },
    {
      id: "5",
      userId: "SUP002",
      name: "David Supervisor",
      email: "david@pos.com",
      role: "supervisor",
      permissions: ROLE_PERMISSIONS.supervisor,
      status: "locked",
      lastLogin: "2024-01-05 11:30",
      createdAt: "2023-12-20",
    },
  ])

  const [userActivities, setUserActivities] = useState<UserActivity[]>([
    {
      id: "1",
      userId: "MGR001",
      action: "Login",
      timestamp: "2024-01-15 09:30:15",
      details: "Successful login from 192.168.1.100",
    },
    {
      id: "2",
      userId: "SUP001",
      action: "Login",
      timestamp: "2024-01-15 08:45:22",
      details: "Successful login from 192.168.1.101",
    },
    {
      id: "3",
      userId: "SEL001",
      action: "Login",
      timestamp: "2024-01-15 10:15:05",
      details: "Successful login from 192.168.1.102",
    },
    {
      id: "4",
      userId: "MGR001",
      action: "User Created",
      timestamp: "2023-12-15 13:20:45",
      details: "Created user SEL002 (Alice Seller)",
    },
    {
      id: "5",
      userId: "MGR001",
      action: "Permission Changed",
      timestamp: "2024-01-12 14:30:10",
      details: "Added 'discount_approval' permission to SUP001",
    },
    {
      id: "6",
      userId: "SUP002",
      action: "Failed Login",
      timestamp: "2024-01-05 11:25:30",
      details: "Failed login attempt from 192.168.1.150",
    },
    {
      id: "7",
      userId: "SUP002",
      action: "Account Locked",
      timestamp: "2024-01-05 11:30:45",
      details: "Account locked after 3 failed login attempts",
    },
  ])

  const [activeTab, setActiveTab] = useState("users")
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<UserInterface | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null)
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    role: "seller" as "seller" | "supervisor" | "manager",
    permissions: [] as string[],
    password: "",
  })

  // Filter users based on search term, status, and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  // Filter activities based on selected user
  const filteredActivities = selectedUser
    ? userActivities.filter((activity) => activity.userId === selectedUser.userId)
    : userActivities

  const handleCreateUser = () => {
    setEditingUser(null)
    setFormData({
      userId: generateUserId("seller"),
      name: "",
      email: "",
      role: "seller",
      permissions: ROLE_PERMISSIONS.seller,
      password: "",
    })
    setShowUserDialog(true)
  }

  const handleEditUser = (user: UserInterface) => {
    setEditingUser(user)
    setFormData({
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      password: "",
    })
    setShowUserDialog(true)
  }

  const handleViewUserActivity = (user: UserInterface) => {
    setSelectedUser(user)
    setActiveTab("activity")
  }

  const handleResetPassword = (user: UserInterface) => {
    setSelectedUser(user)
    setShowResetPasswordDialog(true)
  }

  const handleRoleChange = (role: "seller" | "supervisor" | "manager") => {
    setFormData({
      ...formData,
      role,
      userId: editingUser ? formData.userId : generateUserId(role),
      permissions: ROLE_PERMISSIONS[role],
    })
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permissionId],
      })
    } else {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter((p) => p !== permissionId),
      })
    }
  }

  const handleSaveUser = () => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...formData } : user)))

      // Add activity log
      const newActivity: UserActivity = {
        id: Date.now().toString(),
        userId: "MGR001", // Assuming the current user is a manager
        action: "User Updated",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        details: `Updated user ${formData.userId} (${formData.name})`,
      }
      setUserActivities([newActivity, ...userActivities])
    } else {
      // Create new user
      const newUser: UserInterface = {
        id: Date.now().toString(),
        userId: formData.userId,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        permissions: formData.permissions,
        status: "active",
        lastLogin: "Never",
        createdAt: new Date().toISOString().split("T")[0],
      }
      setUsers([...users, newUser])

      // Add activity log
      const newActivity: UserActivity = {
        id: Date.now().toString(),
        userId: "MGR001", // Assuming the current user is a manager
        action: "User Created",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        details: `Created user ${formData.userId} (${formData.name})`,
      }
      setUserActivities([newActivity, ...userActivities])
    }
    setShowUserDialog(false)
  }

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find((u) => u.id === userId)
    setUsers(users.filter((user) => user.id !== userId))

    // Add activity log
    if (userToDelete) {
      const newActivity: UserActivity = {
        id: Date.now().toString(),
        userId: "MGR001", // Assuming the current user is a manager
        action: "User Deleted",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        details: `Deleted user ${userToDelete.userId} (${userToDelete.name})`,
      }
      setUserActivities([newActivity, ...userActivities])
    }
  }

  const handleToggleUserStatus = (user: UserInterface) => {
    const newStatus = user.status === "active" ? "inactive" : "active"
    setUsers(users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)))

    // Add activity log
    const newActivity: UserActivity = {
      id: Date.now().toString(),
      userId: "MGR001", // Assuming the current user is a manager
      action: "Status Changed",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      details: `Changed ${user.userId} status to ${newStatus}`,
    }
    setUserActivities([newActivity, ...userActivities])
  }

  const handleUnlockUser = (user: UserInterface) => {
    setUsers(users.map((u) => (u.id === user.id ? { ...u, status: "active" } : u)))

    // Add activity log
    const newActivity: UserActivity = {
      id: Date.now().toString(),
      userId: "MGR001", // Assuming the current user is a manager
      action: "Account Unlocked",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      details: `Unlocked account for ${user.userId} (${user.name})`,
    }
    setUserActivities([newActivity, ...userActivities])
  }

  const handlePasswordReset = () => {
    // In a real app, this would generate a new password or send a reset link

    // Add activity log
    if (selectedUser) {
      const newActivity: UserActivity = {
        id: Date.now().toString(),
        userId: "MGR001", // Assuming the current user is a manager
        action: "Password Reset",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        details: `Reset password for ${selectedUser.userId} (${selectedUser.name})`,
      }
      setUserActivities([newActivity, ...userActivities])
    }

    setShowResetPasswordDialog(false)
  }

  const generateUserId = (role: string) => {
    const prefix = role === "manager" ? "MGR" : role === "supervisor" ? "SUP" : "SEL"
    const usersWithSameRole = users.filter((u) => u.role === role)
    const nextNumber = usersWithSameRole.length + 1
    return `${prefix}${nextNumber.toString().padStart(3, "0")}`
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "manager":
        return "bg-purple-100 text-purple-800"
      case "supervisor":
        return "bg-blue-100 text-blue-800"
      case "seller":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "locked":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "Login":
        return "bg-green-100 text-green-800"
      case "Failed Login":
        return "bg-red-100 text-red-800"
      case "Account Locked":
        return "bg-red-100 text-red-800"
      case "User Created":
        return "bg-blue-100 text-blue-800"
      case "User Updated":
        return "bg-blue-100 text-blue-800"
      case "User Deleted":
        return "bg-orange-100 text-orange-800"
      case "Permission Changed":
        return "bg-purple-100 text-purple-800"
      case "Password Reset":
        return "bg-yellow-100 text-yellow-800"
      case "Status Changed":
        return "bg-blue-100 text-blue-800"
      case "Account Unlocked":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
        {activeTab === "users" ? (
          <Button onClick={handleCreateUser}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setActiveTab("users")}>
            Back to Users
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">System users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Locked Accounts</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.filter((u) => u.status === "locked").length}</div>
                <p className="text-xs text-muted-foreground">Require administrator action</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and their access levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Search by name, user ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="md:w-1/3"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="md:w-1/4">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="md:w-1/4">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono font-medium">{user.userId}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleViewUserActivity(user)}>
                            <History className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleResetPassword(user)}>
                            <Key className="h-4 w-4" />
                          </Button>
                          {user.status === "locked" ? (
                            <Button variant="outline" size="sm" onClick={() => handleUnlockUser(user)}>
                              <Lock className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => handleToggleUserStatus(user)}>
                              {user.status === "active" ? (
                                <span className="text-red-500">✓</span>
                              ) : (
                                <span className="text-green-500">✓</span>
                              )}
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {user.name} ({user.userId})? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>User Activity Log</CardTitle>
                  <CardDescription>
                    {selectedUser
                      ? `Activity history for ${selectedUser.name} (${selectedUser.userId})`
                      : "Recent activity for all users"}
                  </CardDescription>
                </div>
                {selectedUser && (
                  <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                    View All Users
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="whitespace-nowrap">{activity.timestamp}</TableCell>
                      <TableCell className="font-mono">{activity.userId}</TableCell>
                      <TableCell>
                        <Badge className={getActionColor(activity.action)}>{activity.action}</Badge>
                      </TableCell>
                      <TableCell>{activity.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Create New User"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update user information and permissions" : "Add a new user to the system"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="Enter user ID"
                  disabled={!!editingUser}
                  className="font-mono"
                />
                {!editingUser && (
                  <p className="text-xs text-muted-foreground">User ID is automatically generated based on role</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="password">Initial Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter initial password"
                />
                <p className="text-xs text-muted-foreground">User will be prompted to change password on first login</p>
              </div>
            )}

            <div className="space-y-4">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {AVAILABLE_PERMISSIONS.map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={permission.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>{editingUser ? "Update User" : "Create User"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              {selectedUser && `Reset password for ${selectedUser.name} (${selectedUser.userId})`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" placeholder="Enter new password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox id="forceChange" />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="forceChange">Require password change on next login</Label>
                <p className="text-xs text-muted-foreground">
                  User will be prompted to create a new password when they next log in
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowResetPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordReset}>Reset Password</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
