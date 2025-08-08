import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NotificationType, NotificationPriority, NotificationCategory } from '@/types/notification';

export interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  category: NotificationCategory;
  variables: string[];
  isActive: boolean;
  isSystem: boolean;
  tags: string[];
  actionUrl?: string;
  actionLabel?: string;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    app: boolean;
  };
  scheduling?: {
    enabled: boolean;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time?: string;
  };
  targeting?: {
    userTypes?: string[];
    associations?: string[];
    customFilters?: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  usageCount: number;
  lastUsed?: Date;
}

export interface TemplateVariable {
  name: string;
  description: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'url';
  required: boolean;
  defaultValue?: string;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
}

class NotificationTemplatesService {
  private readonly COLLECTION_NAME = 'notificationTemplates';
  private readonly VARIABLES_COLLECTION = 'templateVariables';

  // Predefined system templates
  private readonly SYSTEM_TEMPLATES: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'usageCount'>[] = [
    {
      name: 'Bienvenida Nuevo Socio',
      description: 'Mensaje de bienvenida para nuevos socios registrados',
      title: '¡Bienvenido a {{asociacion_nombre}}, {{socio_nombre}}!',
      message: 'Nos complace darte la bienvenida a nuestra asociación. Tu membresía ha sido activada exitosamente. Ahora puedes disfrutar de todos los beneficios disponibles en {{comercios_count}} comercios afiliados.',
      type: 'success',
      priority: 'medium',
      category: 'membership',
      variables: ['asociacion_nombre', 'socio_nombre', 'comercios_count'],
      isActive: true,
      isSystem: true,
      tags: ['bienvenida', 'nuevo-socio', 'activacion'],
      actionUrl: '/dashboard/socio/beneficios',
      actionLabel: 'Ver Beneficios',
      channels: { email: true, sms: false, push: true, app: true },
    },
    {
      name: 'Beneficio Utilizado',
      description: 'Confirmación cuando un socio utiliza un beneficio',
      title: 'Beneficio utilizado en {{comercio_nombre}}',
      message: 'Has utilizado exitosamente el beneficio "{{beneficio_nombre}}" en {{comercio_nombre}}. Descuento aplicado: {{descuento}}%. ¡Gracias por ser parte de {{asociacion_nombre}}!',
      type: 'success',
      priority: 'low',
      category: 'general',
      variables: ['comercio_nombre', 'beneficio_nombre', 'descuento', 'asociacion_nombre'],
      isActive: true,
      isSystem: true,
      tags: ['beneficio', 'uso', 'confirmacion'],
      channels: { email: false, sms: true, push: true, app: true },
    },
    {
      name: 'Nuevo Comercio Afiliado',
      description: 'Notificación sobre nuevo comercio que se une a la asociación',
      title: '¡Nuevo comercio disponible: {{comercio_nombre}}!',
      message: 'Nos complace anunciar que {{comercio_nombre}} se ha unido a nuestra red de comercios afiliados. Ahora puedes disfrutar de {{beneficios_count}} nuevos beneficios en {{comercio_categoria}}.',
      type: 'announcement',
      priority: 'medium',
      category: 'general',
      variables: ['comercio_nombre', 'beneficios_count', 'comercio_categoria'],
      isActive: true,
      isSystem: true,
      tags: ['nuevo-comercio', 'afiliacion', 'beneficios'],
      actionUrl: '/dashboard/socio/beneficios',
      actionLabel: 'Explorar Beneficios',
      channels: { email: true, sms: false, push: true, app: true },
    },
    {
      name: 'Recordatorio Cuota Mensual',
      description: 'Recordatorio de pago de cuota mensual',
      title: 'Recordatorio: Cuota mensual de {{mes}} {{año}}',
      message: 'Te recordamos que tu cuota mensual de ${{monto}} correspondiente a {{mes}} {{año}} vence el {{fecha_vencimiento}}. Puedes realizar el pago a través de nuestra plataforma.',
      type: 'warning',
      priority: 'high',
      category: 'payment',
      variables: ['mes', 'año', 'monto', 'fecha_vencimiento'],
      isActive: true,
      isSystem: true,
      tags: ['cuota', 'pago', 'recordatorio'],
      actionUrl: '/dashboard/socio/pagos',
      actionLabel: 'Pagar Ahora',
      channels: { email: true, sms: true, push: true, app: true },
    },
    {
      name: 'Evento Próximo',
      description: 'Notificación sobre eventos próximos de la asociación',
      title: 'Próximo evento: {{evento_nombre}}',
      message: 'Te invitamos a participar en {{evento_nombre}} que se realizará el {{evento_fecha}} a las {{evento_hora}} en {{evento_lugar}}. {{evento_descripcion}}',
      type: 'info',
      priority: 'medium',
      category: 'event',
      variables: ['evento_nombre', 'evento_fecha', 'evento_hora', 'evento_lugar', 'evento_descripcion'],
      isActive: true,
      isSystem: true,
      tags: ['evento', 'invitacion', 'actividad'],
      actionUrl: '/dashboard/socio/eventos',
      actionLabel: 'Ver Detalles',
      channels: { email: true, sms: false, push: true, app: true },
    },
    {
      name: 'Mantenimiento Sistema',
      description: 'Notificación sobre mantenimiento programado del sistema',
      title: 'Mantenimiento programado - {{fecha_mantenimiento}}',
      message: 'Informamos que realizaremos mantenimiento programado el {{fecha_mantenimiento}} de {{hora_inicio}} a {{hora_fin}}. Durante este período, algunos servicios podrían no estar disponibles.',
      type: 'warning',
      priority: 'high',
      category: 'system',
      variables: ['fecha_mantenimiento', 'hora_inicio', 'hora_fin'],
      isActive: true,
      isSystem: true,
      tags: ['mantenimiento', 'sistema', 'programado'],
      channels: { email: true, sms: false, push: true, app: true },
    }
  ];

