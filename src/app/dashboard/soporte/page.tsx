'use client';

import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import HelpHeader from '@/components/dashboard/helpCenter/help-header';
import SearchSection from '@/components/dashboard/helpCenter/search-section';
import PopularArticles from '@/components/dashboard/helpCenter/popular-articles';
import DynamicFAQ from '@/components/dashboard/helpCenter/dynamic-faq';
import SmartSuggestions from '@/components/dashboard/helpCenter/smart-suggestion';
import ContextualAssistant from '@/components/dashboard/helpCenter/contextual-assistant';
import SupportRequestForm from '@/components/dashboard/helpCenter/support-request-form';
import FeedbackPanel from '@/components/dashboard/helpCenter/feedback-panel';
import TutorialsSection from '@/components/dashboard/helpCenter/tutorial-section';
import AdvancedDocs from '@/components/dashboard/helpCenter/advanced-docs';
import SystemStatus from '@/components/dashboard/helpCenter/system-status';
import QuickNotesWidget from '@/components/dashboard/helpCenter/quick-note-widget';
import { useHelpCenter } from '@/hooks/use-help-center';
import LoadingScreen from '@/components/core/loadingScreen';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function HelpCenterPage() {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { loading, userStats, incrementArticleView } = useHelpCenter();
  const [showAssistant, setShowAssistant] = useState(false);

  useEffect(() => {
    // Mostrar asistente después de 5 segundos si el usuario tiene plan Pro o Enterprise
    if (subscription?.plan && ['pro', 'enterprise'].includes(subscription.plan.toString())) {
      const timer = setTimeout(() => {
        setShowAssistant(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [subscription]);

  if (loading || !user) {
    return <LoadingScreen />;
  }

  const isPremium = !!subscription?.plan && ['pro', 'enterprise'].includes(subscription.plan.toString());

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <HelpHeader userStats={userStats} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <SearchSection />
        </motion.div>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, mt: 4 }}>
          <Box sx={{ flex: 2 }}>
            <motion.div variants={itemVariants}>
              <SmartSuggestions isPremium={isPremium} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <PopularArticles onArticleView={incrementArticleView} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <DynamicFAQ />
            </motion.div>
            
            {isPremium && (
              <motion.div variants={itemVariants}>
                <TutorialsSection />
              </motion.div>
            )}
          </Box>
          
          <Box sx={{ flex: 1 }}>
            {isPremium && (
              <motion.div variants={itemVariants}>
                <SupportRequestForm />
              </motion.div>
            )}
            
            <motion.div variants={itemVariants}>
              <SystemStatus />
            </motion.div>
            
            {isPremium && (
              <motion.div variants={itemVariants}>
                <FeedbackPanel />
              </motion.div>
            )}
            
            {isPremium && (
              <motion.div variants={itemVariants}>
                <AdvancedDocs />
              </motion.div>
            )}
          </Box>
        </Box>
      </motion.div>
      
      {isPremium && showAssistant && (
        <ContextualAssistant onClose={() => setShowAssistant(false)} />
      )}
      
      {isPremium && (
        <QuickNotesWidget />
      )}
    </Container>
  );
}