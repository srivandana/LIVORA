import React, { useState } from 'react';
import { X, Check, Copy, Share2, Sparkles } from 'lucide-react';
import { LifeExperience } from '../types';

interface ShareModalProps {
  life: LifeExperience;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ life, onClose }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.origin + `?life=${life.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#0e101d] border border-white/12 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-2 text-indigo-400">
            <Share2 className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">
            Share Life Experience
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Invite someone to borrow this lifestyle with you.
          </p>
        </div>

        {/* Share Card Preview */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 mb-6">
          <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-slate-900">
            <img
              src={life.coverImage}
              alt={life.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h4 className="font-display font-bold text-white text-base truncate">
            {life.title}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">By {life.creator.name}</p>
        </div>

        {/* Link Copy Box */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 mb-4">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent px-2 text-xs text-slate-300 font-mono focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
