'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PatientPortalData, MoodLog } from '@/types/clinical';

export function usePatientData() {
  const { user } = useAuth();
  const [data, setData] = useState<PatientPortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      setLoading(false);
      return;
    }

    const fetchPatientData = async () => {
      try {
        setLoading(true);
        
        // Simular datos del paciente autenticado
        const mockData: PatientPortalData = {
          patient: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || '+34 612 345 678',
            dateOfBirth: user.dateOfBirth || new Date('1990-05-15'),
            gender: user.gender || 'male',
            assignedTherapist: 'Dra. Ana García',
            status: 'active',
            tags: ['ansiedad', 'terapia-cognitiva'],
            riskLevel: 'low',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date(),
            totalSessions: 8,
            lastSession: new Date('2024-03-10'),
            address: {
              street: 'Calle Mayor 123, 2º A',
              city: 'Madrid',
              state: 'Madrid',
              zipCode: '28001',
              country: 'España'
            },
            emergencyContact: user.patientInfo?.emergencyContact || {
              name: 'María Pérez',
              relationship: 'Esposa',
              phone: '+34 612 345 679',
              email: 'maria@email.com'
            }
          },
          upcomingAppointments: [
            {
              id: 'apt1',
              date: new Date('2024-03-20'),
              time: '10:00',
              therapistName: 'Dra. Ana García',
              type: 'Sesión Individual',
              status: 'confirmed',
              location: 'Consulta 2',
              isVirtual: false,
              canReschedule: true,
              canCancel: true,
              duration: 60
            },
            {
              id: 'apt2',
              date: new Date('2024-03-27'),
              time: '10:00',
              therapistName: 'Dra. Ana García',
              type: 'Sesión Individual',
              status: 'scheduled',
              location: 'Videollamada',
              isVirtual: true,
              meetingLink: 'https://meet.google.com/abc-defg-hij',
              canReschedule: true,
              canCancel: true,
              duration: 60
            }
          ],
          tasks: [
            {
              id: 'task1',
              patientId: user.id,
              title: 'Registro de pensamientos automáticos',
              description: 'Anota tus pensamientos automáticos negativos durante la semana',
              type: 'homework',
              dueDate: new Date('2024-03-22'),
              status: 'assigned',
              instructions: 'Utiliza la hoja de registro que te proporcioné. Anota al menos 3 situaciones donde notes pensamientos automáticos negativos.',
              resources: [
                {
                  id: 'res1',
                  name: 'Hoja de Registro de Pensamientos',
                  type: 'pdf',
                  url: '/resources/thought-record.pdf',
                  description: 'Plantilla para registrar pensamientos automáticos'
                }
              ],
              priority: 'high',
              estimatedDuration: 15
            },
            {
              id: 'task2',
              patientId: user.id,
              title: 'Ejercicio de respiración diafragmática',
              description: 'Practica la técnica de respiración que aprendimos en sesión',
              type: 'exercise',
              dueDate: new Date('2024-03-25'),
              status: 'in-progress',
              instructions: 'Practica 10 minutos cada día, preferiblemente por la mañana y antes de dormir.',
              resources: [
                {
                  id: 'res2',
                  name: 'Audio Guía de Respiración',
                  type: 'audio',
                  url: '/resources/breathing-guide.mp3',
                  description: 'Audio de 10 minutos para guiar tu práctica'
                }
              ],
              priority: 'medium',
              estimatedDuration: 10
            }
          ],
          recentCommunications: [
            {
              id: 'comm1',
              patientId: user.id,
              type: 'message',
              subject: 'Recordatorio de cita',
              content: 'Te recordamos que tienes una cita programada para mañana a las 10:00 AM.',
              sender: 'Sistema',
              sentAt: new Date('2024-03-19'),
              priority: 'medium',
              requiresResponse: false,
              read: false
            },
            {
              id: 'comm2',
              patientId: user.id,
              type: 'announcement',
              subject: 'Nueva funcionalidad disponible',
              content: 'Ya puedes acceder al registro de emociones diario desde tu portal.',
              sender: 'Centro Psicológico',
              sentAt: new Date('2024-03-18'),
              priority: 'low',
              requiresResponse: false,
              read: true
            }
          ],
          progressSummary: {
            completedTasks: 5,
            totalTasks: 7,
            adherenceRate: 85,
            lastSessionDate: new Date('2024-03-10'),
            nextAppointmentDate: new Date('2024-03-20')
          },
          resources: [
            {
              id: 'resource1',
              title: 'Técnicas de Relajación',
              description: 'Guía completa de técnicas de relajación para la ansiedad',
              type: 'article',
              category: 'Ansiedad',
              url: '/resources/relaxation-techniques',
              duration: 15,
              difficulty: 'beginner',
              tags: ['ansiedad', 'relajación', 'técnicas'],
              isRecommended: true,
              accessCount: 3,
              rating: 4.8
            },
            {
              id: 'resource2',
              title: 'Meditación Guiada - 10 minutos',
              description: 'Sesión de meditación guiada para principiantes',
              type: 'audio',
              category: 'Mindfulness',
              url: '/resources/guided-meditation',
              duration: 10,
              difficulty: 'beginner',
              tags: ['meditación', 'mindfulness', 'relajación'],
              isRecommended: true,
              accessCount: 8,
              rating: 4.9
            }
          ],
          notifications: [
            {
              id: 'notif1',
              patientId: user.id,
              type: 'reminder',
              subject: 'Tarea pendiente',
              content: 'Tienes una tarea que vence mañana: Registro de pensamientos automáticos',
              sender: 'Sistema',
              sentAt: new Date('2024-03-19'),
              priority: 'high',
              requiresResponse: false,
              read: false
            }
          ],
          moodLogs: [
            {
              id: 'mood1',
              patientId: user.id,
              date: new Date('2024-03-19'),
              mood: 7,
              notes: 'Me siento mejor después de la sesión de ayer',
              createdAt: new Date('2024-03-19')
            },
            {
              id: 'mood2',
              patientId: user.id,
              date: new Date('2024-03-18'),
              mood: 5,
              notes: 'Día regular, algo de ansiedad por la tarde',
              createdAt: new Date('2024-03-18')
            }
          ],
          payments: {
            totalPaid: 480,
            pendingAmount: 60,
            invoiceCount: 8,
            history: [
              {
                id: 'pay1',
                amount: 60,
                description: 'Sesión Individual - Marzo 2024',
                date: new Date('2024-03-10'),
                method: 'Tarjeta de Crédito',
                status: 'completed'
              },
              {
                id: 'pay2',
                amount: 60,
                description: 'Sesión Individual - Febrero 2024',
                date: new Date('2024-02-26'),
                method: 'Transferencia Bancaria',
                status: 'completed'
              }
            ]
          }
        };

        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setData(mockData);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos del paciente');
        console.error('Error fetching patient data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user]);

  const addMoodLog = async (mood: number, notes?: string) => {
    if (!data) return;

    const newMoodLog: MoodLog = {
      id: `mood_${Date.now()}`,
      patientId: user!.id,
      date: new Date(),
      mood,
      notes,
      createdAt: new Date()
    };

    setData(prev => ({
      ...prev!,
      moodLogs: [newMoodLog, ...(prev!.moodLogs || [])]
    }));
  };

  const markTaskCompleted = async (taskId: string, feedback?: string) => {
    if (!data) return;

    setData(prev => ({
      ...prev!,
      tasks: prev!.tasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: 'completed' as const,
              completedAt: new Date(),
              feedback 
            }
          : task
      ),
      progressSummary: {
        ...prev!.progressSummary,
        completedTasks: prev!.progressSummary.completedTasks + 1
      }
    }));
  };

  const markNotificationRead = async (notificationId: string) => {
    if (!data) return;

    setData(prev => ({
      ...prev!,
      notifications: prev!.notifications.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true, readAt: new Date() }
          : notif
      ),
      recentCommunications: prev!.recentCommunications.map(comm =>
        comm.id === notificationId
          ? { ...comm, read: true, readAt: new Date() }
          : comm
      )
    }));
  };

  return {
    data,
    loading,
    error,
    addMoodLog,
    markTaskCompleted,
    markNotificationRead,
    refetch: () => {
      if (user?.role === 'patient') {
        setLoading(true);
        // Re-trigger the effect
        setData(null);
      }
    }
  };
}
