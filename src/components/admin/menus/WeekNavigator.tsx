"use client"
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WeekNavigation } from '@/types/adminMenu'

interface WeekNavigatorProps {
  navigation: WeekNavigation
  onNavigate: (direction: 'prev' | 'next') => void
  isLoading?: boolean
}

export function WeekNavigator({ 
  navigation, 
  onNavigate, 
  isLoading = false 
}: WeekNavigatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('prev')}
              disabled={!navigation.canGoBack || isLoading}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Semana anterior</span>
            </Button>
            
            <div className="flex items-center space-x-3 px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span className="font-semibold text-slate-900 dark:text-white text-center min-w-0">
                {navigation.weekLabel}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('next')}
              disabled={!navigation.canGoForward || isLoading}
              className="flex items-center space-x-2"
            >
              <span>Semana siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
