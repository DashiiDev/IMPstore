"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  role: "dev" | "booster" | "customer"
  email: string
  isBanned: boolean
  selectedGame?: string
}

export default function DevPanel() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isDev, setIsDev] = useState(false)
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "chats" | "financials">("dashboard")
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Rosa", role: "booster", email: "rosa@booster.com", isBanned: false, selectedGame: "rocket-league" },
    { id: "2", name: "Booster2", role: "booster", email: "booster2@test.com", isBanned: false, selectedGame: "rocket-league-sideswipe" },
    { id: "3", name: "Customer1", role: "customer", email: "customer1@gmail.com", isBanned: false },
  ])
  const [totalRevenue, setTotalRevenue] = useState(1250.50)
  const [banInput, setBanInput] = useState("")
  const [newUserRole, setNewUserRole] = useState<"booster" | "dev">("booster")
  const [newUserName, setNewUserName] = useState("")

  useEffect(() => {
    const devStatus = localStorage.getItem("isDev")
    if (devStatus !== "true") {
      router.push("/")
    } else {
      setIsDev(true)
    }
  }, [router])

  const handleBanUser = () => {
    if (!banInput.trim()) return
    
    const updatedUsers = users.map(user => 
      user.name.toLowerCase() === banInput.toLowerCase() 
        ? { ...user, isBanned: true }
        : user
    )
    setUsers(updatedUsers)
    setBanInput("")
    alert(`User "${banInput}" has been banned`)
  }

  const handleUnbanUser = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isBanned: false } : user
    )
    setUsers(updatedUsers)
  }

  const handleAddUser = () => {
    if (!newUserName.trim()) return
    
    const newUser: User = {
      id: Date.now().toString(),
      name: newUserName,
      role: newUserRole,
      email: `${newUserName.toLowerCase()}@example.com`,
      isBanned: false,
    }
    
    setUsers([...users, newUser])
    setNewUserName("")
    alert(`User "${newUserName}" added as ${newUserRole}`)
  }

  const handleRemoveUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId)
    setUsers(updatedUsers)
  }

  const handleChangeRole = (userId: string, newRole: "dev" | "booster" | "customer") => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    )
    setUsers(updatedUsers)
  }

  if (!isDev) {
    return (
      <div className="min-h-screen bg-[#313338] flex items-center justify-center">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#313338]">
      {/* Header */}
      <div className="h-12 bg-[#313338] border-b border-[#1f2023] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white transition-colors">
            ← Back
          </button>
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-xl">
            DEV PANEL
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            👑
          </div>
          <span className="text-white font-semibold">{session?.user?.name}</span>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#2b2d31] min-h-screen p-4 border-r border-[#1f2023]">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "dashboard" ? "bg-[#404249] text-white" : "text-gray-400 hover:bg-[#404249] hover:text-white"
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "users" ? "bg-[#404249] text-white" : "text-gray-400 hover:bg-[#404249] hover:text-white"
              }`}
            >
              👥 User Management
            </button>
            <button
              onClick={() => setActiveTab("chats")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "chats" ? "bg-[#404249] text-white" : "text-gray-400 hover:bg-[#404249] hover:text-white"
              }`}
            >
              💬 All Chats
            </button>
            <button
              onClick={() => setActiveTab("financials")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "financials" ? "bg-[#404249] text-white" : "text-gray-400 hover:bg-[#404249] hover:text-white"
              }`}
            >
              💰 Financials
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#2b2d31] rounded-lg p-6 border border-[#1f2023]">
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mt-2">
                    ${totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="bg-[#2b2d31] rounded-lg p-6 border border-[#1f2023]">
                  <p className="text-gray-400 text-sm">Active Orders</p>
                  <p className="text-3xl font-bold text-white mt-2">12</p>
                </div>
                <div className="bg-[#2b2d31] rounded-lg p-6 border border-[#1f2023]">
                  <p className="text-gray-400 text-sm">Active Boosters</p>
                  <p className="text-3xl font-bold text-white mt-2">{users.filter(u => u.role === "booster").length}</p>
                </div>
                <div className="bg-[#2b2d31] rounded-lg p-6 border border-[#1f2023]">
                  <p className="text-gray-400 text-sm">Banned Users</p>
                  <p className="text-3xl font-bold text-red-400 mt-2">{users.filter(u => u.isBanned).length}</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-[#2b2d31] rounded-lg p-6 border border-[#1f2023]">
                <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-[#1f2023] rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <p className="text-gray-300 text-sm">New order #1234 - Customer1 - $50.00</p>
                    <p className="text-gray-500 text-xs ml-auto">2 min ago</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#1f2023] rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <p className="text-gray-300 text-sm">Rosa completed order #1233</p>
                    <p className="text-gray-500 text-xs ml-auto">15 min ago</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#1f2023] rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <p className="text-gray-300 text-sm">New booster application: Booster3</p>
                    <p className="text-gray-500 text-xs ml-auto">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
              
              {/* Ban User */}
              <div className="bg-[#2b2d31] rounded-lg p-6 border border-[#1f2023]">
                <h3 className="text-white font-semibold mb-4">Ban User</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={banInput}
                    onChange={(e) => setBanInput(e.target.value)}
                    placeholder="Enter username (Google or Discord)"
                    className="flex-1 bg-[#1f2023] text-white px-4 py-3 rounded-lg border border-[#404249] focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    onClick={handleBanUser}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Ban User
                  </button>
                </div>
              </div>

              {/* Add User */}
              <div className="bg-[#2b2d31] rounded-lg p-6 border border-[#1f2023]">
                <h3 className="text-white font-semibold mb-4">Add New User</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter username"
                    className="flex-1 bg-[#1f2023] text-white px-4 py-3 rounded-lg border border-[#404249] focus:border-purple-500 focus:outline-none"
                  />
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as "booster" | "dev")}
                    className="bg-[#1f2023] text-white px-4 py-3 rounded-lg border border-[#404249] focus:border-purple-500 focus:outline-none"
                  >
                    <option value="booster">Booster</option>
                    <option value="dev">Dev</option>
                  </select>
                  <button
                    onClick={handleAddUser}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Add User
                  </button>
                </div>
              </div>

              {/* Users List */}
              <div className="bg-[#2b2d31] rounded-lg p-6 border border-[#1f2023]">
                <h3 className="text-white font-semibold mb-4">All Users</h3>
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-[#1f2023] rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          user.role === "dev" ? "bg-gradient-to-r from-pink-500 to-purple-600" :
                          user.role === "booster" ? "bg-gradient-to-r from-red-500 to-red-700" :
                          "bg-purple-600"
                        }`}>
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{user.name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold text-white rounded-md ${
                          user.role === "dev" ? "bg-gradient-to-r from-pink-500 to-purple-600" :
                          user.role === "booster" ? "bg-gradient-to-r from-red-500 to-red-700" :
                          "bg-purple-600"
                        }`}>
                          {user.role.toUpperCase()}
                        </span>
                        {user.isBanned && (
                          <span className="px-3 py-1 text-xs font-bold text-white bg-red-600 rounded-md">
                            BANNED
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role}
                          onChange={(e) => handleChangeRole(user.id, e.target.value as "dev" | "booster" | "customer")}
                          className="bg-[#404249] text-white px-3 py-2 rounded-lg border border-[#404249] focus:border-purple-500 focus:outline-none text-sm"
                        >
                          <option value="customer">Customer</option>
                          <option value="booster">Booster</option>
                          <option value="dev">Dev</option>
                        </select>
                        {user.isBanned ? (
                          <button
                            onClick={() => handleUnbanUser(user.id)}
                            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRemoveUser(user.id)}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "chats" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">All Chats</h2>
              <div className="bg-[#2b2d31] rounded-lg p-6 border border-[#1f2023]">
                <p className="text-gray-400">Access all customer chats, staff chats, and booster communications</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-4 p-4 bg-[#1f2023] rounded-lg cursor-pointer hover:bg-[#404249] transition-colors">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">C</div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">Customer Support #1</p>
                      <p className="text-gray-400 text-sm">Last message: 5 min ago</p>
                    </div>
                    <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">Active</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-[#1f2023] rounded-lg cursor-pointer hover:bg-[#404249] transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">S</div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">Staff Chat</p>
                      <p className="text-gray-400 text-sm">Last message: 1 hour ago</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full">Staff</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-[#1f2023] rounded-lg cursor-pointer hover:bg-[#404249] transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold">B</div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">Booster Internal Chat</p>
                      <p className="text-gray-400 text-sm">Last message: 2 hours ago</p>
                    </div>
                    <span className="px-3 py-1 bg-red-600 text-white text-xs rounded-full">Booster</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "financials" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Financial Overview</h2>
              <div className="bg-[#2b2d31] rounded-lg p-6 border border-[#1f2023]">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mt-2">
                      ${totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">This Month</p>
                    <p className="text-4xl font-bold text-white mt-2">$850.00</p>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-gray-400 text-sm mb-4">Recent Transactions</p>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-[#1f2023] rounded-lg">
                      <span className="text-white">Order #1234</span>
                      <span className="text-green-400">+$50.00</span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#1f2023] rounded-lg">
                      <span className="text-white">Order #1233</span>
                      <span className="text-green-400">+$35.00</span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#1f2023] rounded-lg">
                      <span className="text-white">Order #1232</span>
                      <span className="text-green-400">+$45.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
