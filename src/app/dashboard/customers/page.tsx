'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Customer, CustomerTag } from '@/types/customer';
import CustomerHeader from '@/components/dashboard/customer/customer-header';
import { CustomerStats } from '@/components/dashboard/customer/customer-stats';
import CustomerFiltersComponent from '@/components/dashboard/customer/customers-filters';
import CustomerTable from '@/components/dashboard/customer/customers-table';
import CustomerGrid from '@/components/dashboard/customer/customer-grid';
import CustomerDialog from '@/components/dashboard/customer/customer-dialog';
import CustomerViewDialog from '@/components/dashboard/customer/customerViewDialog';
import CustomerImportDialog from '@/components/dashboard/customer/customer-import-dialog';
import CustomerExportDialog from '@/components/dashboard/customer/customer-export-dialog';
import CustomerDeleteDialog from '@/components/dashboard/customer/delete-confirm-dialog';
import { useDashboardCustomerKpis } from '@/hooks/use-customer-dashboard-kpis';


interface CustomerFilters {
  search: string;
  status?: ('active' | 'inactive' | 'lead')[];
  type?: ('individual' | 'business' | 'family')[];
  gender?: ('male' | 'female' | 'other')[];
  civilStatus?: ('single' | 'married' | 'divorced' | 'widowed')[];
  riskLevel?: ('low' | 'medium' | 'high')[];
  dateRange?: { start: Date; end: Date };
  hasPolicy?: boolean;
  policyStatus?: ('active' | 'expired' | 'pending' | 'review' | 'cancelled')[];
  policyType?: string[];
  tags?: string[];
}

