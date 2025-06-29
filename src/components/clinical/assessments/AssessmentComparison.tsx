'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  ArrowRight,
  X,
  Filter,
  Eye
} from 'lucide-react';
import { Assessment, Patient } from '@/types/clinical';

interface AssessmentComparisonProps {
  patient: Patient;
  assessments: Assessment[];
  onClose: () => void;
}

interface ComparisonData {
  testName: string;
  baseline: Assessment;
  latest: Assessment;
  change: number;
  percentChange: number;
  isImprovement: boolean;
  sessions: number;
  timespan: number; // days
}

export function AssessmentComparison({
  patient,
  assessments,
  onClose
}: AssessmentComparisonProps) {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [comparisonType, setComparisonType] = useState<'pre-post' | 'timeline' | 'percentile'>('pre-post');
  const [timeframe, setTimeframe] = useState<'all' | '3months' | '6months' | '1year'>('all');

  const comparisonData = useMemo(() => {
    const testGroups = assessments.reduce((groups, assessment) => {
      if (!groups[assessment.testName]) {
        groups[assessment.testName] = [];
      }
      groups[assessment.testName].push(assessment);
      return groups;
    }, {} as { [key: string]: Assessment[] });

    const comparisons: ComparisonData[] = [];

    Object.entries(testGroups).forEach(([testName, testAssessments]) => {
      if (testAssessments.length < 2) return;

      const sortedAssessments = testAssessments
        .filter(a => a.status === 'completed')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (sortedAssessments.length < 2) return;

      const baseline = sortedAssessments[0];
      const latest = sortedAssessments[sortedAssessments.length - 1];
      
      const change = latest.score - baseline.score;
      const percentChange = Math.abs((change / baseline.score) * 100);
      
      // For depression/anxiety tests, lower scores are better
      const isImprovement = testName.toLowerCase().includes('depression') || 
                           testName.toLowerCase().includes('anxiety') || 
                           testName.toLowerCase().includes('phq') || 
                           testName.toLowerCase().includes('gad')
                           ? change < 0 
                           : change > 0;

      const timespan = Math.floor(
        (new Date(latest.date).getTime() - new Date(baseline.date).getTime()) / (1000 * 60 * 60 * 24)
      );

      comparisons.push({
        testName,
        baseline,
        latest,
        change: Math.abs(change),
        percentChange: Math.round(percentChange),
        isImprovement,
        sessions: sortedAssessments.length,
        timespan
      });
    });

    return comparisons.sort((a, b) => b.percentChange - a.percentChange);
  }, [assessments]);

  const filteredComparisons = useMemo(() => {
    let filtered = comparisonData;

    if (timeframe !== 'all') {
      const cutoffDate = new Date();
      const days = timeframe === '3months' ? 90 : timeframe === '6months' ? 180 : 365;
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filtered = filtered.filter(comp => new Date(comp.latest.date) >= cutoffDate);
    }

    if (selectedTests.length > 0) {
      filtered = filtered.filter(comp => selectedTests.includes(comp.testName));
    }

    return filtered;
  }, [comparisonData, timeframe, selectedTests]);

  const overallStats = useMemo(() => {
    if (filteredComparisons.length === 0) return null;

    const improvements = filteredComparisons.filter(comp => comp.isImprovement).length;
    const deteriorations = filteredComparisons.filter(comp => !comp.isImprovement).length;
    const avgChange = filteredComparisons.reduce((sum, comp) => sum + comp.percentChange, 0) / filteredComparisons.length;
    const avgTimespan = filteredComparisons.reduce((sum, comp) => sum + comp.timespan, 0) / filteredComparisons.length;

    return {
      improvements,
      deteriorations,
      improvementRate: Math.round((improvements / filteredComparisons.length) * 100),
      avgChange: Math.round(avgChange),
      avgTimespan: Math.round(avgTimespan)
    };
  }, [filteredComparisons]);

  const getScoreInterpretation = (score: number, testName: string) => {
    const interpretations: { [key: string]: { ranges: Array<{ min: number; max: number; label: string; color: string }> } } = {
      'phq-9': {
        ranges: [
          { min: 0, max: 4, label: 'Mínima', color: '#10B981' },
          { min: 5, max: 9, label: 'Leve', color: '#F59E0B' },
          { min: 10, max: 14, label: 'Moderada', color: '#EF4444' },
          { min: 15, max: 19, label: 'Moderadamente severa', color: '#DC2626' },
          { min: 20, max: 27, label: 'Severa', color: '#991B1B' }
        ]
      },
      'gad-7': {
        ranges: [
          { min: 0, max: 4, label: 'Mínima', color: '#10B981' },
          { min: 5, max: 9, label: 'Leve', color: '#F59E0B' },
          { min: 10, max: 14, label: 'Moderada', color: '#EF4444' },
          { min: 15, max: 21, label: 'Severa', color: '#DC2626' }
        ]
      }
    };

    const testKey = testName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const testRanges = interpretations[testKey];
    if (!testRanges) return { label: 'No disponible', color: '#6B7280' };

    const range = testRanges.ranges.find(r => score >= r.min && score <= r.max);
    return range || { label: 'Fuera de rango', color: '#6B7280' };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          maxWidth: '1200px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Comparación de Evaluaciones
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              Análisis de progreso para {patient.firstName} {patient.lastName}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#6366F1',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <Download size={16} />
              Exportar Reporte
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                padding: '0.5rem',
                backgroundColor: '#F3F4F6',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <X size={16} color="#6B7280" />
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#F9FAFB',
          borderRadius: '0.75rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.25rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Tipo de Comparación
            </label>
            <select
              value={comparisonType}
              onChange={(e) => setComparisonType(e.target.value as any)}
              style={{
                padding: '0.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="pre-post">Pre/Post Tratamiento</option>
              <option value="timeline">Línea de Tiempo</option>
              <option value="percentile">Percentiles</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.25rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Período de Tiempo
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              style={{
                padding: '0.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="all">Todo el período</option>
              <option value="3months">Últimos 3 meses</option>
              <option value="6months">Últimos 6 meses</option>
              <option value="1year">Último año</option>
            </select>
          </div>
        </div>

        {/* Overall Stats */}
        {overallStats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#F0FDF4',
              borderRadius: '0.75rem',
              border: '1px solid #BBF7D0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <TrendingUp size={20} color="#16A34A" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