  // Available template variables
  private readonly TEMPLATE_VARIABLES: Record<string, TemplateVariable> = {
    // User variables
    socio_nombre: { name: 'socio_nombre', description: 'Nombre del socio', type: 'text', required: false },
    socio_email: { name: 'socio_email', description: 'Email del socio', type: 'text', required: false },
    socio_telefono: { name: 'socio_telefono', description: 'Teléfono del socio', type: 'text', required: false },
    
    // Association variables
    asociacion_nombre: { name: 'asociacion_nombre', description: 'Nombre de la asociación', type: 'text', required: false },
    asociacion_email: { name: 'asociacion_email', description: 'Email de la asociación', type: 'text', required: false },
    
    // Commerce variables
    comercio_nombre: { name: 'comercio_nombre', description: 'Nombre del comercio', type: 'text', required: false },
    comercio_categoria: { name: 'comercio_categoria', description: 'Categoría del comercio', type: 'text', required: false },
    comercios_count: { name: 'comercios_count', description: 'Cantidad de comercios', type: 'number', required: false },
    
    // Benefit variables
    beneficio_nombre: { name: 'beneficio_nombre', description: 'Nombre del beneficio', type: 'text', required: false },
    beneficio_descripcion: { name: 'beneficio_descripcion', description: 'Descripción del beneficio', type: 'text', required: false },
    descuento: { name: 'descuento', description: 'Porcentaje de descuento', type: 'number', required: false },
    beneficios_count: { name: 'beneficios_count', description: 'Cantidad de beneficios', type: 'number', required: false },
    
    // Payment variables
    monto: { name: 'monto', description: 'Monto a pagar', type: 'number', required: false },
    fecha_vencimiento: { name: 'fecha_vencimiento', description: 'Fecha de vencimiento', type: 'date', required: false },
    mes: { name: 'mes', description: 'Mes', type: 'text', required: false },
    año: { name: 'año', description: 'Año', type: 'number', required: false },
    
    // Event variables
    evento_nombre: { name: 'evento_nombre', description: 'Nombre del evento', type: 'text', required: false },
    evento_fecha: { name: 'evento_fecha', description: 'Fecha del evento', type: 'date', required: false },
    evento_hora: { name: 'evento_hora', description: 'Hora del evento', type: 'text', required: false },
    evento_lugar: { name: 'evento_lugar', description: 'Lugar del evento', type: 'text', required: false },
    evento_descripcion: { name: 'evento_descripcion', description: 'Descripción del evento', type: 'text', required: false },
    
    // System variables
    fecha_mantenimiento: { name: 'fecha_mantenimiento', description: 'Fecha de mantenimiento', type: 'date', required: false },
    hora_inicio: { name: 'hora_inicio', description: 'Hora de inicio', type: 'text', required: false },
    hora_fin: { name: 'hora_fin', description: 'Hora de fin', type: 'text', required: false },
    
    // Generic variables
    fecha_actual: { name: 'fecha_actual', description: 'Fecha actual', type: 'date', required: false },
    hora_actual: { name: 'hora_actual', description: 'Hora actual', type: 'text', required: false },
  };

