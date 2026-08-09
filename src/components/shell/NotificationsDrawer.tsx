'use client';

import React from 'react';
import { useApp } from '@/lib/services/store';
import { X, Bell, Check, ExternalLink } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#151311] border-l border-white/15 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0D0C0B]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#C85A32]" />
              <h3 className="text-sm font-semibold font-serif text-[#F4F0E8]">Notifications</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] font-mono text-[#A8A198] hover:text-[#C85A32] transition-colors"
              >
                Mark all read
              </button>
              <button
                onClick={onClose}
                className="p-1 text-[#746F69] hover:text-[#F4F0E8] rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-[#746F69] text-xs font-mono">
                No notifications right now.
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-3 rounded-lg border transition-colors ${
                    n.isRead 
                      ? 'bg-[#0D0C0B]/50 border-white/5 opacity-75' 
                      : 'bg-[#1C1917] border-[#C85A32]/30 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs font-semibold text-[#F4F0E8]">{n.title}</h4>
                    <span className="text-[10px] font-mono text-[#746F69]">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-[#A8A198] mb-2 leading-relaxed">{n.message}</p>
                  <Link
                    href={n.link}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-[#C85A32] hover:underline"
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
