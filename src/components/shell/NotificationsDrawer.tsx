'use client';

import React from 'react';
import { useApp } from '@/lib/services/store';
import { X, Bell, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/format';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-black border-l border-white/20 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-white" />
              <h3 className="text-sm font-semibold font-display text-white">Notifications</h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] font-ui text-white/50 hover:text-white transition-colors"
              >
                Mark all read
              </button>
              <button
                onClick={onClose}
                className="p-1 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-white/30 text-xs font-ui">
                No notifications right now.
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-4 border transition-colors ${
                    n.isRead 
                      ? 'bg-black border-white/5 opacity-60' 
                      : 'bg-black border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs font-semibold text-white font-ui">{n.title}</h4>
                    <span className="text-[10px] font-ui text-white/30">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mb-2 leading-relaxed font-ui">{n.message}</p>
                  <Link
                    href={n.link}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-[11px] font-ui text-white hover:underline"
                  >
                    <span>View details</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
