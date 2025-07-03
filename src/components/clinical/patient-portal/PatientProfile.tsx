'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Heart,
  AlertTriangle,
} from 'lucide-react';
import { usePatientData } from '@/hooks/usePatientData';

type EditedPatientData = {
  phone: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
  };
};

export function PatientProfile() {
  const { data, loading } = usePatientData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<EditedPatientData | null>(null);

  if (loading || !data) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #E2E8F0',
          borderTop: '4px solid #3B82F6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const { patient } = data;

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleEdit = () => {
    setEditedData({
      phone: patient.phone,
      emergencyContact: {
        name: patient.emergencyContact?.name ?? '',
        relationship: patient.emergencyContact?.relationship ?? '',
        phone: patient.emergencyContact?.phone ?? ''
      },
      address: {
        street: patient.address?.street ?? '',
        city: patient.address?.city ?? '',
        state: patient.address?.state,
        zipCode: patient.address?.zipCode ?? '',
        country: patient.address?.country ?? ''
      }
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Aquí implementarías la lógica para guardar los cambios
    console.log('Saving changes:', editedData);
    setIsEditing(false);
    setEditedData(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(null);
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1E293B',
            margin: 0,
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Mi Perfil
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#64748B',
            margin: '0.5rem 0 0 0',
            fontFamily: 'Inter, sans-serif'
          }}>
            Información personal y clínica
          </p>
        </div>

        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEdit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <Edit size={16} />
            Editar Perfil
          </motion.button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <Save size={16} />
              Guardar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancel}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <X size={16} />
              Cancelar
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}
      >
        {/* Avatar and Basic Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          marginBottom: '2rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid #E2E8F0'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #DBEAFE'
          }}>
            <User size={48} color="#3B82F6" />
          </div>
          
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#1E293B',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {patient.firstName} {patient.lastName}
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#64748B',
              margin: '0.5rem 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              {calculateAge(patient.dateOfBirth)} años • {patient.gender === 'male' ? 'Masculino' : patient.gender === 'female' ? 'Femenino' : 'Otro'}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <span style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ECFDF5',
                color: '#10B981',
                borderRadius: '1rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }}>
                Paciente Activo
              </span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981'
                }} />
                <span style={{
                  fontSize: '0.875rem',
                  color: '#64748B',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Riesgo: {patient.riskLevel === 'low' ? 'Bajo' : patient.riskLevel === 'medium' ? 'Medio' : 'Alto'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#1E293B',
            margin: '0 0 1rem 0',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Información de Contacto
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Mail size={20} color="#64748B" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Correo Electrónico
                </span>
              </div>
              <p style={{
                fontSize: '1rem',
                color: '#1E293B',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                {patient.email}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Phone size={20} color="#64748B" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Teléfono
                </span>
              </div>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData?.phone || ''}
                  onChange={(e) =>
                    setEditedData(prev =>
                      prev
                        ? { ...prev, phone: e.target.value }
                        : {
                            phone: e.target.value,
                            emergencyContact: { name: '', relationship: '', phone: '' },
                            address: { street: '', city: '', zipCode: '', country: '' }
                          }
                    )
                  }
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
              ) : (
                <p style={{
                  fontSize: '1rem',
                  color: '#1E293B',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {patient.phone}
                </p>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Calendar size={20} color="#64748B" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Fecha de Nacimiento
                </span>
              </div>
              <p style={{
                fontSize: '1rem',
                color: '#1E293B',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                {patient.dateOfBirth.toLocaleDateString('es-ES')}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Heart size={20} color="#64748B" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Terapeuta Asignado
                </span>
              </div>
              <p style={{
                fontSize: '1rem',
                color: '#1E293B',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                {patient.assignedTherapist}
              </p>
            </div>
          </div>
        </div>

        {/* Address */}
        {patient.address && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1E293B',
              margin: '0 0 1rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Dirección
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <MapPin size={20} color="#64748B" style={{ marginTop: '0.125rem' }} />
              {isEditing ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Calle y número"
                    value={editedData?.address?.street || ''}
                    onChange={(e) =>
                      setEditedData(prev =>
                        prev
                          ? {
                              ...prev,
                              address: { ...prev.address, street: e.target.value }
                            }
                          : {
                              phone: '',
                              emergencyContact: { name: '', relationship: '', phone: '' },
                              address: {
                                street: e.target.value,
                                city: '',
                                zipCode: '',
                                country: ''
                              }
                            }
                      )
                    }
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Ciudad"
                      value={editedData?.address?.city || ''}
                      onChange={(e) =>
                        setEditedData((prev) =>
                          prev
                            ? {
                                ...prev,
                                address: { ...prev.address, city: e.target.value }
                              }
                            : {
                                phone: '',
                                emergencyContact: { name: '', relationship: '', phone: '' },
                                address: {
                                  street: '',
                                  city: e.target.value,
                                  state: '',
                                  zipCode: '',
                                  country: ''
                                }
                              }
                        )
                      }
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Código Postal"
                      value={editedData?.address?.zipCode || ''}
                      onChange={(e) =>
                        setEditedData((prev) =>
                          prev
                            ? {
                                ...prev,
                                address: { ...prev.address, zipCode: e.target.value }
                              }
                            : {
                                phone: '',
                                emergencyContact: { name: '', relationship: '', phone: '' },
                                address: {
                                  street: '',
                                  city: '',
                                  zipCode: e.target.value,
                                  country: ''
                                }
                              }
                        )
                      }
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="País"
                      value={editedData?.address?.country || ''}
                      onChange={(e) =>
                        setEditedData((prev) =>
                          prev
                            ? {
                                ...prev,
                                address: { ...prev.address, country: e.target.value }
                              }
                            : {
                                phone: '',
                                emergencyContact: { name: '', relationship: '', phone: '' },
                                address: {
                                  street: '',
                                  city: '',
                                  state: '',
                                  zipCode: '',
                                  country: e.target.value
                                }
                              }
                        )
                      }
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{
                    fontSize: '1rem',
                    color: '#1E293B',
                    margin: 0,
                    lineHeight: 1.5,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {patient.address.street}<br />
                    {patient.address.city}, {patient.address.state} {patient.address.zipCode}<br />
                    {patient.address.country}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Emergency Contact */}
        {patient.emergencyContact && (
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1E293B',
              margin: '0 0 1rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Contacto de Emergencia
            </h3>
            
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#FEF2F2',
              borderRadius: '0.75rem',
              border: '1px solid #FECACA'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <AlertTriangle size={20} color="#EF4444" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#991B1B',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Información de Contacto de Emergencia
                </span>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#7F1D1D',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Nombre:
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData?.emergencyContact?.name || ''}
                      onChange={(e) =>
                        setEditedData((prev) =>
                          prev
                            ? {
                                ...prev,
                                emergencyContact: {
                                  ...prev.emergencyContact,
                                  name: e.target.value,
                                },
                              }
                            : {
                                phone: '',
                                emergencyContact: {
                                  name: e.target.value,
                                  relationship: '',
                                  phone: '',
                                },
                                address: {
                                  street: '',
                                  city: '',
                                  zipCode: '',
                                  country: '',
                                },
                              }
                        )
                      }
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #F87171',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        marginTop: '0.25rem'
                      }}
                    />
                  ) : (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#7F1D1D',
                      margin: '0.25rem 0 0 0',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {patient.emergencyContact.name}
                    </p>
                  )}
                </div>
                
                <div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#7F1D1D',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Relación:
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData?.emergencyContact?.relationship || ''}
                      onChange={(e) =>
                        setEditedData((prev) =>
                          prev
                            ? {
                                ...prev,
                                emergencyContact: {
                                  ...prev.emergencyContact,
                                  relationship: e.target.value,
                                },
                              }
                            : {
                                phone: '',
                                emergencyContact: {
                                  name: '',
                                  relationship: e.target.value,
                                  phone: '',
                                },
                                address: {
                                  street: '',
                                  city: '',
                                  zipCode: '',
                                  country: '',
                                },
                              }
                        )
                      }
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #F87171',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        marginTop: '0.25rem'
                      }}
                    />
                  ) : (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#7F1D1D',
                      margin: '0.25rem 0 0 0',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {patient.emergencyContact.relationship}
                    </p>
                  )}
                </div>
                
                <div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#7F1D1D',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Teléfono:
                  </span>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedData?.emergencyContact?.phone || ''}
                      onChange={(e) =>
                        setEditedData((prev) =>
                          prev
                            ? {
                                ...prev,
                                emergencyContact: {
                                  ...prev.emergencyContact,
                                  phone: e.target.value,
                                },
                              }
                            : {
                                phone: '',
                                emergencyContact: {
                                  name: '',
                                  relationship: '',
                                  phone: e.target.value,
                                },
                                address: {
                                  street: '',
                                  city: '',
                                  zipCode: '',
                                  country: '',
                                },
                              }
                        )
                      }
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #F87171',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        marginTop: '0.25rem'
                      }}
                    />
                  ) : (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#7F1D1D',
                      margin: '0.25rem 0 0 0',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {patient.emergencyContact.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Clinical Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#1E293B',
          margin: '0 0 1.5rem 0',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Información Clínica
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 0.75rem 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              Estadísticas de Tratamiento
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                  Total de Sesiones:
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>
                  {patient.totalSessions}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                  Última Sesión:
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>
                  {patient.lastSession?.toLocaleDateString('es-ES') || 'N/A'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                  Fecha de Inicio:
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>
                  {patient.createdAt.toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 0.75rem 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              Etiquetas de Tratamiento
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {patient.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    padding: '0.375rem 0.75rem',
                    backgroundColor: '#EFF6FF',
                    color: '#3B82F6',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
