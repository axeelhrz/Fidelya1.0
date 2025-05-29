import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
} from '@mui/material';
import {
  Assessment,
  GetApp,
  TrendingUp,
  AttachMoney,
  Inventory,
  ShoppingCart,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import axios from 'axios';

interface SalesReport {
  period: string;
  totalSales: number;
  totalAmount: number;
  products: Record<string, { quantity: number; revenue: number }>;
}

interface ProfitReport {
  summary: {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    totalMargin: number;
  };
  productProfits: Record<string, {
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
  }>;
}

interface TopProduct {
  product: { name: string; unit: string; salePrice: number };
  totalQuantity: number;
  totalRevenue: number;
  totalSales: number;
}

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<string>('sales');
  const [groupBy, setGroupBy] = useState<string>('day');
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState<SalesReport[]>([]);
  const [profitData, setProfitData] = useState<ProfitReport | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [inventoryData, setInventoryData] = useState<any>(null);

  const generateReport = useCallback(async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        ...(reportType === 'sales' && { groupBy }),
      });

      switch (reportType) {
        case 'sales':
          const salesResponse = await axios.get(`/reports/sales?${params}`);
          setSalesData(salesResponse.data);
          break;
        case 'profit':
          const profitResponse = await axios.get(`/reports/profit?${params}`);
          setProfitData(profitResponse.data);
          break;
        case 'top-products':
          const topProductsResponse = await axios.get(`/reports/top-products?${params}&limit=10`);
          setTopProducts(topProductsResponse.data);
          break;
        case 'inventory':
          const inventoryResponse = await axios.get('/reports/inventory');
          setInventoryData(inventoryResponse.data);
          break;
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, reportType, groupBy]);

  const exportReport = () => {
    // TODO: Implement export functionality
  };

  useEffect(() => {
    generateReport();
  }, [reportType, groupBy, startDate, endDate, generateReport]);
  const getReportTitle = () => {
    switch (reportType) {
      case 'sales':
        return 'Reporte de Ventas';
      case 'profit':
        return 'Reporte de Rentabilidad';
      case 'top-products':
        return 'Productos Más Vendidos';
      case 'inventory':
        return 'Reporte de Inventario';
      default:
        return 'Reporte';
    }
  };

  const COLORS = ['#62C370', '#FF8C42', '#4A9B56', '#E6732A', '#8ED49A'];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Reportes
            </Typography>
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              onClick={exportReport}
              disabled={loading}
            >
              Exportar
            </Button>
          </Box>

          {/* Filtros */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Tipo de Reporte</InputLabel>
                  <Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    label="Tipo de Reporte"
                  >
                    <MenuItem value="sales">Ventas</MenuItem>
                    <MenuItem value="profit">Rentabilidad</MenuItem>
                    <MenuItem value="top-products">Productos Top</MenuItem>
                    <MenuItem value="inventory">Inventario</MenuItem>
                  </Select>
                </FormControl>

                {reportType === 'sales' && (
                  <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Agrupar por</InputLabel>
                    <Select
                      value={groupBy}
                      onChange={(e) => setGroupBy(e.target.value)}
                      label="Agrupar por"
                    >
                      <MenuItem value="day">Día</MenuItem>
                      <MenuItem value="week">Semana</MenuItem>
                      <MenuItem value="month">Mes</MenuItem>
                    </Select>
                  </FormControl>
                )}

                {reportType !== 'inventory' && (
                  <>
                    <DatePicker
                      label="Fecha Inicio"
                      value={startDate}
                      onChange={setStartDate}
                      slots={{
                        textField: TextField,
                      }}
                      slotProps={{
                        textField: {
                          sx: { minWidth: 150 },
                        },
                      }}
                    />

                    <DatePicker
                      label="Fecha Fin"
                      value={endDate}
                      onChange={setEndDate}
                      slots={{
                        textField: TextField,
                      }}
                      slotProps={{
                        textField: {
                          sx: { minWidth: 150 },
                        },
                      }}
                    />
                  </>
                )}

                <Button
                  variant="contained"
                  startIcon={<Assessment />}
                  onClick={generateReport}
                  disabled={loading}
                >
                  {loading ? 'Generando...' : 'Generar'}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Contenido del Reporte */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                {getReportTitle()}
              </Typography>

              {loading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography>Generando reporte...</Typography>
                </Box>
              ) : (
                <>
                  {/* Reporte de Ventas */}
                  {reportType === 'sales' && salesData.length > 0 && (
                    <Stack spacing={3}>
                      <Box sx={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <Tooltip
                              formatter={(value: number, name: string) => [
                                name === 'totalAmount' ? `$${value.toLocaleString()}` : value,
                                name === 'totalAmount' ? 'Monto Total' : 'Cantidad de Ventas'
                              ]}
                            />
                            <Bar dataKey="totalAmount" fill="#62C370" name="Monto Total" />
                            <Bar dataKey="totalSales" fill="#FF8C42" name="Cantidad de Ventas" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>

                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Período</TableCell>
                              <TableCell align="right">Ventas</TableCell>
                              <TableCell align="right">Monto Total</TableCell>
                              <TableCell align="right">Promedio por Venta</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {salesData.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell>{row.period}</TableCell>
                                <TableCell align="right">{row.totalSales}</TableCell>
                                <TableCell align="right">
                                  ${row.totalAmount.toLocaleString()}
                                </TableCell>
                                <TableCell align="right">
                                  ${(row.totalAmount / (row.totalSales || 1)).toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Stack>
                  )}

                  {/* Reporte de Rentabilidad */}
                  {reportType === 'profit' && profitData && (
                    <Stack spacing={3}>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Card sx={{ flex: 1, backgroundColor: 'success.light', color: 'white' }}>
                          <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <AttachMoney />
                              <Box>
                                <Typography variant="h6">Ingresos Totales</Typography>
                                <Typography variant="h4">
                                  ${profitData.summary.totalRevenue.toLocaleString()}
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>

                        <Card sx={{ flex: 1, backgroundColor: 'error.light', color: 'white' }}>
                          <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <TrendingUp />
                              <Box>
                                <Typography variant="h6">Costos Totales</Typography>
                                <Typography variant="h4">
                                  ${profitData.summary.totalCost.toLocaleString()}
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>

                        <Card sx={{ flex: 1, backgroundColor: 'primary.main', color: 'white' }}>
                          <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Assessment />
                              <Box>
                                <Typography variant="h6">Ganancia Total</Typography>
                                <Typography variant="h4">
                                  ${profitData.summary.totalProfit.toLocaleString()}
                                </Typography>
                                <Typography variant="body2">
                                  Margen: {profitData.summary.totalMargin.toFixed(1)}%
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Stack>

                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Producto</TableCell>
                              <TableCell align="right">Ingresos</TableCell>
                              <TableCell align="right">Costos</TableCell>
                              <TableCell align="right">Ganancia</TableCell>
                              <TableCell align="right">Margen</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(profitData.productProfits).map(([product, data]) => (
                              <TableRow key={product}>
                                <TableCell>{product}</TableCell>
                                <TableCell align="right">
                                  ${data.revenue.toLocaleString()}
                                </TableCell>
                                <TableCell align="right">
                                  ${data.cost.toLocaleString()}
                                </TableCell>
                                <TableCell align="right">
                                  <Typography
                                    color={data.profit > 0 ? 'success.main' : 'error.main'}
                                    sx={{ fontWeight: 500 }}
                                  >
                                    ${data.profit.toLocaleString()}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Chip
                                    label={`${data.margin.toFixed(1)}%`}
                                    color={data.margin > 20 ? 'success' : data.margin > 10 ? 'warning' : 'error'}
                                    size="small"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Stack>
                  )}

                  {/* Productos Más Vendidos */}
                  {reportType === 'top-products' && topProducts.length > 0 && (
                    <Stack spacing={3}>
                      <Box sx={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={topProducts.slice(0, 5)}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="totalRevenue"
                              nameKey="product.name"
                            >
                              {topProducts.slice(0, 5).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Ingresos']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>

                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Producto</TableCell>
                              <TableCell align="right">Cantidad Vendida</TableCell>
                              <TableCell align="right">Ingresos</TableCell>
                              <TableCell align="right">Ventas</TableCell>
                              <TableCell align="right">Precio Promedio</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {topProducts.map((product, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Typography variant="subtitle2">
                                    {product.product.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {product.product.unit}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  {product.totalQuantity} {product.product.unit}
                                </TableCell>
                                <TableCell align="right">
                                  ${product.totalRevenue.toLocaleString()}
                                </TableCell>
                                <TableCell align="right">{product.totalSales}</TableCell>
                                <TableCell align="right">
                                  ${(product.totalRevenue / product.totalQuantity).toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Stack>
                  )}

                  {/* Reporte de Inventario */}
                  {reportType === 'inventory' && inventoryData && (
                    <Stack spacing={3}>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Card sx={{ flex: 1, backgroundColor: 'info.light', color: 'white' }}>
                          <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Inventory />
                              <Box>
                                <Typography variant="h6">Total Productos</Typography>
                                <Typography variant="h4">
                                  {inventoryData.summary.totalProducts}
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>

                        <Card sx={{ flex: 1, backgroundColor: 'success.light', color: 'white' }}>
                          <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <AttachMoney />
                              <Box>
                                <Typography variant="h6">Valor del Inventario</Typography>
                                <Typography variant="h4">
                                  ${inventoryData.summary.inventoryValue.toLocaleString()}
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>

                        <Card sx={{ flex: 1, backgroundColor: 'warning.light', color: 'white' }}>
                          <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <ShoppingCart />
                              <Box>
                                <Typography variant="h6">Stock Bajo</Typography>
                                <Typography variant="h4">
                                  {inventoryData.summary.lowStockCount}
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Stack>

                      {inventoryData.summary.outOfStockCount > 0 && (
                        <Alert severity="error">
                          {inventoryData.summary.outOfStockCount} productos sin stock
                        </Alert>
                      )}

                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Producto</TableCell>
                              <TableCell>Categoría</TableCell>
                              <TableCell align="right">Stock</TableCell>
                              <TableCell align="right">Valor en Stock</TableCell>
                              <TableCell>Estado</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {inventoryData.products.map((product: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.category.name}</TableCell>
                                <TableCell align="right">
                                  {product.stock} {product.unit}
                                </TableCell>
                                <TableCell align="right">
                                  ${product.stockValue.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={
                                      product.status === 'OUT_OF_STOCK' ? 'Sin Stock' :
                                      product.status === 'LOW_STOCK' ? 'Stock Bajo' : 'En Stock'
                                    }
                                    color={
                                      product.status === 'OUT_OF_STOCK' ? 'error' :
                                      product.status === 'LOW_STOCK' ? 'warning' : 'success'
                                    }
                                    size="small"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Stack>
                  )}

                  {/* Sin datos */}
                  {((reportType === 'sales' && salesData.length === 0) ||
                    (reportType === 'profit' && !profitData) ||
                    (reportType === 'top-products' && topProducts.length === 0) ||
                    (reportType === 'inventory' && !inventoryData)) && !loading && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">
                        No hay datos disponibles para el período seleccionado
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </LocalizationProvider>
  );
};

export default Reports;