  // Initialize system templates
  async initializeSystemTemplates(): Promise<void> {
    try {
      console.log('🔧 Initializing system notification templates...');
      
      for (const template of this.SYSTEM_TEMPLATES) {
        // Check if template already exists
        const existingQuery = query(
          collection(db, this.COLLECTION_NAME),
          where('name', '==', template.name),
          where('isSystem', '==', true)
        );
        
        const existingSnapshot = await getDocs(existingQuery);
        
        if (existingSnapshot.empty) {
          await addDoc(collection(db, this.COLLECTION_NAME), {
            ...template,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: 'system',
            usageCount: 0,
          });
          
          console.log(`✅ Created system template: ${template.name}`);
        }
      }
      
      console.log('✅ System templates initialization completed');
    } catch (error) {
      console.error('❌ Error initializing system templates:', error);
      throw error;
    }
  }

  // Get all templates
  async getTemplates(includeInactive: boolean = false): Promise<NotificationTemplate[]> {
    try {
      const constraints = [orderBy('name', 'asc')];
      
      if (!includeInactive) {
        constraints.unshift(where('isActive', '==', true));
      }
      
      const q = query(collection(db, this.COLLECTION_NAME), ...constraints);
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastUsed: doc.data().lastUsed?.toDate(),
      })) as NotificationTemplate[];
    } catch (error) {
      console.error('❌ Error getting templates:', error);
      throw error;
    }
  }

  // Get template by ID
  async getTemplate(id: string): Promise<NotificationTemplate | null> {
    try {
      const templates = await this.getTemplates(true);
      return templates.find(t => t.id === id) || null;
    } catch (error) {
      console.error('❌ Error getting template:', error);
      throw error;
    }
  }

  // Create new template
  async createTemplate(
    templateData: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'lastUsed'>
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
        ...templateData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        usageCount: 0,
      });
      
      console.log(`✅ Created template: ${templateData.name}`);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating template:', error);
      throw error;
    }
  }

  // Update template
  async updateTemplate(
    id: string,
    updates: Partial<Omit<NotificationTemplate, 'id' | 'createdAt' | 'createdBy' | 'isSystem'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      console.log(`✅ Updated template: ${id}`);
    } catch (error) {
      console.error('❌ Error updating template:', error);
      throw error;
    }
  }

  // Delete template (only custom templates)
  async deleteTemplate(id: string): Promise<void> {
    try {
      const template = await this.getTemplate(id);
      
      if (!template) {
        throw new Error('Template not found');
      }
      
      if (template.isSystem) {
        throw new Error('Cannot delete system templates');
      }
      
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await deleteDoc(docRef);
      
      console.log(`✅ Deleted template: ${id}`);
    } catch (error) {
      console.error('❌ Error deleting template:', error);
      throw error;
    }
  }

  // Increment usage count
  async incrementUsage(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await updateDoc(docRef, {
        usageCount: (await this.getTemplate(id))?.usageCount || 0 + 1,
        lastUsed: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('❌ Error incrementing usage:', error);
    }
  }

  // Get available variables
  getAvailableVariables(): Record<string, TemplateVariable> {
    return this.TEMPLATE_VARIABLES;
  }

  // Parse template with variables
  parseTemplate(template: string, variables: Record<string, any>): string {
    let parsed = template;
    
    // Replace variables in format {{variable_name}}
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      parsed = parsed.replace(regex, String(value || ''));
    });
    
    // Remove any remaining unreplaced variables
    parsed = parsed.replace(/{{[^}]+}}/g, '');
    
    return parsed;
  }

  // Validate template variables
  validateTemplate(title: string, message: string): {
    isValid: boolean;
    errors: string[];
    variables: string[];
  } {
    const errors: string[] = [];
    const variables: string[] = [];
    
    // Extract variables from title and message
    const variableRegex = /{{([^}]+)}}/g;
    const titleVariables = [...title.matchAll(variableRegex)].map(match => match[1].trim());
    const messageVariables = [...message.matchAll(variableRegex)].map(match => match[1].trim());
    
    const allVariables = [...new Set([...titleVariables, ...messageVariables])];
    
    // Check if variables exist in our predefined list
    allVariables.forEach(variable => {
      if (!this.TEMPLATE_VARIABLES[variable]) {
        errors.push(`Variable desconocida: ${variable}`);
      } else {
        variables.push(variable);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      variables,
    };
  }

  // Subscribe to templates changes
  subscribeToTemplates(callback: (templates: NotificationTemplate[]) => void): () => void {
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where('isActive', '==', true),
      orderBy('name', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const templates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastUsed: doc.data().lastUsed?.toDate(),
      })) as NotificationTemplate[];
      
      callback(templates);
    });
  }

  // Get template statistics
  async getTemplateStats(): Promise<{
    total: number;
    active: number;
    system: number;
    custom: number;
    mostUsed: NotificationTemplate[];
    recentlyCreated: NotificationTemplate[];
  }> {
    try {
      const templates = await this.getTemplates(true);
      
      const stats = {
        total: templates.length,
        active: templates.filter(t => t.isActive).length,
        system: templates.filter(t => t.isSystem).length,
        custom: templates.filter(t => !t.isSystem).length,
        mostUsed: templates
          .filter(t => t.usageCount > 0)
          .sort((a, b) => b.usageCount - a.usageCount)
          .slice(0, 5),
        recentlyCreated: templates
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 5),
      };
      
      return stats;
    } catch (error) {
      console.error('❌ Error getting template stats:', error);
      throw error;
    }
  }

  // Duplicate template
  async duplicateTemplate(id: string, newName: string): Promise<string> {
    try {
      const template = await this.getTemplate(id);
      
      if (!template) {
        throw new Error('Template not found');
      }
      
      const duplicatedTemplate = {
        ...template,
        name: newName,
        isSystem: false,
        isActive: true,
      };
      
      // Remove fields that shouldn't be duplicated
      delete (duplicatedTemplate as any).id;
      delete (duplicatedTemplate as any).createdAt;
      delete (duplicatedTemplate as any).updatedAt;
      delete (duplicatedTemplate as any).usageCount;
      delete (duplicatedTemplate as any).lastUsed;
      
      return await this.createTemplate(duplicatedTemplate);
    } catch (error) {
      console.error('❌ Error duplicating template:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const notificationTemplatesService = new NotificationTemplatesService();

// Initialize system templates on service load
if (typeof window !== 'undefined') {
  notificationTemplatesService.initializeSystemTemplates().catch(console.error);
}