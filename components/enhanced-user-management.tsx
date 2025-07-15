"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Search, Shield } from "lucide-react"

interface User {
  id: string
  username: string
  email: string
  role: string
  status: "active" | "inactive"
  created_at: string
  last_login?: string
}

const roles = [
  { value: "admin", label: "Administrator", permissions: ["all"] },
  { value: "manager", label: "Manager", permissions: ["sales", "inventory", "reports", "purchases"] },
  { value: "cashier", label: "Cashier", permissions: ["sales", "inventory"] },
]

export default function EnhancedUserManagement() {
  const { toast } = useToast()

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      username: "admin",
      email: "admin@pos.com",
      role: "admin",
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      last_login: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      username: "cashier1",
      email: "cashier1@pos.com",
      role: "cashier",
      status: "active",
      created_at: "2024-01-02T00:00:00Z",
      last_login: "2024-01-15T09:15:00Z",
    },
    {
      id: "3",
      username: "manager1",
      email: "manager1@pos.com",
      role: "manager",
      status: "active",
      created_at: "2024-01-03T00:00:00Z",
      last_login: "2024-01-14T16:45:00Z",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<Partial<User>>({})

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = () => {
    setFormData({ status: "active" })
    setEditingUser(null)
    setIsAddDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setFormData(user)
    setEditingUser(user)
    setIsAddDialogOpen(true)
  }

  const handleSaveUser = () => {
    if (!formData.username || !formData.email || !formData.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (editingUser) {
      // Update existing user
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...editingUser, ...formData } : u)))
      toast({
        title: "User Updated",
        description: `${formData.username} has been updated successfully.`,
      })
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        username: formData.username || "",
        email: formData.email || "",
        role: formData.role || "cashier",
        status: formData.status || "active",
        created_at: new Date().toISOString(),
      }
      setUsers((prev) => [...prev, newUser])
      toast({
        title: "User Added",
        description: `${newUser.username} has been added successfully.`,
      })
    }

    setIsAddDialogOpen(false)
    setFormData({})
    setEditingUser(null)
  }

  const handleDeleteUser = (user: User) => {
    if (user.role === "admin" && users.filter((u) => u.role === "admin").length === 1) {
      toast({
        title: "Cannot Delete",
        description: "Cannot delete the last administrator account.",
        variant: "destructive",
      })
      return
    }

    setUsers((prev) => prev.filter((u) => u.id !== user.id))
    toast({
      title: "User Deleted",
      description: `${user.username} has been removed.`,
    })
  }

  const toggleUserStatus = (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active"
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)))
    toast({
      title: "Status Updated",
      description: `${user.username} is now ${newStatus}.`,
    })
  }

  const getRoleInfo = (roleValue: string) => {
    return roles.find((role) => role.value === roleValue) || roles[2]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-green-500 rounded-full" />
              <div>
                <p className="text-sm font-medium">Active Users</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-red-500 rounded-full" />
              <div>
                <p className="text-sm font-medium">Administrators</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-yellow-500 rounded-full" />
              <div>
                <p className="text-sm font-medium">Cashiers</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.role === "cashier").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users by username, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {getRoleInfo(user.role).label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleUserStatus(user)}>
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username || ""}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role || ""} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || "active"}
                onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>{editingUser ? "Update User" : "Add User"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
