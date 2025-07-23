import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, Clock, Truck, Package, XCircle } from 'lucide-react';

const statusIcons = {
  pending: Clock,
  picked_up: Package,
  in_transit: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const statusColors = {
  pending: 'text-yellow-600 bg-yellow-100',
  picked_up: 'text-blue-600 bg-blue-100',
  in_transit: 'text-indigo-600 bg-indigo-100',
  delivered: 'text-green-600 bg-green-100',
  cancelled: 'text-red-600 bg-red-100',
};

function Timeline({ timeline }) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {timeline.map((event, eventIdx) => {
          const Icon = statusIcons[event.status] || Clock;
          const colorClass = statusColors[event.status] || 'text-gray-600 bg-gray-100';
          
          return (
            <li key={eventIdx}>
              <div className="relative pb-8">
                {eventIdx !== timeline.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${colorClass}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500 capitalize">
                        {event.status.replace('_', ' ')} {event.location && `at ${event.location}`}
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime={event.timestamp}>
                        {format(new Date(event.timestamp), 'MMM dd, HH:mm')}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Timeline;