const CustomersPage = () => {
  const { user } = useAuth();
  const { kpis, loading: kpisLoading, updateCustomerKpis } = useDashboardCustomerKpis();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc'
  });
  
  const [filters, setFilters] = useState<CustomerFilters>({
    search: '',
  });
  
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);
  const [availableTags, setAvailableTags] = useState<CustomerTag[]>([]);
  
  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      
      const customersRef = collection(db, 'customers');
      const customersQuery = query(customersRef, where('userId', '==', user.uid));
      const customersSnapshot = await getDocs(customersQuery);
      
      const customersData: Customer[] = [];
      customersSnapshot.forEach(doc => {
        customersData.push({ id: doc.id, ...doc.data() } as Customer);
      });
      
      setCustomers(customersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  }, [user]);
  
  // Fetch available tags
  const fetchTags = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      const tagsRef = doc(db, `users/${user.uid}/settings/customerTags`);
      const tagsDoc = await getDoc(tagsRef);
      
      if (tagsDoc.exists()) {
        const tagsData = tagsDoc.data();
        setAvailableTags(tagsData.tags || []);
      } else {
        setAvailableTags([]);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }, [user]);
  
  // Initial data fetch
  useEffect(() => {
    fetchCustomers();
    fetchTags();
  }, [fetchCustomers, fetchTags]);
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...customers];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(customer => 
        customer.name?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.phone?.toLowerCase().includes(searchLower) ||
        customer.company?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      result = result.filter(customer => 
        customer.status && filters.status?.includes(customer.status)
      );
    }
    
    // Apply type filter
    if (filters.type && filters.type.length > 0) {
      result = result.filter(customer => 
        customer.type && filters.type?.includes(customer.type)
      );
    }
    
    // Apply gender filter
    if (filters.gender && filters.gender.length > 0) {
      result = result.filter(customer => 
        customer.gender && filters.gender?.includes(customer.gender)
      );
    }
    
    // Apply civil status filter
    if (filters.civilStatus && filters.civilStatus.length > 0) {
      result = result.filter(customer => 
        customer.civilStatus && filters.civilStatus?.includes(customer.civilStatus)
      );
    }
    
    // Apply risk level filter
    if (filters.riskLevel && filters.riskLevel.length > 0) {
      result = result.filter(customer => 
        customer.riskLevel && filters.riskLevel?.includes(customer.riskLevel)
      );
    }
    
    // Apply date range filter
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      result = result.filter(customer => {
        if (!customer.createdAt) return false;
        
        const createdAt = customer.createdAt.toDate();
        return createdAt >= start && createdAt <= end;
      });
    }
    

    // Apply policy filters
    if (filters.hasPolicy) {
      result = result.filter(customer => 
        customer.policies && customer.policies.length > 0
      );
      
      // Apply policy status filter
      if (filters.policyStatus && filters.policyStatus.length > 0) {
        result = result.filter(customer => 
          customer.policies?.some(policy => 
            policy.status && filters.policyStatus?.includes(policy.status as 'active' | 'expired' | 'pending' | 'review' | 'cancelled')
          )
        );
      }
      
      // Apply policy type filter
      if (filters.policyType && filters.policyType.length > 0) {
        result = result.filter(customer => 
          customer.policies?.some(policy => 
            filters.policyType?.includes(policy.type)
          )
        );
      }
    }
    
    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(customer => 
        customer.tags?.some(tag => 
          filters.tags?.includes(tag.id)
        )
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue: string | number | boolean | Date | undefined;
      let bValue: string | number | boolean | Date | undefined;
      
      switch (sortConfig.key) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'email':
          aValue = a.email || '';
          bValue = b.email || '';
          break;
        case 'phone':
          aValue = a.phone || '';
          bValue = b.phone || '';
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'type':
          aValue = a.type || '';
          bValue = b.type || '';
          break;
        case 'createdAt':
          aValue = a.createdAt ? a.createdAt.toDate().getTime() : 0;
          bValue = b.createdAt ? b.createdAt.toDate().getTime() : 0;
          break;
        default:
          // For other fields, handle potential array types separately
          if (Array.isArray(a[sortConfig.key as keyof Customer])) {
            // For arrays, compare their lengths as a simple comparison method
            aValue = (a[sortConfig.key as keyof Customer] as unknown[])?.length || 0;
            bValue = (b[sortConfig.key as keyof Customer] as unknown[])?.length || 0;
          } else {
            // For non-arrays, use the value or empty string
            const aVal = a[sortConfig.key as keyof Customer];
            const bVal = b[sortConfig.key as keyof Customer];
            
            // Handle Timestamp objects by converting to Date
            if (aVal && typeof aVal === 'object' && 'toDate' in aVal && typeof aVal.toDate === 'function') {
              aValue = aVal.toDate();
            } else if (Array.isArray(aVal)) {
              aValue = aVal.length;
            } else if (typeof aVal === 'boolean') {
              aValue = aVal;
            } else if (typeof aVal === 'number') {
              aValue = aVal;
            } else if (typeof aVal === 'string') {
              aValue = aVal;
            } else {
              aValue = undefined;
            }
            
            if (bVal && typeof bVal === 'object' && 'toDate' in bVal && typeof bVal.toDate === 'function') {
              bValue = bVal.toDate();
            } else if (Array.isArray(bVal)) {
              bValue = bVal.length;
            } else if (typeof bVal === 'boolean') {
              bValue = bVal;
            } else if (typeof bVal === 'number') {
              bValue = bVal;
            } else if (typeof bVal === 'string') {
              bValue = bVal;
            } else {
              bValue = undefined;
            }
          }
      }
      
      // Handle undefined values in comparison
      if (aValue === undefined && bValue === undefined) {
        return 0;
      }
      if (aValue === undefined) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      if (bValue === undefined) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredCustomers(result);
    setPage(1); // Reset to first page when filters change
  }, [customers, filters, sortConfig]);
  
  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Handle view mode change
  const handleViewModeChange = (mode: 'table' | 'grid') => {
    setViewMode(mode);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setPage(page);
  };
  
  // Handle add customer
  const handleAddCustomer = () => {
    setSelectedCustomer(undefined);
    setOpenCustomerDialog(true);
  };
  
  // Handle edit customer
  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenCustomerDialog(true);
  };
  
  // Handle view customer
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenViewDialog(true);
  };
  
  // Handle delete customer
  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenDeleteDialog(true);
  };
  
  // Handle email customer
  const handleEmailCustomer = (customer: Customer) => {
    // Implement email functionality
    console.log('Email customer:', customer);
  };
  
  // Handle schedule meeting
  const handleScheduleMeeting = (customer: Customer) => {
    // Implement meeting scheduling functionality
    console.log('Schedule meeting with customer:', customer);
  };
  
  // Handle import customers
  const handleImportCustomers = () => {
    setOpenImportDialog(true);
  };
  
  // Handle export customers
  const handleExportCustomers = () => {
    setOpenExportDialog(true);
  };
  
  // Handle customer dialog close
  const handleCustomerDialogClose = () => {
    setOpenCustomerDialog(false);
    setSelectedCustomer(undefined);
  };

  const [newCustomerJustAdded, setNewCustomerJustAdded] = useState(false);

  
  // Handle customer dialog success
  const handleCustomerDialogSuccess = async () => {
    try {
      await fetchCustomers();
      await updateCustomerKpis();
      setOpenCustomerDialog(false);
      setSelectedCustomer(undefined);
      
      // Indicar que se ha añadido un nuevo cliente
      setNewCustomerJustAdded(true);
      
      // Resetear el estado después de 5 segundos
      setTimeout(() => {
        setNewCustomerJustAdded(false);
      }, 5000);
      
      return true;
    } catch (error) {
      console.error('Error en handleCustomerDialogSuccess:', error);
      return false;
    }
  };
  
  // Handle view dialog close
  const handleViewDialogClose = () => {
    setOpenViewDialog(false);
    setSelectedCustomer(undefined);
  };
  
  // Handle import dialog close
  const handleImportDialogClose = () => {
    setOpenImportDialog(false);
  };
  
  // Handle import dialog success
  const handleImportDialogSuccess = async () => {
    await fetchCustomers();
    await updateCustomerKpis();
    setOpenImportDialog(false);
  };
  
  // Handle export dialog close
  const handleExportDialogClose = () => {
    setOpenExportDialog(false);
  };
  
  // Handle delete dialog close
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setSelectedCustomer(undefined);
  };
  
  // Handle delete dialog confirm
  const handleDeleteDialogConfirm = async () => {
    if (!selectedCustomer) return;
    
    try {
      await deleteDoc(doc(db, 'customers', selectedCustomer.id));
      await fetchCustomers();
      await updateCustomerKpis();
      setOpenDeleteDialog(false);
      setSelectedCustomer(undefined);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };
  
  // Calculate customer stats
  const customerStats = {
    totalCustomers: kpis?.totalCustomers || 0,
    activeCustomers: kpis?.activeCustomers || 0,
    inactiveCustomers: kpis?.inactiveCustomers || 0,
    leadCustomers: kpis?.leadCustomers || 0,
    newCustomersThisMonth: kpis?.newCustomersThisMonth || 0,
    customersWithPolicies: kpis?.customersWithPolicies || 0,
    customersWithActivePolicies: kpis?.customersWithActivePolicies || 0,
    customersWithExpiredPolicies: kpis?.customersWithExpiredPolicies || 0,
    customersWithRenewingPolicies: kpis?.customersWithRenewingPolicies || 0,
  };
  
  return (
    <Container maxWidth="xl">
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ py: 3 }}
      >
        <CustomerHeader 
          customersCount={customerStats.totalCustomers}
          onNewCustomer={handleAddCustomer}
          onImport={handleImportCustomers}
          onExport={handleExportCustomers}
          onRefresh={updateCustomerKpis}
          onAnalytics={() => {}} // Add implementation or placeholder for analytics
        />
        
        <CustomerStats 
  stats={customerStats}
  loading={kpisLoading}
  newCustomerAdded={newCustomerJustAdded}
  onRefresh={updateCustomerKpis}
