import React from 'react'


import { useTable } from 'react-table';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';

const VoltageTemperatureTable = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Define columns for React Table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Number',
        accessor: 'cellNumber', // accessor is the key in the data
      },
      {
        Header: 'Voltage (V)',
        accessor: 'cellVoltage',
        // Custom cell renderer to handle the 65535 case
        Cell: ({ value }) => (value === 65.535 ? "N/A" : value),
      },
      {
        Header: 'Temperature (°C)',
        accessor: 'cellTemperature',
        // Custom cell renderer to handle the 65535 case
        Cell: ({ value }) => (value === 65535 ? "N/A" : value),
      },
    ],
    []
  );

  // Use the useTable hook to initialize the table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <Box m="2px">
      <Box
        height="500px" // Fixed height for the table
        sx={{
          borderColor: colors.grey[200],
          borderRadius: "8px",
          flexGrow: 1,
        }}
      >
        <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} style={{ backgroundColor: colors.blueAccent[700] }}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} style={{ padding: '10px', color: colors.grey[100], textAlign: 'left' }}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} style={{ borderBottom: '1px solid', borderColor: colors.grey[200] }}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()} style={{ padding: '8px', textAlign: 'left' }}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default VoltageTemperatureTable;


