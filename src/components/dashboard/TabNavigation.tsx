'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  description?: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="relative">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-surface-glass backdrop-blur-xl rounded-2xl p-2 border border-light shadow-card">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex items-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all duration-400
                ${isActive 
                  ? 'text-accent bg-surface shadow-elevated border border-accent/20' 
                  : 'text-secondary hover:text-primary hover:bg-surface-hover'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background glow for active tab */}
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              {/* Icon */}
              <div className="relative z-10">
                <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-current'}`} />
              </div>
              
              {/* Label */}
              <div className="relative z-10 text-left">
                <div className={`text-sm font-space-grotesk ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {tab.label}
                </div>
                {tab.description && (
                  <div className="text-xs text-tertiary mt-0.5">
                    {tab.description}
                  </div>
                )}
              </div>
              
              {/* Badge */}
              {tab.badge && tab.badge > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative z-10 bg-error text-inverse text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center font-bold"
                >
                  {tab.badge > 99 ? '99+' : tab.badge}
                </motion.div>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-accent rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Tab content indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 text-center"
      >
        <div className="inline-flex items-center space-x-2 bg-surface-glass backdrop-blur-xl rounded-full px-4 py-2 border border-light">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-sm text-secondary font-medium">
            {tabs.find(tab => tab.id === activeTab)?.label}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
