import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FixedSizeList as List } from 'react-window';

interface OptimizedTableProps<T> {
  data: T[];
  columns: {
    id: string;
    label: string;
    render: (item: T) => React.ReactNode;
    width?: number;
  }[];
  height?: number;
  rowHeight?: number;
  onRowClick?: (item: T) => void;
}

export function OptimizedTable<T>({
  data,
  columns,
  height = 400,
  rowHeight = 56,
  onRowClick
}: OptimizedTableProps<T>) {
  return (
    <TableContainer component={Paper} sx={{ height }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.id} style={{ width: column.width }}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <List
            height={height - rowHeight}
            itemCount={data.length}
            itemSize={rowHeight}
            width="100%"
          >
            {({ index, style }) => {
              const item = data[index];
              return (
                <TableRow 
                  style={style} 
                  onClick={() => onRowClick && onRowClick(item)}
                  hover={!!onRowClick}
                >
                  {columns.map(column => (
                    <TableCell key={column.id}>
                      {column.render(item)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            }}
          </List>
        </TableBody>
      </Table>
    </TableContainer>
  );
}