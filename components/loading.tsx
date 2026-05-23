"use client"

import { AvatarMark } from "@/components/avatar-mark"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex flex-col items-center justify-center bg-card border border-border shadow-xl rounded-2xl p-8 min-w-[260px] gap-6 relative overflow-hidden">
        {/* Subtle top gradient highlight line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>
        
        <div className="relative flex items-center justify-center">
          {/* Inner Avatar */}
          <div className="w-10 h-10 flex items-center justify-center z-10">
            <AvatarMark initials="CA" size="sm" variant="brand" shape="rounded" />
          </div>
          {/* Outer Spinners */}
          <div className="absolute -inset-3 border-2 border-primary/10 rounded-xl"></div>
          <div className="absolute -inset-3 border-2 border-primary border-t-transparent border-r-transparent rounded-xl animate-[spin_1.5s_linear_infinite]"></div>
        </div>
        
        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="text-[15px] font-semibold text-foreground tracking-tight">Cloud Alpha</p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
