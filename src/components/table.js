import { useState } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  Table,
} from '@mui/material';
import { StylesProvider } from '@material-ui/core/styles';
import { visuallyHidden } from '@mui/utils';
import {
  POOL_CONSTANTS,
  BRACKET_CONSTANTS,
} from '../constants/table-constants.js';
import '../styles/App.scss';

// example pool table data
const poolData = [
  { title: 'awesome pool', price: '2', entrants: '1', participants: '50' },
];

//example bracket table data
const bracketData = [{ title: 'awesome bracket', winner: 'me' }];

/**
 * Maps smart contract data into rows for the table
 * @param   {<string>} type pool || bracket
 * @param   {<object>} data all data
 * @return  {<object>}      formatted data
 */
function createData(type, data) {
  const formattedData = {};
  if (type === 'pool') {
    POOL_CONSTANTS.forEach((col) => (formattedData[col.id] = data[col.id]));
    formattedData.entrants += `/${data.maxPlayers}`;
  } else {
    BRACKET_CONSTANTS.forEach((col) => (formattedData[col.id] = data[col.id]));
  }

  return formattedData;
}

/**
 * Sorts data by selected field
 * @param   {<object>} a        first item in comparison
 * @param   {<object>} b        second item in comparison
 * @param   {<string>} orderBy  field to sort by
 * @param   {<boolean>}isNumeric boolean to see if comparitors need to be converted to number
 * @return  {<number>}          comparison result
 */
function descendingComparator(a, b, orderBy, isNumeric) {
  let numB = b[orderBy];
  let numA = a[orderBy];
  if (isNumeric) {
    numB = parseInt(b[orderBy].split('/')[0], 10);
    numA = parseInt(a[orderBy].split('/')[0], 10);
  }

  return numB < numA ? -1 : 1;
}

/**
 * Sets up ordering comparitor
 * @param   {<string>} order    asc || desc
 * @param   {<string>} orderBy  field to sort by
 * @param   {<array>} headers   array of table headers
 * @return  {<array>}          comparison results
 */
function getComparator(order, orderBy, headers) {
  const isNumeric = headers.find((header) => header.id === orderBy).numeric;

  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy, isNumeric)
    : (a, b) => -descendingComparator(a, b, orderBy, isNumeric);
}

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, type } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = type === 'pool' ? POOL_CONSTANTS : BRACKET_CONSTANTS;

  return (
    <StylesProvider injectFirst>
      <TableHead className='secondary-background'>
        <TableRow>
          <TableCell padding='checkbox' />
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </StylesProvider>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['pool', 'bracket']).isRequired,
};

export default function CustomTable(props) {
  const [redirect, setRedirect] = useState();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { type, data } = props;
  const rows = data.map((row) => createData(type, row));
  const headers = type === 'pool' ? POOL_CONSTANTS : BRACKET_CONSTANTS;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, address) => {
    setRedirect(`/pool/${address}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return redirect ? (
    <Redirect to={redirect} />
  ) : (
    <Box sx={{ width: '100%', 'margin-top': '10px' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby='tableTitle'
            size={'medium'}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              type={type}
            />
            <TableBody>
              {rows
                .slice()
                .sort(getComparator(order, orderBy, headers))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.address)}
                      tabIndex={-1}
                      key={row.address}
                    >
                      <TableCell padding='checkbox'>
                        {/*  todo: add in check mark if user is in pool */}
                      </TableCell>
                      {headers.map((column) => {
                        return (
                          <TableCell align={column.numeric ? 'right' : 'left'}>
                            {row[column.id]}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

CustomTable.propTypes = {
  type: PropTypes.oneOf(['pool', 'bracket']).isRequired,
  data: PropTypes.array.isRequired,
};
