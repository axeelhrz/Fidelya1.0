import React, { memo, useMemo, useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Checkbox,
  TablePagination,
  Skeleton,
} from '@mui/material';
import { FixedSizeList as List } from 'react-window';

const OptimizedTableRow = memo(({ 
  item, 
  columns, 
  selected, 
  onSelect, 
  onRowClick,
  style 
}) => {
  const handleSelect = useCallback((event) => {
    event.stopPropagation();
    onSelect?.(item.id, event.target.checked);
  }, [item.id, onSelect]);

  const handleRowClick = useCallback(() => {
    onRowClick?.(item);
  }, [item, onRowClick]);

  return (
    <div style={style}>
      <TableRow
        hover
        selected={selected}
        onClick={handleRowClick}
        sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
      >
        {onSelect && (
          <TableCell padding="checkbox">
            <Checkbox
              checked={selected}
              onChange={handleSelect}
              onClick={(e) => e.stopPropagation()}
            />
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell key={column.id} align={column.align || 'left'}>
            {column.render ? column.render(item) : item[column.id]}
          </TableCell>
        ))}
      </TableRow>
    </div>
  );
});

const OptimizedTable = ({
  data = [],
  columns = [],
  loading = false,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  onRowClick,
  sortable = true,
  pagination = true,
  pageSize = 25,
  virtualized = false,
  height = 400,
  ...props
}) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);

  // Memoizar datos ordenados
  const sortedData = useMemo(() => {
    if (!orderBy || !sortable) return data;

    return [...data].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, order, orderBy, sortable]);

  // Memoizar datos paginados
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = page * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, page, rowsPerPage, pagination]);

  const handleSort = useCallback((property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);

  const handleSelectAll = useCallback((event) => {
    if (event.target.checked) {
      const newSelected = paginatedData.map(item => item.id);
      onSelectionChange?.(newSelected);
    } else {
      onSelectionChange?.([]);
    }
  }, [paginatedData, onSelectionChange]);

  const handleSelect = useCallback((id, checked) => {
    const newSelected = checked
      ? [...selectedItems, id]
      : selectedItems.filter(item => item !== id);
    onSelectionChange?.(newSelected);
  }, [selectedItems, onSelectionChange]);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Componente de fila virtualizada
  const VirtualizedRow = useCallback(({ index, style }) => {
    const item = paginatedData[index];
    const isSelected = selectedItems.includes(item.id);

    return (
      <OptimizedTableRow
        style={style}
        item={item}
        columns={columns}
        selected={isSelected}
        onSelect={selectable ? handleSelect : undefined}
        onRowClick={onRowClick}
      />
    );
  }, [paginatedData, columns, selectedItems, selectable, handleSelect, onRowClick]);

  if (loading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {selectable && <TableCell padding="checkbox" />}
              {columns.map((column) => (
                <TableCell key={column.id}>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(new Array(5)).map((_, index) => (
              <TableRow key={index}>
                {selectable && (
                  <TableCell padding="checkbox">
                    <Skeleton variant="circular" width={40} height={40} />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Paper {...props}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedItems.length > 0 && 
                      selectedItems.length < paginatedData.length
                    }
                    checked={
                      paginatedData.length > 0 && 
                      selectedItems.length === paginatedData.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {sortable && column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          
          {virtualized ? (
            <TableBody>
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  sx={{ p: 0 }}
                >
                  <List
                    height={height}
                    itemCount={paginatedData.length}
                    itemSize={52}
                    itemData={paginatedData}
                  >
                    {VirtualizedRow}
                  </List>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {paginatedData.map((item) => {
                const isSelected = selectedItems.includes(item.id);
                return (
                  <OptimizedTableRow
                    key={item.id}
                    item={item}
                    columns={columns}
                    selected={isSelected}
                    onSelect={selectable ? handleSelect : undefined}
                    onRowClick={onRowClick}
                  />
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      )}
    </Paper>
  );
};

export default memo(OptimizedTable);