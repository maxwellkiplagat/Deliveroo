import React from 'react';
import { Clock, Truck, CheckCircle, XCircle, Package } from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  picked_up: {
    label: 'Picked Up',
    color: 'bg-blue-100 text-blue-800',
    icon: Package,
  },
  in_transit: {
    label: 'In Transit',
    color: 'bg-indigo-100 text-indigo-800',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </span>
  );
}

export default StatusBadge;