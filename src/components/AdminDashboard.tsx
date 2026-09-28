import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  ShieldCheck,
  Award,
  AlertTriangle,
  Flame,
  Clock,
  Sparkles,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { LifeExperience } from '../types';

interface AdminDashboardProps {
  lives: LifeExperience[];
  onSelectLife: (lifeId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lives,
  onSelectLife,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'experiences' | 'moderation'>('overview');

  // Realistic marketplace business metrics
  const totalUsers = 14820;
  const totalCreators = 342;
  const totalExperiences = lives.length;
  const completedExperiences = 18920;
  const platformRevenue = 1842500; // in INR
  const activeNowCount = 64;

  const popularLives = [...lives]
    .sort((a, b) => b.experiencedCount - a.experiencedCount)
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>BORROW A LIFE · PLATFORM OPERATIONS CONSOLE</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time metrics, creator distribution, GMV revenue, and content safety.
        </p>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
            Total Users
          </span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
            {totalUsers.toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
            Total Creators
          </span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-indigo-300 tabular-nums">
            {totalCreators}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
            Experiences
          </span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-sky-300 tabular-nums">
            {totalExperiences}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
            Completed Lives
          </span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-amber-300 tabular-nums">
            {completedExperiences.toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
            Platform Revenue
          </span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums">
            ₹{(platformRevenue / 100000).toFixed(1)}L
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
            Live Right Now
          </span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-rose-400 tabular-nums flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
            {activeNowCount}
          </span>
        </div>
      </div>

      {/* Visual Chart & Leaderboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Visual Monthly Borrowing Volume Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/[0.02] border border-white/8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-white text-base">
                Borrowing Volume (Last 6 Months)
              </h2>
              <p className="text-xs text-slate-400">Total lifestyles activated per month</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">+42% Growth</span>
          </div>

          {/* SVG Clean Bar Chart */}
          <div className="h-44 flex items-end gap-4 pt-4 pb-2 border-b border-white/6">
            {[
              { month: 'Apr', val: 1200, height: '35%' },
              { month: 'May', val: 1950, height: '50%' },
              { month: 'Jun', val: 2400, height: '60%' },
              { month: 'Jul', val: 3200, height: '75%' },
              { month: 'Aug', val: 4100, height: '88%' },
              { month: 'Sep', val: 4980, height: '100%' },
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div
                  className="w-full bg-indigo-600/60 group-hover:bg-indigo-500 rounded-t-lg transition-all"
                  style={{ height: bar.height }}
                />
                <span className="text-[10px] font-mono text-slate-400">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Moderation Status */}
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-white text-base">Safety & Moderation</h2>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              All published routines and Life Twists undergo community review. Zero safety violations reported in the last 30 days.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/6 flex justify-between">
                <span className="text-slate-400">Flagged content</span>
                <span className="text-white font-bold">0</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/6 flex justify-between">
                <span className="text-slate-400">Twist risk rating</span>
                <span className="text-emerald-400 font-bold">SAFE (99.8%)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/6 text-[10px] font-mono text-slate-500">
            System status: Operational
          </div>
        </div>
      </div>

      {/* Popular Experiences Leaderboard */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/8">
        <h2 className="font-display font-bold text-white text-lg mb-4">
          Most Popular Experiences
        </h2>

        <div className="space-y-3">
          {popularLives.map((life, idx) => (
            <div
              key={life.id}
              onClick={() => onSelectLife(life.id)}
              className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/6 flex items-center justify-between gap-4 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-indigo-400 w-5">
                  0{idx + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-white text-sm">{life.title}</h3>
                  <span className="text-xs text-slate-400">By {life.creator.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 font-mono text-xs tabular-nums text-slate-400">
                <span>{life.experiencedCount} borrows</span>
                <span className="text-emerald-400">★ {life.rating}</span>
                <span className="text-white font-semibold">
                  {life.price === 0 ? 'Free' : `₹${life.price}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
