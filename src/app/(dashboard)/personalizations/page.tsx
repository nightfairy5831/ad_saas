'use client'

import { useState } from 'react'
import { mockSegments, mockVariants } from '@/lib/mockdata'
import type { Segment, Variant } from '@/lib/mockdata'

export default function PersonalizationsPage() {
  const [activeTab, setActiveTab] = useState<'segments' | 'variants'>('segments')

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Personalizations</h1>
        <p className="text-gray-600">Define audience segments and assign personalized content variants</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('segments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'segments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Segments
          </button>
          <button
            onClick={() => setActiveTab('variants')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'variants'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Variants
          </button>
        </nav>
      </div>

      {/* Segments Tab */}
      {activeTab === 'segments' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Audience Segments</h2>
              <p className="text-gray-600 text-sm mt-1">Define rules based on UTM parameters and tracking IDs</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              + New Segment
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Segment Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UTM Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UTM Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UTM Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking IDs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockSegments.map((segment) => (
                  <tr key={segment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{segment.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{segment.utm_source || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{segment.utm_campaign || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{segment.utm_content || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {segment.gclid && <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-1">GCLID</span>}
                        {segment.fbclid && <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">FBCLID</span>}
                        {!segment.gclid && !segment.fbclid && '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {segment.created_at}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {mockSegments.map((segment) => (
              <div key={segment.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{segment.name}</h3>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 text-sm">Edit</button>
                    <button className="text-red-600 text-sm">Delete</button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  {segment.utm_source && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">UTM Source:</span>
                      <span className="font-medium">{segment.utm_source}</span>
                    </div>
                  )}
                  {segment.utm_campaign && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">UTM Campaign:</span>
                      <span className="font-medium">{segment.utm_campaign}</span>
                    </div>
                  )}
                  {segment.utm_content && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">UTM Content:</span>
                      <span className="font-medium">{segment.utm_content}</span>
                    </div>
                  )}
                  {(segment.gclid || segment.fbclid) && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tracking IDs:</span>
                      <div>
                        {segment.gclid && <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-1">GCLID</span>}
                        {segment.fbclid && <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">FBCLID</span>}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created:</span>
                    <span>{segment.created_at}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variants Tab */}
      {activeTab === 'variants' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Content Variants</h2>
              <p className="text-gray-600 text-sm mt-1">Personalized content blocks for each segment</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              + New Variant
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Segment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Headline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subheadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bullets
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CTA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockVariants.map((variant) => (
                  <tr key={variant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{variant.segment_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{variant.headline}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{variant.sub}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {variant.bullets ? `${variant.bullets.length} items` : 'None'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {variant.cta}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {variant.created_at}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {mockVariants.map((variant) => (
              <div key={variant.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{variant.segment_name}</h3>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 text-sm">Edit</button>
                    <button className="text-red-600 text-sm">Delete</button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Headline:</p>
                    <p className="text-sm text-gray-900">{variant.headline}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Subheadline:</p>
                    <p className="text-sm text-gray-900">{variant.sub}</p>
                  </div>
                  
                  {variant.bullets && variant.bullets.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Bullet Points:</p>
                      <ul className="list-disc list-inside text-sm text-gray-900 space-y-1">
                        {variant.bullets.map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">CTA:</p>
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                        {variant.cta}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-sm">{variant.created_at}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}