'use client';

import { Fragment } from 'react';
import type { QueueEntry } from '@/lib/types';
import { Menu, Transition } from '@headlessui/react';
import StatusBadge from '@/components/ui/StatusBadge';
import { calculateWaitTime, formatTime } from '@/lib/utils';
import { Clock, User, Stethoscope, MoreVertical, CheckCircle2, XCircle, UserCheck } from 'lucide-react';

interface QueueListItemProps {
  item: QueueEntry;
  onUpdateStatus: (id: number, status: string) => void;
}

const statusActions = [
  { status: 'waiting', label: 'Set to Waiting', icon: Clock },
  { status: 'with_doctor', label: 'Call In (With Doctor)', icon: UserCheck },
  { status: 'completed', label: 'Mark as Completed', icon: CheckCircle2 },
  { status: 'cancelled', label: 'Cancel from Queue', icon: XCircle },
];

export default function QueueListItem({ item, onUpdateStatus }: QueueListItemProps) {
  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left side: Queue Number and Patient Info */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 bg-blue-100 text-blue-800 font-bold text-lg h-12 w-12 rounded-full flex items-center justify-center dark:bg-blue-900/50 dark:text-blue-300">
            #{item.queue_number}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.patient.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <User className="h-3 w-3" /> {item.patient.phone}
            </p>
            {item.doctor && (
              <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Stethoscope className="h-3 w-3" /> Dr. {item.doctor.name}
              </p>
            )}
          </div>
        </div>

        {/* Right side: Time, Status, and Actions */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatTime(item.joined_at)}</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-500">{calculateWaitTime(item.joined_at)} wait</p>
          </div>
          <StatusBadge status={item.status} />

          {/* Actions Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
              <MoreVertical className="h-5 w-5" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900 dark:ring-gray-800">
                <div className="py-1">
                  {statusActions.filter(action => action.status !== item.status).map(action => (
                    <Menu.Item key={action.status}>
                      {({ active }) => (
                        <button
                          onClick={() => onUpdateStatus(item.id, action.status)}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-800' : ''
                          } group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                        >
                          <action.icon className="mr-3 h-5 w-5" />
                          {action.label}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}
