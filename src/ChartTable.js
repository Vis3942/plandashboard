import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData('00:00', 0),
  createData('03:00', 300),
  createData('06:00', 600),
  createData('09:00', 800),
  createData('12:00', 1500),
  createData('15:00', 2000),
  createData('18:00', 2400),
  createData('21:00', 2400),
  createData('24:00', undefined),
];

export default function ChartTable() {
  const theme = useTheme();

  // if true show chart if false show data as table
  const [displayChart, setDisplayChart] = React.useState(false); 
  const [title, setTitle] = React.useState('Sales');


  if (displayChart)
  {
    return (
        <React.Fragment>
        <Title>Today</Title>
        <ResponsiveContainer>
            <LineChart
            data={data}
            margin={{
                top: 16,
                right: 16,
                bottom: 0,
                left: 24,
            }}
            >
            <XAxis
                dataKey="time"
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
                dataKey="amount"
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
            <Title>{title}</Title>
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

        </React.Fragment>
    );
  }
}
