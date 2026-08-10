'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/services/store';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="border-b border-white/10 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-[#FFFFFF] uppercase font-bold tracking-wider">NETWORK ACTIVITY</span>
          <h1 className="text-3xl serif-title text-[#F4F0E8] mt-1">Notifications</h1>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="text-xs font-mono text-[#A8A198] hover:text-[#FFFFFF] underline"
        >
          Mark all read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={`p-4 rounded-xl border transition-colors ${
              n.isRead ? 'bg-[#151311] border-white/5 opacity-75' : 'bg-[#1C1917] border-[#FFFFFF]/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-[#F4F0E8]">{n.title}</h3>
              <span className="text-xs font-mono text-[#746F69]">{formatDate(n.createdAt)}</span>
            </div>
            <p className="text-xs text-[#A8A198] mb-3 leading-relaxed font-sans">{n.message}</p>
            <Link href={n.link} className="text-xs font-mono text-[#FFFFFF] hover:underline inline-flex items-center gap-1">
              <span>View context</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

