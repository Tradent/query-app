"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, ExternalLink } from "lucide-react"

// Mock blockchain data
const mockTransactions = [
  {
    signature: "5KKsWtA9rV8AHzrKWj6BYDyNvmkTbUzG1rCFpkJ7rLGDrSiNwVwRZWgUQz9kGzLEY",
    blockTime: Date.now() - 1000 * 60 * 5,
    type: "Validation",
    status: "Success",
    resultId: "result_123456",
    validator: "Va1idator1111111111111111111111111111111111111",
  },
  {
    signature: "4xRsWtA9rV8AHzrKWj6BYDyNvmkTbUzG1rCFpkJ7rLGDrSiNwVwRZWgUQz9kGzLEY",
    blockTime: Date.now() - 1000 * 60 * 15,
    type: "Join Network",
    status: "Success",
    resultId: null,
    validator: "Va1idator2222222222222222222222222222222222222",
  },
  {
    signature: "3LKsWtA9rV8AHzrKWj6BYDyNvmkTbUzG1rCFpkJ7rLGDrSiNwVwRZWgUQz9kGzLEY",
    blockTime: Date.now() - 1000 * 60 * 30,
    type: "Validation",
    status: "Success",
    resultId: "result_789012",
    validator: "Va1idator3333333333333333333333333333333333333",
  },
  {
    signature: "2JKsWtA9rV8AHzrKWj6BYDyNvmkTbUzG1rCFpkJ7rLGDrSiNwVwRZWgUQz9kGzLEY",
    blockTime: Date.now() - 1000 * 60 * 45,
    type: "Validation",
    status: "Failed",
    resultId: "result_345678",
    validator: "Va1idator4444444444444444444444444444444444444",
  },
  {
    signature: "1HKsWtA9rV8AHzrKWj6BYDyNvmkTbUzG1rCFpkJ7rLGDrSiNwVwRZWgUQz9kGzLEY",
    blockTime: Date.now() - 1000 * 60 * 60,
    type: "Join Network",
    status: "Success",
    resultId: null,
    validator: "Va1idator5555555555555555555555555555555555555",
  },
]

export function BlockchainExplorer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState(mockTransactions)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would query the blockchain
    // For now, we'll just filter the mock data
    if (!searchQuery.trim()) {
      setTransactions(mockTransactions)
      return
    }

    const filtered = mockTransactions.filter(
      (tx) =>
        tx.signature.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.validator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.resultId && tx.resultId.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    setTransactions(filtered)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockchain Explorer</CardTitle>
        <CardDescription>View validation transactions on the Solana blockchain</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex space-x-2 mb-6">
          <Input
            placeholder="Search by transaction signature, validator, or result ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Signature</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Validator</TableHead>
                <TableHead>Result ID</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.signature}>
                    <TableCell className="font-mono text-xs">
                      {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                    </TableCell>
                    <TableCell className="text-sm">{new Date(tx.blockTime).toLocaleTimeString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          tx.type === "Validation" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                        }
                      >
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={tx.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {tx.validator.slice(0, 4)}...{tx.validator.slice(-4)}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {tx.resultId ? `${tx.resultId.slice(0, 6)}...` : "-"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View on Solana Explorer</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        Transactions are stored permanently on the Solana blockchain
      </CardFooter>
    </Card>
  )
}
