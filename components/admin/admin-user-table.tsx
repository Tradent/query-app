"use client"

import { useState } from "react"
import { MoreHorizontal, UserPlus, Download, Trash, PenLine, Shield, Ban } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

// Sample user data
const users = [
  {
    id: "u_1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Admin",
    status: "Active",
    lastActive: "2 minutes ago",
    verifications: 128,
    validations: 45,
    joinDate: "Jan 15, 2023",
    avatar: "/placeholder-xhswx.png",
    initials: "AJ",
  },
  {
    id: "u_2",
    name: "Sarah Miller",
    email: "sarah.miller@example.com",
    role: "Moderator",
    status: "Active",
    lastActive: "1 hour ago",
    verifications: 89,
    validations: 32,
    joinDate: "Feb 3, 2023",
    avatar: "/placeholder-moqss.png",
    initials: "SM",
  },
  {
    id: "u_3",
    name: "David Chen",
    email: "david.chen@example.com",
    role: "Validator",
    status: "Active",
    lastActive: "3 hours ago",
    verifications: 215,
    validations: 178,
    joinDate: "Nov 22, 2022",
    avatar: "/placeholder-rabmd.png",
    initials: "DC",
  },
  {
    id: "u_4",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    role: "User",
    status: "Inactive",
    lastActive: "2 days ago",
    verifications: 42,
    validations: 0,
    joinDate: "Mar 8, 2023",
    avatar: "/placeholder-jrb9s.png",
    initials: "EW",
  },
  {
    id: "u_5",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "User",
    status: "Suspended",
    lastActive: "1 month ago",
    verifications: 17,
    validations: 5,
    joinDate: "Dec 12, 2022",
    avatar: "/placeholder-tihl4.png",
    initials: "MB",
  },
  {
    id: "u_6",
    name: "Jennifer Lee",
    email: "jennifer.lee@example.com",
    role: "Moderator",
    status: "Active",
    lastActive: "5 hours ago",
    verifications: 76,
    validations: 28,
    joinDate: "Apr 19, 2023",
    avatar: "/placeholder-gsnqv.png",
    initials: "JL",
  },
  {
    id: "u_7",
    name: "Robert Garcia",
    email: "robert.garcia@example.com",
    role: "Validator",
    status: "Active",
    lastActive: "Just now",
    verifications: 132,
    validations: 98,
    joinDate: "Feb 28, 2023",
    avatar: "/placeholder-ntyq5.png",
    initials: "RG",
  },
]

export function AdminUserTable() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const isAllSelected = selectedUsers.length === filteredUsers.length
  const isPartiallySelected = selectedUsers.length > 0 && !isAllSelected

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  const toggleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex items-center gap-2">
            {selectedUsers.length > 0 && (
              <>
                <Button variant="outline" size="sm" className="h-9">
                  <Ban className="mr-2 h-4 w-4" />
                  Suspend
                </Button>
                <Button variant="outline" size="sm" className="h-9">
                  <Shield className="mr-2 h-4 w-4" />
                  Change Role
                </Button>
                <Button variant="destructive" size="sm" className="h-9">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Export Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PenLine className="mr-2 h-4 w-4" />
                      Edit Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            <Button className="h-9">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isPartiallySelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all users"
                  />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Last Active</TableHead>
                <TableHead className="hidden lg:table-cell">Verifications</TableHead>
                <TableHead className="hidden lg:table-cell">Validations</TableHead>
                <TableHead className="hidden md:table-cell">Join Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleSelectUser(user.id)}
                      aria-label={`Select ${user.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "Admin"
                          ? "default"
                          : user.role === "Moderator"
                            ? "secondary"
                            : user.role === "Validator"
                              ? "outline"
                              : "secondary"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "Active" ? "default" : user.status === "Inactive" ? "secondary" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm">{user.lastActive}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm">{user.verifications}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm">{user.validations}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm">{user.joinDate}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit user</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Change role</DropdownMenuItem>
                        <DropdownMenuItem>Reset password</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Suspend user</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
