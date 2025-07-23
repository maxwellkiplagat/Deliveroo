import React, { useState } from 'react';
import { BarChart3, TrendingUp, Package, Users, Clock, DollarSign } from 'lucide-react';

function DeliveryAnalytics() {
  const [timeRange, setTimeRange] = useState('week');

  const mockAnalytics = {
    week: {
      totalDeliveries: 156,
      successRate: 94.2,
      avgDeliveryTime: 2.4,
      revenue: 2340.50,
      dailyDeliveries: [22, 18, 25, 30, 28, 20, 13],
      statusBreakdown: {
        delivered: 147,
        in_transit: 6,
        pending: 3,
        cancelled: 0
      },
      topCouriers: [
        { name: 'Mike Johnson', deliveries: 23, rating: 4.8 },
        { name: 'Sarah Wilson', deliveries: 19, rating: 4.9 },
        { name: 'David Chen', deliveries: 17, rating: 4.7 }
      ]
    },
    month: {
      totalDeliveries: 642,
      successRate: 93.8,
      avgDeliveryTime: 2.6,
      revenue: 9680.75,
      dailyDeliveries: Array.from({ length: 30 }, () => Math.floor(Math.random() * 30) + 10),
      statusBreakdown: {
        delivered: 602,
        in_transit: 25,
        pending: 12,
        cancelled: 3
      },
      topCouriers: [
        { name: 'Mike Johnson', deliveries: 89, rating: 4.8 },
        { name: 'Sarah Wilson', deliveries: 76, rating: 4.9 },
        { name: 'David Chen', deliveries: 71, rating: 4.7 }
      ]
    }
  };

  const data = mockAnalytics[timeRange];

  const StatCard = ({ icon: Icon, title, value, change, color = 'emerald' }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '↗' : '↘'} {Math.abs(change)}% from last {timeRange}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Package}
          title="Total Deliveries"
          value={data.totalDeliveries}
          change={12.5}
          color="emerald"
        />
        <StatCard
          icon={TrendingUp}
          title="Success Rate"
          value={`${data.successRate}%`}
          change={2.1}
          color="blue"
        />
        <StatCard
          icon={Clock}
          title="Avg Delivery Time"
          value={`${data.avgDeliveryTime}h`}
          change={-8.3}
          color="purple"
        />
        <StatCard
          icon={DollarSign}
          title="Revenue"
          value={`$${data.revenue.toLocaleString()}`}
          change={15.7}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Daily Deliveries</h3>
          <div className="h-64 flex items-end space-x-2">
            {data.dailyDeliveries.slice(0, 7).map((count, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-emerald-500 rounded-t"
                  style={{ height: `${(count / Math.max(...data.dailyDeliveries)) * 200}px` }}
                />
                <span className="text-xs text-gray-600 mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
                <span className="text-xs font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Delivery Status</h3>
          <div className="space-y-4">
            {Object.entries(data.statusBreakdown).map(([status, count]) => {
              const percentage = (count / data.totalDeliveries) * 100;
              const colors = {
                delivered: 'bg-green-500',
                in_transit: 'bg-blue-500',
                pending: 'bg-yellow-500',
                cancelled: 'bg-red-500'
              };
              
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize font-medium">{status.replace('_', ' ')}</span>
                    <span>{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${colors[status]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Couriers */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Top Performing Couriers</h3>
        <div className="space-y-4">
          {data.topCouriers.map((courier, index) => (
            <div key={courier.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold">#{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium">{courier.name}</p>
                  <p className="text-sm text-gray-600">{courier.deliveries} deliveries</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">{courier.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DeliveryAnalytics;