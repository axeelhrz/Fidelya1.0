import { ReportsData, ReportsFilters, ReportMetadata } from '@/types/reports'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export class ExportUtils {
  static async exportToPDF(data: ReportsData, filters: ReportsFilters, adminUser: any): Promise<void> {
    try {
      // Crear contenido HTML para el PDF
      const htmlContent = this.generatePDFContent(data, filters, adminUser)
      
      // Abrir ventana de impresión
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 250)
      }
    } catch (error) {
      console.error('Error exporting to PDF:', error)
      throw new Error('No se pudo generar el reporte PDF')
    }
  }

  static async exportToExcel(data: ReportsData, filters: ReportsFilters, adminUser: any): Promise<void> {
    try {
      const csvContent = this.generateCSVContent(data, filters, adminUser)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `reporte-casino-escolar-${format(new Date(), 'yyyy-MM-dd')}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      throw new Error('No se pudo generar el reporte Excel')
    }
  }

  private static generatePDFContent(data: ReportsData, filters: ReportsFilters, adminUser: any): string {
    const dateRange = `${format(new Date(filters.dateRange.start), 'dd/MM/yyyy')} - ${format(new Date(filters.dateRange.end), 'dd/MM/yyyy')}`
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reporte Casino Escolar</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
          .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          .stat-value { font-size: 24px; font-weight: bold; color: #3B82F6; }
          .stat-label { font-size: 14px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Reporte Casino Escolar</h1>
          <p>Período: ${dateRange}</p>
          <p>Generado por: ${adminUser?.firstName} ${adminUser?.lastName}</p>
          <p>Fecha: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${data.stats.totalOrders}</div>
            <div class="stat-label">Total Pedidos</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">$${data.stats.totalRevenue.toLocaleString('es-CL')}</div>
            <div class="stat-label">Ingresos Totales</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${data.stats.totalUsers}</div>
            <div class="stat-label">Usuarios Activos</div>
          </div>
        </div>

        <h2>Métricas Diarias</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Día</th>
              <th>Pedidos</th>
              <th>Ingresos</th>
              <th>Usuarios</th>
            </tr>
          </thead>
          <tbody>
            ${data.dailyMetrics.map(metric => `
              <tr>
                <td>${format(new Date(metric.date), 'dd/MM/yyyy')}</td>
                <td>${metric.dayName}</td>
                <td>${metric.totalOrders}</td>
                <td>$${metric.totalRevenue.toLocaleString('es-CL')}</td>
                <td>${metric.uniqueUsers}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>Menús Más Populares</h2>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Pedidos</th>
              <th>Porcentaje</th>
              <th>Ingresos</th>
            </tr>
          </thead>
          <tbody>
            ${data.topMenuItems.map(item => `
              <tr>
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.count}</td>
                <td>${item.percentage.toFixed(1)}%</td>
                <td>$${item.revenue.toLocaleString('es-CL')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Reporte generado automáticamente por el sistema Casino Escolar</p>
        </div>
      </body>
      </html>
    `
  }

  private static generateCSVContent(data: ReportsData, filters: ReportsFilters, adminUser: any): string {
    const dateRange = `${format(new Date(filters.dateRange.start), 'dd/MM/yyyy')} - ${format(new Date(filters.dateRange.end), 'dd/MM/yyyy')}`
    
    let csv = `Reporte Casino Escolar\n`
    csv += `Período:,${dateRange}\n`
    csv += `Generado por:,${adminUser?.firstName} ${adminUser?.lastName}\n`
    csv += `Fecha:,${format(new Date(), 'dd/MM/yyyy HH:mm')}\n\n`

    csv += `RESUMEN ESTADÍSTICO\n`
    csv += `Total Pedidos,${data.stats.totalOrders}\n`
    csv += `Ingresos Totales,$${data.stats.totalRevenue.toLocaleString('es-CL')}\n`
    csv += `Usuarios Activos,${data.stats.totalUsers}\n`
    csv += `Valor Promedio Pedido,$${data.stats.averageOrderValue.toLocaleString('es-CL')}\n\n`

    csv += `MÉTRICAS DIARIAS\n`
    csv += `Fecha,Día,Pedidos,Ingresos,Usuarios,Almuerzos,Colaciones\n`
    data.dailyMetrics.forEach(metric => {
      csv += `${format(new Date(metric.date), 'dd/MM/yyyy')},${metric.dayName},${metric.totalOrders},$${metric.totalRevenue.toLocaleString('es-CL')},${metric.uniqueUsers},${metric.almuerzoOrders},${metric.colacionOrders}\n`
    })

    csv += `\nMENÚS MÁS POPULARES\n`
    csv += `Código,Nombre,Pedidos,Porcentaje,Ingresos\n`
    data.topMenuItems.forEach(item => {
      csv += `${item.code},${item.name},${item.count},${item.percentage.toFixed(1)}%,$${item.revenue.toLocaleString('es-CL')}\n`
    })

    return csv
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  static formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`
  }
}