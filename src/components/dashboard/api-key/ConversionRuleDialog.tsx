'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiKeyService } from '@/services/apikey/apikey'
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { ConversionRuleType, MatchType } from '@/types/api-key'

interface ConversionRulesDialogProps {
  apiKeyId: string
  apiKeyName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConversionRulesDialog({
  apiKeyId,
  apiKeyName,
  open,
  onOpenChange,
}: ConversionRulesDialogProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newRule, setNewRule] = useState({
    name: '',
    rule_type: 'url' as ConversionRuleType,
    url_pattern: '',
    match_type: 'contains' as MatchType,
    css_selector: '',
    element_text: '',
  })

  const queryClient = useQueryClient()

  // Fetch rules
  const { data: rulesData, isLoading } = useQuery({
    queryKey: ['conversionRules', apiKeyId],
    queryFn: () => ApiKeyService.getConversionRules(apiKeyId),
    enabled: open,
  })

  // Create rule
  const createRuleMutation = useMutation({
    mutationFn: () => ApiKeyService.createConversionRule(apiKeyId, newRule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversionRules', apiKeyId] })
      setShowCreateForm(false)
      setNewRule({
        name: '',
        rule_type: 'url',
        url_pattern: '',
        match_type: 'contains',
        css_selector: '',
        element_text: '',
      })
    },
  })

  // Delete rule
  const deleteRuleMutation = useMutation({
    mutationFn: (ruleId: string) => ApiKeyService.deleteConversionRule(apiKeyId, ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversionRules', apiKeyId] })
    },
  })

  // Toggle rule
  const toggleRuleMutation = useMutation({
    mutationFn: ({ ruleId, isActive }: { ruleId: string; isActive: boolean }) =>
      ApiKeyService.toggleConversionRule(apiKeyId, ruleId, !isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversionRules', apiKeyId] })
    },
  })

  const rules = rulesData?.data?.rules || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Conversion Rules - {apiKeyName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rules List */}
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading rules...</div>
          ) : rules.length === 0 && !showCreateForm ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No conversion rules yet</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Rule
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{rule.name}</h4>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {rule.rule_type}
                        </span>
                        {!rule.is_active && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {rule.rule_type === 'url' &&
                          `URL: ${rule.url_pattern} (${rule.match_type})`}
                        {rule.rule_type === 'click' && `Selector: ${rule.css_selector}`}
                        {rule.rule_type === 'form_submit' && `Form: ${rule.form_id}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Conversions: {rule.conversion_count} | Priority: {rule.priority}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toggleRuleMutation.mutate({
                            ruleId: rule.id,
                            isActive: rule.is_active,
                          })
                        }
                      >
                        {rule.is_active ? (
                          <ToggleRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRuleMutation.mutate(rule.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {!showCreateForm && (
                <Button onClick={() => setShowCreateForm(true)} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Rule
                </Button>
              )}
            </>
          )}

          {/* Create Form */}
          {showCreateForm && (
            <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
              <h3 className="font-medium">Create New Conversion Rule</h3>

              <div className="space-y-4">
                <div>
                  <Label>Rule Name</Label>
                  <Input
                    placeholder="e.g., Purchase Complete"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Rule Type</Label>
                  <Select
                    value={newRule.rule_type}
                    onValueChange={(value: ConversionRuleType) =>
                      setNewRule({ ...newRule, rule_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="url">URL Match</SelectItem>
                      <SelectItem value="click">Element Click</SelectItem>
                      <SelectItem value="form_submit">Form Submit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newRule.rule_type === 'url' && (
                  <>
                    <div>
                      <Label>URL Pattern</Label>
                      <Input
                        placeholder="/thank-you"
                        value={newRule.url_pattern}
                        onChange={(e) =>
                          setNewRule({ ...newRule, url_pattern: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Match Type</Label>
                      <Select
                        value={newRule.match_type}
                        onValueChange={(value: MatchType) =>
                          setNewRule({ ...newRule, match_type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contains">Contains</SelectItem>
                          <SelectItem value="exact">Exact Match</SelectItem>
                          <SelectItem value="starts_with">Starts With</SelectItem>
                          <SelectItem value="ends_with">Ends With</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {newRule.rule_type === 'click' && (
                  <>
                    <div>
                      <Label>CSS Selector</Label>
                      <Input
                        placeholder="#buy-now-button"
                        value={newRule.css_selector}
                        onChange={(e) =>
                          setNewRule({ ...newRule, css_selector: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Element Text (Optional)</Label>
                      <Input
                        placeholder="Buy Now"
                        value={newRule.element_text}
                        onChange={(e) =>
                          setNewRule({ ...newRule, element_text: e.target.value })
                        }
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => createRuleMutation.mutate()}
                  disabled={!newRule.name || createRuleMutation.isPending}
                >
                  Create Rule
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
