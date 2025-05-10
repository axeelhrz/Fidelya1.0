import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Tabs, 
  Tab, 
  Stack, 
  Chip, 
  IconButton, 
  Avatar,
  useTheme,
  Skeleton
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  ThumbUp, 
  NewReleases,
  MoreVert,
  Description,
  Policy,
  People,
  CreditCard,
  Settings
} from '@mui/icons-material';
import { useHelpCenter } from '@/hooks/use-help-center';
import { HelpArticle } from '@/types/help-center';

interface PopularArticlesProps {
  onArticleView: (articleId: string) => void;
}

export default function PopularArticles({ onArticleView }: PopularArticlesProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { popularArticles, likedArticles, recentArticles, loading } = useHelpCenter();
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const getArticleIcon = (tags: string[]) => {
    if (tags.includes('polizas')) return <Policy />;
    if (tags.includes('clientes')) return <People />;
    if (tags.includes('suscripcion')) return <CreditCard />;
    if (tags.includes('configuracion')) return <Settings />;
    return <Description />;
  };
  
  const getArticleColor = (tags: string[]) => {
    if (tags.includes('polizas')) return theme.palette.primary.main;
    if (tags.includes('clientes')) return theme.palette.info.main;
    if (tags.includes('suscripcion')) return theme.palette.warning.main;
    if (tags.includes('configuracion')) return theme.palette.success.main;
    return theme.palette.secondary.main;
  };
  
  const renderArticleCard = (article: HelpArticle) => {
    const icon = getArticleIcon(article.tags);
    const color = getArticleColor(article.tags);
    
    return (
      <motion.div
        key={article.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <Card
          elevation={0}
          onClick={() => onArticleView(article.id)}
          sx={{
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
            background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: isDark 
                ? '0 8px 24px rgba(0, 0, 0, 0.2)' 
                : '0 8px 24px rgba(0, 0, 0, 0.1)',
              borderColor: color,
            }
          }}
        >
          <Box 
            sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center',
              borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
            }}
          >
            <Avatar
              sx={{ 
                bgcolor: `${color}20`, 
                color: color,
                mr: 2
              }}
            >
              {icon}
            </Avatar>
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{ 
                fontWeight: 600,
                fontFamily: "'Sora', sans-serif",
                flexGrow: 1,
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {article.title}
            </Typography>
            <IconButton size="small">
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>
          
          <CardContent sx={{ flexGrow: 1, p: 2 }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mb: 2,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {article.summary}
            </Typography>
            
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {article.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{ 
                    my: 0.5,
                    bgcolor: `${getArticleColor([tag])}10`,
                    color: getArticleColor([tag]),
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    );
  };
  
  const renderSkeletonCards = () => {
    return Array(3).fill(0).map((_, index) => (
      <Card
        key={index}
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
          background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
          }}
        >
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Skeleton variant="text" width="70%" height={32} />
          <Box sx={{ flexGrow: 1 }} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
        
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="95%" height={20} sx={{ mb: 2 }} />
          
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rounded" width={60} height={24} />
            <Skeleton variant="rounded" width={80} height={24} />
          </Stack>
        </CardContent>
      </Card>
    ));
  };
  
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              textTransform: 'none',
              minWidth: 'auto',
              px: 3
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          <Tab 
            icon={<TrendingUp fontSize="small" />} 
            iconPosition="start" 
            label="Más consultados" 
          />
          <Tab 
            icon={<ThumbUp fontSize="small" />} 
            iconPosition="start" 
            label="Más votados" 
          />
          <Tab 
            icon={<NewReleases fontSize="small" />} 
            iconPosition="start" 
            label="Nuevos esta semana" 
          />
        </Tabs>
      </Box>
      
      <AnimatePresence mode="wait">
        <Box key={tabValue}>
          {/* Reemplazamos Grid por Box con display flex y flexWrap */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3,
              '& > *': {
                width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }
              }
            }}
          >
            {loading ? (
              <>
                {[0, 1, 2].map((index) => (
                  <Box key={index} sx={{ flex: '1 1 auto', minWidth: 0 }}>
                    {renderSkeletonCards()[index]}
                  </Box>
                ))}
              </>
            ) : (
              <>
                {tabValue === 0 && popularArticles.map((article) => (
                  <Box key={article.id} sx={{ flex: '1 1 auto', minWidth: 0 }}>
                    {renderArticleCard(article)}
                  </Box>
                ))}
                
                {tabValue === 1 && likedArticles.map((article) => (
                  <Box key={article.id} sx={{ flex: '1 1 auto', minWidth: 0 }}>
                    {renderArticleCard(article)}
                  </Box>
                ))}
                
                {tabValue === 2 && recentArticles.map((article) => (
                  <Box key={article.id} sx={{ flex: '1 1 auto', minWidth: 0 }}>
                    {renderArticleCard(article)}
                  </Box>
                ))}
              </>
            )}
          </Box>
        </Box>
      </AnimatePresence>
    </Box>
  );
}