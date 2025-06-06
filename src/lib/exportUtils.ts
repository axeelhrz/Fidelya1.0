import { AdminOrderView, OrderMetrics } from '@/types/adminOrder'
import { formatAdminCurrency, formatAdminDate } from './adminUtils'

export interface ExportData {
  orders: AdminOrderView[]
  metrics: OrderMetrics
  filters: any
}

export class ExportUtils {
  static generateExcelData(data: ExportData): any[] {
    const { orders } = data
    
    return orders.map(order => ({
      'Fecha del Pedido': formatAdminDate(order.createdAt),
      'Cliente': `${order.user.firstName} ${order.user.lastName}`,
      'Email': order.user.email,
      'Tipo de Usuario': order.user.userType === 'estudiante' ? 'Estudiante' : 'Funcionario',
      'Estado': order.status === 'paid' ? 'Pagado' : order.status === 'pending' ? 'Pendiente' : 'Cancelado',
      'Total': formatAdminCurrency(order.total),
      'Cantidad de Items': order.itemsCount,
      'Incluye Colaciones': order.hasColaciones ? 'Sí' : 'No',
      'Fecha de Pago': order.paidAt ? formatAdminDate(order.paidAt) : 'No pagado',
      'ID de Pago': order.paymentId || 'N/A'
    }))
  }

  static generatePDFContent(data: ExportData): string {
    const { orders, metrics, filters } = data
    
    let content = `
# Reporte de Pedidos - Casino Escolar

## Resumen General
- **Total de Pedidos**: ${metrics.totalOrders}
- **Recaudación Total**: ${formatAdminCurrency(metrics.totalRevenue)}
- **Valor Promedio por Pedido**: ${formatAdminCurrency(metrics.averageOrderValue)}
- **Pedidos Pagados**: ${metrics.paidOrders}
- **Pedidos Pendientes**: ${metrics.pendingOrders}

## Filtros Aplicados
- **Semana**: ${filters.weekStart || 'Todas'}
- **Tipo de Usuario**: ${filters.userType === 'all' ? 'Todos' : filters.userType}
- **Estado**: ${filters.status === 'all' ? 'Todos' : filters.status}

## Detalle de Pedidos

| Fecha | Cliente | Tipo | Estado | Total |
|-------|---------|------|--------|-------|
`
    
    orders.forEach(order => {
      content += `| ${formatAdminDate(order.createdAt)} | ${order.user.firstName} ${order.user.lastName} | ${order.user.userType} | ${order.status} | ${formatAdminCurrency(order.total)} |\n`
    })
    
    return content
  }

  static downloadAsExcel(data: ExportData, filename: string = 'pedidos-casino-escolar.xlsx') {
    const excelData = this.generateExcelData(data)
    
    // Crear CSV como alternativa simple
    const headers = Object.keys(excelData[0] || {})
    const csvContent = [
      headers.join(','),
      ...excelData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename.replace('.xlsx', '.csv'))
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  static downloadAsPDF(data: ExportData, filename: string = 'pedidos-casino-escolar.pdf') {
    const content = this.generatePDFContent(data)
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename.replace('.pdf', '.txt'))
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  static async exportOrders(data: ExportData, format: 'excel' | 'pdf' = 'excel') {
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `pedidos-casino-escolar-${timestamp}`
    
    if (format === 'excel') {
      this.downloadAsExcel(data, `${filename}.xlsx`)
    } else {
      this.downloadAsPDF(data, `${filename}.pdf`)
    }
  }
}
