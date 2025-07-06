'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  alpha,
  Avatar,
  Stack,
  Chip,
  LinearProgress,
  Button,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Group,
  Schedule,
  Analytics,
  Speed,
  Star,
  BarChart,
  ShowChart,
  PieChart,
  CalendarToday,
  Download,
  Refresh,
  Timeline,
} from '@mui/icons-material';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useSocios } from '@/hooks/useSocios';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface AdvancedAnalyticsProps {
  loading?: boolean;
}

interface AnalyticsData {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  inactiveMembers: number;
  growthRate: number;
  retentionRate: number;
  averageLifetime: number;
  engagementScore: number;
  monthlyTrends: Array<{
    month: string;
    members: number;
    growth: number;
  }>;
  statusDistribution: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
  engagementLevels: Array<{
    level: string;
    count: number;
    percentage: number;
  }>;
  activityTimeline: Array<{
    date: string;
    registrations: number;
    activations: number;
    expirations: number;
  }>;
  topMetrics: Array<{
    title: string;
    value: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  }>;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  delay: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  gradient,
  delay,
  subtitle,
  trend = 'neutral',
  loading = false,
  onClick
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      style={{ 
        width: '100%',
        minWidth: isMobile ? '100%' : '280px'
      }}
    >
      <Card
        elevation={0}
        onClick={onClick}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #f1f5f9',
          borderRadius: { xs: 3, md: 4 },
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: onClick ? 'pointer' : 'default',
          height: '100%',
          '&:hover': {
            borderColor: alpha(color, 0.3),
            transform: onClick ? 'translateY(-6px)' : 'translateY(-3px)',
            boxShadow: `0 20px 60px -15px ${alpha(color, 0.25)}`,
            '& .metric-icon': {
              transform: 'scale(1.1) rotate(5deg)',
              background: gradient,
              color: 'white',
            },
            '& .metric-glow': {
              opacity: 1,
            }
          },
        }}
      >
        {/* Glow effect */}
        <Box
          className="metric-glow"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: gradient,
            opacity: 0.6,
            transition: 'opacity 0.3s ease',
          }}
        />

        <CardContent sx={{ 
          p: { xs: 2, md: 3 }, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'space-between', 
            mb: { xs: 1.5, md: 2 },
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: { xs: 1, sm: 0 }
          }}>
            <Avatar
              className="metric-icon"
              sx={{
                width: { xs: 48, md: 56 },
                height: { xs: 48, md: 56 },
                bgcolor: alpha(color, 0.1),
                color: color,
                borderRadius: 3,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 6px 20px ${alpha(color, 0.2)}`,
              }}
            >
              {loading ? <CircularProgress size={isMobile ? 20 : 24} sx={{ color: 'inherit' }} /> : icon}
            </Avatar>

            {/* Trend indicator */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              order: { xs: 3, sm: 2 },
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'flex-end', sm: 'flex-start' }
            }}>
              {trend === 'up' && <TrendingUp sx={{ fontSize: { xs: 16, md: 18 }, color: '#10b981' }} />}
              {trend === 'down' && <TrendingDown sx={{ fontSize: { xs: 16, md: 18 }, color: '#ef4444' }} />}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280',
                  fontSize: { xs: '0.8rem', md: '0.85rem' }
                }}
              >
                {change > 0 ? '+' : ''}{change}%
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="overline"
              sx={{
                color: '#94a3b8',
                fontWeight: 700,
                fontSize: { xs: '0.65rem', md: '0.7rem' },
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                mb: 1,
                display: 'block'
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: '#0f172a',
                fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' },
                letterSpacing: '-0.02em',
                lineHeight: 0.9,
                mb: subtitle ? 1 : 0,
              }}
            >
              {loading ? '...' : value}
            </Typography>

            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', md: '0.85rem' }
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Progress indicator */}
          <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
            <LinearProgress
              variant="determinate"
              value={loading ? 0 : Math.min(Math.abs(change) * 5, 100)}
              sx={{
                height: 3,
                borderRadius: 2,
                bgcolor: alpha(color, 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: color,
                  borderRadius: 2,
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ChartCard: React.FC<{
  title: string;
  subtitle?: string;
  data: (
    | { level: string; count: number; percentage: number }
    | { name: string; value: number; color: string; percentage: number }
    | { month: string; members: number; growth: number }
    | { date: string; registrations: number; activations: number; expirations: number }
  )[];
  color: string;
  type: 'bar' | 'line' | 'pie' | 'timeline';
  icon: React.ReactNode;
  loading?: boolean;
  onExport?: () => void;
}> = ({ title, subtitle, data, color, type, icon, loading = false, onExport }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Determine max value based on chart type and data shape
  type ChartDataType =
    | { level: string; count: number; percentage: number }
    | { name: string; value: number; color: string; percentage: number }
    | { month: string; members: number; growth: number }
    | { date: string; registrations: number; activations: number; expirations: number };

  const maxValue = useMemo(() => {
    switch (type) {
      case 'bar':
        return Math.max(...data.map((d: ChartDataType) => 'count' in d ? d.count : 0));
      case 'pie':
        return Math.max(...data.map((d: ChartDataType) => 'value' in d ? d.value : 0));
      case 'line':
        return Math.max(...data.map((d: ChartDataType) => 'members' in d ? d.members : 0));
      case 'timeline':
        return Math.max(...data.map((d: ChartDataType) => 'registrations' in d ? d.registrations : 0));
      default:
        return 0;
    }
  }, [data, type]);

  const renderChart = () => {
    if (loading) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: { xs: 200, md: 250 } 
        }}>
          <CircularProgress size={40} sx={{ color }} />
        </Box>
      );
    }

    const chartHeight = isMobile ? 200 : 250;

    switch (type) {
      case 'bar':
        return (
          <Box sx={{ height: chartHeight, py: 2 }}>
            <Stack spacing={isMobile ? 2 : 2.5}>
              {data.slice(0, isMobile ? 4 : 6).map((item, index) => (
                <Box key={index}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 1,
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    gap: { xs: 0.5, sm: 0 }
                  }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600, 
                      color: '#475569', 
                      fontSize: { xs: '0.8rem', md: '0.9rem' },
                      flex: { xs: '1 1 100%', sm: '1 1 auto' }
                    }}>
                      {'level' in item
                        ? item.level
                        : 'name' in item
                        ? item.name
                        : 'month' in item
                        ? item.month
                        : 'date' in item
                        ? item.date
                        : ''}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      flex: { xs: '1 1 100%', sm: '0 0 auto' },
                      justifyContent: { xs: 'space-between', sm: 'flex-end' }
                    }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 700, 
                        color: '#1e293b', 
                        fontSize: { xs: '0.8rem', md: '0.9rem' }
                      }}>
                        {'count' in item
                          ? item.count
                          : 'value' in item
                          ? item.value
                          : 'members' in item
                          ? item.members
                          : 'registrations' in item
                          ? item.registrations
                          : ''}
                      </Typography>
                      {'percentage' in item && typeof item.percentage === 'number' && (
                        <Chip
                          label={
                            'percentage' in item && typeof item.percentage === 'number'
                              ? `${item.percentage}%`
                              : ''
                          }
                          size="small"
                          sx={{
                            bgcolor: alpha(color, 0.1),
                            color: color,
                            fontWeight: 700,
                            fontSize: { xs: '0.65rem', md: '0.7rem' },
                            height: { xs: 18, md: 20 },
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      'count' in item
                        ? (item.count / maxValue) * 100
                        : 'value' in item
                        ? (item.value / maxValue) * 100
                        : 'members' in item
                        ? (item.members / maxValue) * 100
                        : 'registrations' in item
                        ? (item.registrations / maxValue) * 100
                        : 0
                    }
                    sx={{
                      height: { xs: 6, md: 8 },
                      borderRadius: 4,
                      bgcolor: alpha(color, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: color,
                        borderRadius: 4,
                      }
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        );

      case 'pie':
        return (
          <Box sx={{ height: chartHeight, py: 2 }}>
            <Stack spacing={isMobile ? 2 : 2.5}>
              {data.map((item, index) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: { xs: 1, sm: 2 }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    flex: { xs: '1 1 100%', sm: '1 1 auto' }
                  }}>
                    <Box
                      sx={{
                        width: { xs: 10, md: 12 },
                        height: { xs: 10, md: 12 },
                        borderRadius: '50%',
                        bgcolor: 'color' in item ? item.color : color,
                        boxShadow: `0 2px 8px ${alpha('color' in item ? item.color : color, 0.3)}`,
                      }}
                    />
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600, 
                      color: '#475569', 
                      fontSize: { xs: '0.8rem', md: '0.9rem' }
                    }}>
                      {'name' in item ? item.name : 'level' in item ? item.level : 'month' in item ? item.month : 'date' in item ? item.date : ''}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    flex: { xs: '1 1 100%', sm: '0 0 auto' },
                    justifyContent: { xs: 'space-between', sm: 'flex-end' }
                  }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 700, 
                      color: '#1e293b', 
                      fontSize: { xs: '0.8rem', md: '0.9rem' }
                    }}>
                      {'value' in item
                        ? item.value
                        : 'count' in item
                        ? item.count
                        : 'members' in item
                        ? item.members
                        : 'registrations' in item
                        ? item.registrations
                        : ''}
                    </Typography>
                    <Chip
                      label={
                        'percentage' in item && typeof item.percentage === 'number'
                          ? `${item.percentage}%`
                          : ''
                      }
                      size="small"
                      sx={{
                        bgcolor: alpha('color' in item && item.color ? item.color : color, 0.1),
                        color: 'color' in item && item.color ? item.color : color,
                        fontWeight: 700,
                        fontSize: { xs: '0.65rem', md: '0.7rem' },
                        height: { xs: 18, md: 20 },
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        );

      case 'line':
        return (
          <Box sx={{ 
            height: chartHeight, 
            display: 'flex', 
            alignItems: 'end', 
            gap: { xs: 0.5, md: 1 }, 
            px: { xs: 1, md: 2 }, 
            py: 2 
          }}>
            {data.map((item, index) => (
              <Tooltip
                key={index}
                title={
                  'month' in item && 'members' in item && 'growth' in item
                    ? `${item.month}: ${item.members} socios (${item.growth > 0 ? '+' : ''}${item.growth}%)`
                    : ''
                }
                arrow
              >
                <Box
                  sx={{
                    flex: 1,
                    height: `${(
                      'members' in item
                        ? item.members
                        : 'value' in item
                        ? item.value
                        : 0
                    ) / maxValue * 100}%`,
                    bgcolor: alpha(color, 0.7),
                    borderRadius: '4px 4px 0 0',
                    minHeight: { xs: 6, md: 8 },
                    position: 'relative',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: color,
                      transform: 'scaleY(1.05)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: { xs: -20, md: -25 },
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: { xs: '0.6rem', md: '0.7rem' },
                      color: '#94a3b8',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {'month' in item
                      ? item.month
                      : 'date' in item
                      ? item.date
                      : 'name' in item
                      ? item.name
                      : 'level' in item
                      ? item.level
                      : ''}
                  </Typography>
                </Box>
              </Tooltip>
            ))}
          </Box>
        );

      case 'timeline':
        return (
          <Box sx={{ height: chartHeight, py: 2 }}>
            <Stack spacing={isMobile ? 1.5 : 2}>
              {data.slice(0, isMobile ? 4 : 5).map((item, index) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 2, md: 3 },
                  flexWrap: { xs: 'wrap', sm: 'nowrap' }
                }}>
                  <Box sx={{ minWidth: { xs: 50, md: 60 } }}>
                    <Typography variant="caption" sx={{ 
                      color: '#94a3b8', 
                      fontWeight: 600, 
                      fontSize: { xs: '0.7rem', md: '0.75rem' }
                    }}>
                      {'date' in item
                        ? item.date
                        : 'month' in item
                        ? item.month
                        : 'name' in item
                        ? item.name
                        : 'level' in item
                        ? item.level
                        : ''}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      mb: 1,
                      flexWrap: 'wrap'
                    }}>
                      {('registrations' in item) && (
                        <Chip
                          label={`+${item.registrations}`}
                          size="small"
                          sx={{ 
                            bgcolor: alpha('#10b981', 0.1), 
                            color: '#10b981', 
                            fontSize: { xs: '0.65rem', md: '0.7rem' }, 
                            height: { xs: 18, md: 20 }
                          }}
                        />
                      )}
                      {('activations' in item) && (
                        <Chip
                          label={`${item.activations}`}
                          size="small"
                          sx={{ 
                            bgcolor: alpha('#6366f1', 0.1), 
                            color: '#6366f1', 
                            fontSize: { xs: '0.65rem', md: '0.7rem' }, 
                            height: { xs: 18, md: 20 }
                          }}
                        />
                      )}
                      {('expirations' in item) && item.expirations > 0 && (
                        <Chip
                          label={`-${item.expirations}`}
                          size="small"
                          sx={{ 
                            bgcolor: alpha('#ef4444', 0.1), 
                            color: '#ef4444', 
                            fontSize: { xs: '0.65rem', md: '0.7rem' }, 
                            height: { xs: 18, md: 20 }
                          }}
                        />
                      )}
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        'registrations' in item
                          ? (item.registrations /
                              Math.max(
                                ...data
                                  .filter((d): d is { date: string; registrations: number; activations: number; expirations: number } => 'registrations' in d)
                                  .map(d => d.registrations)
                              )
                            ) * 100
                          : 0
                      }
                      sx={{
                        height: { xs: 3, md: 4 },
                        borderRadius: 2,
                        bgcolor: alpha(color, 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: color,
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{ 
        width: '100%',
        minWidth: isMobile ? '100%' : '400px'
      }}
    >
      <Card
        elevation={0}
        sx={{
          border: '1px solid #f1f5f9',
          borderRadius: { xs: 3, md: 4 },
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          height: '100%',
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: { xs: 2, md: 3 },
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: { xs: 2, sm: 0 }
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              flex: { xs: '1 1 100%', sm: '1 1 auto' }
            }}>
              <Avatar
                sx={{
                  width: { xs: 40, md: 44 },
                  height: { xs: 40, md: 44 },
                  bgcolor: alpha(color, 0.1),
                  color: color,
                  borderRadius: 3,
                }}
              >
                {icon}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  mb: 0.5, 
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}>
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="body2" sx={{ 
                    color: '#64748b', 
                    fontSize: { xs: '0.8rem', md: '0.85rem' }
                  }}>
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              justifyContent: { xs: 'space-between', sm: 'flex-end' }
            }}>
              <Chip
                label={type.toUpperCase()}
                size="small"
                sx={{
                  bgcolor: alpha(color, 0.1),
                  color: color,
                  fontWeight: 700,
                  fontSize: { xs: '0.65rem', md: '0.7rem' },
                  height: { xs: 20, md: 24 },
                }}
              />
              {onExport && !isMobile && (
                <IconButton
                  size="small"
                  onClick={onExport}
                  sx={{
                    color: color,
                    bgcolor: alpha(color, 0.1),
                    '&:hover': {
                      bgcolor: alpha(color, 0.2),
                    }
                  }}
                >
                  <Download sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>
          </Box>

          {renderChart()}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  loading: propLoading = false
}) => {
  const { user } = useAuth();
  const { stats } = useSocios();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalMembers: 0,
    activeMembers: 0,
    expiredMembers: 0,
    inactiveMembers: 0,
    growthRate: 0,
    retentionRate: 0,
    averageLifetime: 0,
    engagementScore: 0,
    monthlyTrends: [],
    statusDistribution: [],
    engagementLevels: [],
    activityTimeline: [],
    topMetrics: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch analytics data from Firebase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Calculate date range
        const endDate = new Date();
        const startDate = subDays(endDate, dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90);

        // Fetch activities for the date range
        const activitiesRef = collection(db, 'activities');
        const activitiesQuery = query(
          activitiesRef,
          where('asociacionId', '==', user.uid),
          where('timestamp', '>=', Timestamp.fromDate(startDate)),
          where('timestamp', '<=', Timestamp.fromDate(endDate)),
          orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(activitiesQuery, (snapshot) => {
          interface Activity {
            id: string;
            type?: string;
            timestamp?: Timestamp;
            [key: string]: unknown;
          }
          const activities: Activity[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          // Calculate growth rate
          const memberAdditions = activities.filter(a => a.type === 'member_added').length;
          const growthRate = stats.total > 0 ? (memberAdditions / stats.total) * 100 : 0;

          // Calculate retention rate
          const retentionRate = stats.total > 0 ? (stats.activos / stats.total) * 100 : 0;

          // Calculate average lifetime (mock calculation)
          const averageLifetime = 18.5 + (Math.random() * 10 - 5); // 18.5 ± 5 months

          // Calculate engagement score
          const engagementScore = Math.min(100, (stats.activos / Math.max(stats.total, 1)) * 100 + (memberAdditions * 5));

          // Generate monthly trends
          const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
            const date = subDays(endDate, (5 - i) * 30);
            return {
              month: format(date, 'MMM', { locale: es }),
              members: Math.floor(stats.total * (0.8 + Math.random() * 0.4)), // Mock data
              growth: Math.floor(Math.random() * 20 - 5), // -5% to +15%
            };
          });

          // Status distribution
          const total = stats.total || 1;
          const statusDistribution = [
            {
              name: 'Activos',
              value: stats.activos,
              color: '#10b981',
              percentage: Math.round((stats.activos / total) * 100),
            },
            {
              name: 'Vencidos',
              value: stats.vencidos,
              color: '#ef4444',
              percentage: Math.round((stats.vencidos / total) * 100),
            },
            {
              name: 'Inactivos',
              value: stats.inactivos,
              color: '#6b7280',
              percentage: Math.round((stats.inactivos / total) * 100),
            },
          ];

          // Engagement levels (mock data based on real stats)
          const engagementLevels = [
            {
              level: 'Muy Alto',
              count: Math.floor(stats.activos * 0.2),
              percentage: 20,
            },
            {
              level: 'Alto',
              count: Math.floor(stats.activos * 0.3),
              percentage: 30,
            },
            {
              level: 'Medio',
              count: Math.floor(stats.activos * 0.35),
              percentage: 35,
            },
            {
              level: 'Bajo',
              count: Math.floor(stats.activos * 0.15),
              percentage: 15,
            },
          ];

          // Activity timeline
          const activityTimeline = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(endDate, 6 - i);
            const dayActivities = activities.filter(a => {
              if (!a.timestamp) return false;
              const activityDate = a.timestamp.toDate();
              return activityDate >= startOfDay(date) && activityDate <= endOfDay(date);
            });

            return {
              date: format(date, 'dd/MM', { locale: es }),
              registrations: dayActivities.filter(a => a.type === 'member_added').length,
              activations: dayActivities.filter(a => a.type === 'member_updated').length,
              expirations: Math.floor(Math.random() * 3), // Mock data
            };
          });

          // Top metrics
          const topMetrics = [
            {
              title: 'Nuevos Registros',
              value: memberAdditions,
              change: Math.floor(Math.random() * 30 - 10),
              trend: memberAdditions > 5 ? 'up' as const : 'neutral' as const,
            },
            {
              title: 'Tasa de Conversión',
              value: Math.round(retentionRate),
              change: Math.floor(Math.random() * 20 - 5),
              trend: retentionRate > 80 ? 'up' as const : retentionRate < 60 ? 'down' as const : 'neutral' as const,
            },
            {
              title: 'Engagement Score',
              value: Math.round(engagementScore),
              change: Math.floor(Math.random() * 15 - 5),
              trend: engagementScore > 75 ? 'up' as const : 'neutral' as const,
            },
          ];

          setAnalyticsData({
            totalMembers: stats.total,
            activeMembers: stats.activos,
            expiredMembers: stats.vencidos,
            inactiveMembers: stats.inactivos,
            growthRate: Math.round(growthRate * 100) / 100,
            retentionRate: Math.round(retentionRate * 100) / 100,
            averageLifetime: Math.round(averageLifetime * 100) / 100,
            engagementScore: Math.round(engagementScore * 100) / 100,
            monthlyTrends,
            statusDistribution,
            engagementLevels,
            activityTimeline,
            topMetrics,
          });
        });

        return () => unsubscribe();

      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Error al cargar los datos de analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user, stats, dateRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
      window.location.reload();
    }, 1000);
  };

  const handleExport = (chartType: string) => {
    // Mock export functionality
    const csvData = [
      ['Métrica', 'Valor', 'Cambio'],
      ['Total Socios', analyticsData.totalMembers.toString(), `${analyticsData.growthRate}%`],
      ['Socios Activos', analyticsData.activeMembers.toString(), `${analyticsData.retentionRate}%`],
      ['Engagement Score', analyticsData.engagementScore.toString(), ''],
      ['Tiempo Promedio', `${analyticsData.averageLifetime} meses`, ''],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-${chartType}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const metrics = useMemo(() => [
    {
      title: 'Total de Socios',
      value: analyticsData.totalMembers.toLocaleString(),
      change: analyticsData.growthRate,
      icon: <Group sx={{ fontSize: { xs: 24, md: 28 } }} />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      delay: 0,
      subtitle: 'Crecimiento total',
      trend: analyticsData.growthRate > 0 ? 'up' as const : analyticsData.growthRate < 0 ? 'down' as const : 'neutral' as const,
      loading: loading || propLoading
    },
    {
      title: 'Tasa de Retención',
      value: `${analyticsData.retentionRate}%`,
      change: analyticsData.retentionRate - 75, // Compare against 75% baseline
      icon: <Star sx={{ fontSize: { xs: 24, md: 28 } }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      delay: 0.1,
      subtitle: 'Socios activos',
      trend: analyticsData.retentionRate > 80 ? 'up' as const : analyticsData.retentionRate < 60 ? 'down' as const : 'neutral' as const,
      loading: loading || propLoading
    },
    {
      title: 'Engagement Score',
      value: `${analyticsData.engagementScore}%`,
      change: analyticsData.engagementScore - 70, // Compare against 70% baseline
      icon: <Speed sx={{ fontSize: { xs: 24, md: 28 } }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      delay: 0.2,
      subtitle: 'Nivel de participación',
      trend: analyticsData.engagementScore > 75 ? 'up' as const : analyticsData.engagementScore < 50 ? 'down' as const : 'neutral' as const,
      loading: loading || propLoading
    },
    {
      title: 'Tiempo Promedio',
      value: `${analyticsData.averageLifetime}m`,
      change: analyticsData.averageLifetime - 18, // Compare against 18 months baseline
      icon: <Schedule sx={{ fontSize: { xs: 24, md: 28 } }} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      delay: 0.3,
      subtitle: 'Permanencia media',
      trend: analyticsData.averageLifetime > 20 ? 'up' as const : analyticsData.averageLifetime < 15 ? 'down' as const : 'neutral' as const,
      loading: loading || propLoading
    }
  ], [analyticsData, loading, propLoading]);

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 0,
      maxWidth: '100%', 
      overflow: 'hidden' 
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: { xs: 3, md: 4 },
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 3, md: 0 }
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 2, md: 3 },
              textAlign: { xs: 'center', md: 'left' },
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Avatar
                sx={{
                  width: { xs: 56, md: 64 },
                  height: { xs: 56, md: 64 },
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                  boxShadow: '0 12px 40px rgba(99, 102, 241, 0.3)',
                }}
              >
                <Analytics sx={{ fontSize: { xs: 28, md: 32 } }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                    background: 'linear-gradient(135deg, #0f172a 0%, #6366f1 60%, #8b5cf6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.03em',
                    lineHeight: 0.9,
                    mb: 1,
                  }}
                >
                  Analytics Avanzado
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#64748b',
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' },
                  }}
                >
                  Insights profundos y métricas de rendimiento • {user?.email?.split('@')[0] || 'Administrador'}
                </Typography>
              </Box>
            </Box>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              alignItems="center"
              sx={{ width: { xs: '100%', md: 'auto' } }}
            >
              <FormControl size="small" sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}>
                <InputLabel>Período</InputLabel>
                <Select
                  value={dateRange}
                  label="Período"
                  onChange={(e) => setDateRange(e.target.value)}
                  sx={{ bgcolor: 'white' }}
                >
                  <MenuItem value="7d">7 días</MenuItem>
                  <MenuItem value="30d">30 días</MenuItem>
                  <MenuItem value="90d">90 días</MenuItem>
                </Select>
              </FormControl>
              
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  bgcolor: alpha('#6366f1', 0.1),
                  color: '#6366f1',
                  '&:hover': {
                    bgcolor: alpha('#6366f1', 0.2),
                  },
                }}
              >
                {refreshing ? <CircularProgress size={20} /> : <Refresh />}
              </IconButton>
              
              <Button
                onClick={() => handleExport('general')}
                variant="contained"
                startIcon={<Download />}
                size={isMobile ? "medium" : "large"}
                sx={{
                  py: { xs: 1.5, md: 2 },
                  px: { xs: 3, md: 4 },
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Exportar
              </Button>
            </Stack>
          </Box>
          
          {/* Status Banner */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: alpha('#6366f1', 0.05),
              border: `2px solid ${alpha('#6366f1', 0.15)}`,
              borderRadius: { xs: 3, md: 4 },
              p: { xs: 2, md: 3 },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 2, md: 3 },
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 } }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: '#6366f1',
                    borderRadius: '50%',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                      '50%': { opacity: 0.5, transform: 'scale(1.1)' },
                    },
                  }}
                />
                <Typography variant="body1" sx={{ 
                  color: '#5b21b6', 
                  fontWeight: 700, 
                  fontSize: { xs: '0.95rem', md: '1.1rem' }
                }}>
                  <Box component="span" sx={{ fontWeight: 900 }}>Analytics en tiempo real</Box> - Datos actualizados automáticamente
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CalendarToday sx={{ fontSize: 18, color: '#8b5cf6' }} />
                <Typography variant="body2" sx={{ 
                  color: '#8b5cf6', 
                  fontWeight: 700,
                  fontSize: { xs: '0.8rem', md: '0.9rem' }
                }}>
                  Período: {dateRange === '7d' ? '7 días' : dateRange === '30d' ? '30 días' : '90 días'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </motion.div>

      {/* Metrics Cards */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: { xs: 2, md: 3 },
        mb: { xs: 4, md: 6 }
      }}>
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </Box>

      {/* Charts Section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: { xs: 3, md: 4 }
      }}>
        {/* First Row - Monthly Trends and Status Distribution */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'repeat(2, 1fr)'
          },
          gap: { xs: 3, md: 4 },
          alignItems: 'stretch'
        }}>
          <ChartCard
            title="Tendencias Mensuales"
            subtitle="Evolución de socios en el tiempo"
            data={analyticsData.monthlyTrends}
            color="#6366f1"
            type="line"
            icon={<ShowChart />}
            onExport={() => handleExport('monthly-trends')}
          />
          <ChartCard
            title="Distribución de Estados"
            subtitle="Clasificación actual de socios"
            data={analyticsData.statusDistribution}
            color="#10b981"
            type="pie"
            icon={<PieChart />}
            onExport={() => handleExport('status-distribution')}
          />
        </Box>

        {/* Second Row - Engagement Levels and Activity Timeline */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'repeat(2, 1fr)'
          },
          gap: { xs: 3, md: 4 },
          alignItems: 'stretch'
        }}>
          <ChartCard
            title="Niveles de Engagement"
            subtitle="Participación de socios por categoría"
            data={analyticsData.engagementLevels}
            color="#8b5cf6"
            type="bar"
            icon={<BarChart />}
            onExport={() => handleExport('engagement-levels')}
          />
          <ChartCard
            title="Timeline de Actividad"
            subtitle="Actividad diaria de los últimos 7 días"
            data={analyticsData.activityTimeline}
            color="#f59e0b"
            type="timeline"
            icon={<Timeline />}
            onExport={() => handleExport('activity-timeline')}
          />
        </Box>
      </Box>
    </Box>
  );
};