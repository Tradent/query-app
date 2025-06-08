"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Validator } from "@/lib/validation-utils"
import { calculateValidationRewards } from "@/lib/validation-utils"

interface ValidatorsListProps {
  validators: Validator[]
  activeValidators: Validator[]
}

export function ValidatorsList({ validators, activeValidators }: ValidatorsListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter validators based on search term
  const filteredValidators = validators.filter((validator) =>
    validator.publicKey.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get active validator IDs for quick lookup
  const activeValidatorIds = activeValidators.map((v) => v.id)

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search validators by public key..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Validator</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reputation</TableHead>
              <TableHead>Validations</TableHead>
              <TableHead>Rewards</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredValidators.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                  No validators found
                </TableCell>
              </TableRow>
            ) : (
              filteredValidators.map((validator) => (
                <TableRow key={validator.id}>
                  <TableCell className="font-medium">
                    {validator.publicKey.substring(0, 8)}...
                    {validator.publicKey.substring(validator.publicKey.length - 4)}
                  </TableCell>
                  <TableCell>
                    {activeValidatorIds.includes(validator.id) ? (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600" style={{ width: `${validator.reputation}%` }} />
                      </div>
                      <span className="ml-2">{validator.reputation}</span>
                    </div>
                  </TableCell>
                  <TableCell>{validator.validationsCount.toLocaleString()}</TableCell>
                  <TableCell>
                    {calculateValidationRewards(validator, validator.validationsCount).toFixed(2)} QUERY
                  </TableCell>
                  <TableCell>{new Date(validator.joinedAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