/>
        
        <CustomerFiltersComponent 
          filters={filters}
          setFilters={setFilters}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          availableTags={availableTags}
        />
        
        {viewMode === 'table' ? (
          <CustomerTable 
            customers={filteredCustomers}
            loading={loading}
            onViewCustomer={handleViewCustomer}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onEmailCustomer={handleEmailCustomer}
            onScheduleMeeting={handleScheduleMeeting}
            sortConfig={sortConfig}
            onSort={handleSort}
            page={page}
            onPageChange={handlePageChange}
          />
        ) : (
          <CustomerGrid 
            customers={filteredCustomers}
            loading={loading}
            onViewCustomer={handleViewCustomer}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            page={page}
            onPageChange={handlePageChange}
          />
        )}
        
        {/* Customer Dialog */}
        <CustomerDialog 
          open={openCustomerDialog}
          onClose={handleCustomerDialogClose}
          customer={selectedCustomer}
          title={selectedCustomer ? 'Editar cliente' : 'Nuevo cliente'}
          onSuccess={handleCustomerDialogSuccess}
        />
        
        {/* View Dialog */}
        {selectedCustomer && (
          <CustomerViewDialog 
            open={openViewDialog}
            onClose={handleViewDialogClose}
            customer={selectedCustomer}
            onEdit={() => {
              setOpenViewDialog(false);
              setOpenCustomerDialog(true);
            }}
            onDelete={() => {
              setOpenViewDialog(false);
              setOpenDeleteDialog(true);
            }}
            onEmailCustomer={handleEmailCustomer}
          />
        )}
        
        {/* Import Dialog */}
        <CustomerImportDialog 
          open={openImportDialog}
          onClose={handleImportDialogClose}
          onSuccess={handleImportDialogSuccess}
          availableTags={availableTags}
        />
        
        {/* Export Dialog */}
        <CustomerExportDialog 
          open={openExportDialog}
          onClose={handleExportDialogClose}
          customers={filteredCustomers}
        />
        
        {/* Delete Dialog */}
        {selectedCustomer && (
          <CustomerDeleteDialog 
            open={openDeleteDialog}
            onClose={handleDeleteDialogClose}
            onConfirm={handleDeleteDialogConfirm}
            customerName={selectedCustomer.name}
          />
        )}
      </Box>
    </Container>
  );
};

export default CustomersPage;