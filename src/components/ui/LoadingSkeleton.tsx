'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  rows?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className, 
  rows = 1 
}) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            "bg-gray-200 rounded-lg h-4",
            className
          )}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
    <LoadingSkeleton className="h-6 w-1/3" />
    <LoadingSkeleton className="h-8 w-1/2" />
    <LoadingSkeleton className="h-4 w-2/3" />
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
    <div className="p-6 border-b border-gray-100">
      <LoadingSkeleton className="h-6 w-1/4" />
    </div>
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="p-6 flex items-center space-x-4">
          <LoadingSkeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="h-4 w-1/3" />
            <LoadingSkeleton className="h-3 w-1/2" />
          </div>
          <LoadingSkeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  </div>
);
