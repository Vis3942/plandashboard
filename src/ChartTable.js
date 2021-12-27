import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TableViewIcon from '@mui/icons-material/TableView';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { forwardRef, useImperativeHandle } from 'react';
//import Paper from '@mui/material/Paper';


// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import { Table } from 'react-fluid-table';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

// const data = [
//   createData('00:00', 0),
//   createData('03:00', 300),
//   createData('06:00', 600),
//   createData('09:00', 800),
//   createData('12:00', 1500),
//   createData('15:00', 2000),
//   createData('18:00', 2400),
//   createData('21:00', 2400),
//   createData('24:00', undefined),
// ];

// const columns = [
//     {
//         key: "time",
//         name: 'Time',
//         width: 100
//     },
//     {
//         key: 'amount',
//         name: 'Amount',
//         width: 100
//     }
// ];

// const columns = [
//   {
//       key: "timestamp",
//       name: 'Time',
//       width: 100
//   },
//   {
//       key: 'data',
//       name: 'Data',
//       width: 100
//   }
// ];

export default function ChartTable( { xyvals, dataName, dataXKey, dataYKey} ) {
  const theme = useTheme();

  // if true show chart if false show data as table
  const [displayChart, setDisplayChart] = React.useState(false); 
  const [title, setTitle] = React.useState(dataName);

  const columns = [
      {key: dataXKey, header: dataXKey},
      {key: dataYKey, header: dataYKey}
  ];

  const cellStyles = {
      "react-fluid-table":{
        "& .row-container": {
            '& .cell': {
                justifyContent: 'center'
            }
        }

      }
  }

  const showChart = () => {
    setDisplayChart(true);
  };

  const showTable = () => {
    setDisplayChart(false);
  };

  console.log("render ChartTable");
  if (displayChart)
  {
    return (
        <React.Fragment>
    <Box>
      <Grid container spacing={3}
        direction="row"
        justifyContent="space-between"
        alignItems="center">
        <Grid item xs>
          <div></div>
        </Grid>
        <Grid item 
        sx = {{display: 'flex', flex: 1, alignItems: 'center'}} >
          <Title>{title}</Title>
        </Grid>
        <Grid item >
            <Tooltip title="Show Table">
        <IconButton color="inherit"
            onClick={showTable}>
                <TableViewIcon />
        </IconButton>
        </Tooltip>
        </Grid>
      </Grid>
      </Box>
        <ResponsiveContainer>
            <LineChart
            data={xyvals}
            margin={{
                top: 16,
                right: 16,
                bottom: 0,
                left: 24,
            }}
            >
            <XAxis
                dataKey={dataXKey}
                stroke={theme.palette.text.secondary}
                style={theme.typography.body2}
            />
            <YAxis
                stroke={theme.palette.text.secondary}
                style={theme.typography.body2}
            >
                <Label
                angle={270}
                position="left"
                style={{
                    textAnchor: 'middle',
                    fill: theme.palette.text.primary,
                    ...theme.typography.body1,
                }}
                >
                {title}
                </Label>
            </YAxis>
            <Line
                isAnimationActive={false}
                type="monotone"
                dataKey={dataYKey}
                stroke={theme.palette.primary.main}
                dot={false}
            />
            </LineChart>
        </ResponsiveContainer>
        </React.Fragment>
    );
  }
  else {
    return (
        <React.Fragment>
    <Box>
      <Grid container spacing={3}
        direction="row"
        justifyContent="space-between"
        alignItems="center">
        <Grid item xs>
          <div></div>
        </Grid>
        <Grid item 
        sx = {{display: 'flex', flex: 1, alignItems: 'center'}} >
          <Title>{title}</Title>
        </Grid>
        <Grid item >
            <Tooltip title="Show Chart">
        <IconButton color="inherit"
            onClick={showChart}>
                <ShowChartIcon />
        </IconButton>
        </Tooltip>
        </Grid>
      </Grid>
      </Box>
            <Container 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '95%',
                width: '100%'
                }}
                >
 
                <Table
                    sx ={{cellStyles}} 
                    data={xyvals}
                    columns={columns}
                />

            </Container>
        </React.Fragment>
    );
  }
}


{/*
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Orders />
                </Paper>
                <Table size="small">
            <TableHead>
                <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Value</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((row) => (
                <TableRow key={row.id}>
                    <TableCell>{row.time}</TableCell>
                    <TableCell align="right">{ row.amount}`</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>

*/}