"use client"
import React, { useState } from 'react'

const CalculatorForm = () => {
  const [organizationData, setOrganizationData] = useState({
    name: '',
    reportingPeriod: '',
    offsetAmount: ''
  })

  const [marketingData, setMarketingData] = useState({
    activityDate: '',
    country: '',
    channel: '',
    activityType: '',
    quantity: '',
    scope: 'Auto',
    campaignName: '',
    notes: ''
  })

  const handleOrganizationChange = (field: string, value: string) => {
    setOrganizationData(prev => ({ ...prev, [field]: value }))
  }

  const handleMarketingChange = (field: string, value: string) => {
    setMarketingData(prev => ({ ...prev, [field]: value }))
  }

  const handleExportCSV = () => {
    // Export functionality
    console.log('Exporting CSV...')
  }

  const handleAddToLog = () => {
    // Add to log functionality
    console.log('Adding to log...', { organizationData, marketingData })
  }

  return (
    <div className="py-16 px-6 bg-black text-white min-h-screen">
      {/* Organization & Reporting Details */}
      <section className="mb-8 px-12">
        <h2 className="text-2xl font-semibold mb-2">Organization & Reporting Details:</h2>
        <p className="text-gray-400 mb-6">
          Provide your company details and reporting preferences to set the foundation for accurate CO₂e calculations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Organization name</label>
            <input
              type="text"
              placeholder="Enter your organization name"
              value={organizationData.name}
              onChange={(e) => handleOrganizationChange('name', e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Reporting period</label>
            <div className="relative">
              <input
                type="date"
                value={organizationData.reportingPeriod}
                onChange={(e) => handleOrganizationChange('reportingPeriod', e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Offset amount <span className="text-gray-500">(kg CO₂e)</span>
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={organizationData.offsetAmount}
              onChange={(e) => handleOrganizationChange('offsetAmount', e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Marketing Activity */}
      <section className="mb-8 px-12">
        <h2 className="text-2xl font-semibold mb-2">Marketing Activity:</h2>
        <p className="text-gray-400 mb-6">
          Provide your company details and reporting preferences to set the foundation for accurate CO₂e calculations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Activity date</label>
            <input
              type="date"
              value={marketingData.activityDate}
              onChange={(e) => handleMarketingChange('activityDate', e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Marketing country</label>
            <select
              value={marketingData.country}
              onChange={(e) => handleMarketingChange('country', e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Marketing channel</label>
            <select
              value={marketingData.channel}
              onChange={(e) => handleMarketingChange('channel', e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select channel</option>
              <option value="digital">Digital</option>
              <option value="print">Print</option>
              <option value="tv">Television</option>
              <option value="radio">Radio</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Activity type</label>
            <select
              value={marketingData.activityType}
              onChange={(e) => handleMarketingChange('activityType', e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="campaign">Campaign</option>
              <option value="event">Event</option>
              <option value="content">Content Creation</option>
              <option value="advertising">Advertising</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              placeholder="0"
              value={marketingData.quantity}
              onChange={(e) => handleMarketingChange('quantity', e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Scope</label>
            <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg">
              <span className="text-gray-300">Auto</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Campaign name <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Enter campaign name"
              value={marketingData.campaignName}
              onChange={(e) => handleMarketingChange('campaignName', e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Notes <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              placeholder="Add notes"
              value={marketingData.notes}
              onChange={(e) => handleMarketingChange('notes', e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12 resize-none"
            />
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleExportCSV}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Export CSV
        </button>
        <button
          onClick={handleAddToLog}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add to log
        </button>
      </div>
    </div>
  )
}

export default CalculatorForm