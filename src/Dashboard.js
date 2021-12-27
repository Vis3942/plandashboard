import * as React from 'react';
import { useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems, nodeListItems } from './listItems';
import ChartTable from './ChartTable';
import Deposits from './Deposits';
import Orders from './Orders';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LayersIcon from '@mui/icons-material/Layers';
import io from 'socket.io-client';
import { useEffect, useRef } from 'react';



function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  //const [nodesList, setNodesList] = React.useState(['Node1', 'Node-xy', 'Node-abcd36'])
  // const [nodesList, setNodesList] = useState([]);
  // const [currentNode, setCurrentNode] = useState('');
  const [updateDashboard, setUpdateDashboard] = useState(false);
  const maxItemsData = 100;
  // const recvNodes = setTimeout(receivedNodesList, 5000);
  const dataRef = useRef({
    nodesName: [],
    currentNode: '',
    nodesData: {},
  });

  // function receivedNodesList()
  // {
  //   setNodesList(['Node1', 'Node-xy', 'Node-abcd36']);
  //   clearTimeout(recvNodes);
  // }

  function setCurrentNode (pageTitle) {
    if (dataRef.current.currentNode !== pageTitle) {
      dataRef.current.currentNode = pageTitle;
    }
  }

  const nodeNameAppBar = function setPageNode( pageNodeName ) {
    setCurrentNode(pageNodeName);
    setUpdateDashboard(state => !state);
  }

  // useEffect( () => {
  //   console.log(currentNode);
  //   console.log(nodesList.length);
  // } , [currentNode, nodesList.length] );


  // update dashboard (if currentNode changes (a) init state to first node, user selection nodex, nodey... )
  // send udpates to component refs when data is received for currentNode, udpate data in dataRef for all other node data
  // listen for event
  useEffect(() => {
    const socket = io('http://localhost:9000', {
      transports: ['websocket', 'polling']
    });

    socket.on('node_data', (node) => {
      console.log(node);
      let newNodeAdded = false;
      if (dataRef.current.nodesName.indexOf(node.Name) === -1) {
        // first data received for node.Name, create dataRef.current.nodesData[node.Name]
        var sigData = [];
        for (let ii in node.Data) {
          sigData.push( {
            name: node.Data[ii].Name,
            xyvals: [{
              data: node.Data[ii].Value,
              timestamp: node.Data[ii].Timestamp
            }] 
          });
        }
        dataRef.current.nodesName.push(node.Name);
        dataRef.current.nodesData[node.Name] = sigData;
        newNodeAdded = true;
      }
      else {
        // append data and restrict data to maxItems
        for (let ii in node.Data) {
          var tmpSig = dataRef.current.nodesData[node.Name].find(x => x.name === node.Data[ii].Name);
          if (tmpSig !== undefined) {
            tmpSig.xyvals.push({
              data: node.Data[ii].Value,
              timestamp: node.Data[ii].Timestamp
            });
          }
          else {
            // this should not happen but useful to indicate error.
            console.log("signal " + node.Data[ii].name + " not found in Node "+ node.Name + " cannot add data");
          }
        }
      }

      if (dataRef.current.currentNode.length === 0) {
        dataRef.current.currentNode = node.Name;
        //setUpdateDashboard(!updateDashboard);
        setUpdateDashboard(state => !state);
      }
      else if (newNodeAdded === true) {
        //setUpdateDashboard(!updateDashboard);
        setUpdateDashboard(state => !state);
      }
      else 
      {
        setUpdateDashboard(state => !state);
      }



    });
    // CLEAN UP THE EFFECT
    return () => socket.disconnect();
  }, []);

  console.log("updating dashboard");
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              PLAN IAQ Portal
            </Typography>
            <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>
              {dataRef.current.currentNode}
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={dataRef.current.nodesName.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>{mainListItems}</List>
          <Divider />
          <ListSubheader inset>Nodes</ListSubheader>
          <List>
          {
            dataRef.current.nodesName.map( (element, index) => (
              <div key={index}>
                <ListItem button onClick={() => nodeNameAppBar(element)}>
                  <ListItemIcon>
                    <LayersIcon />
                  </ListItemIcon>
                  <ListItemText primary={element} />
                </ListItem>
              </div>
            ) ) 
          }

          </List>
          <Divider />
          { /* <List>{secondaryListItems}</List> */ }
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          {
            ( dataRef.current.currentNode.length > 0 ) ?
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                {/* Chart */}
                <Grid item xs={12} >
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 300,
                    }}
                  >
                    <ChartTable xyvals={dataRef.current.nodesData[dataRef.current.currentNode][0].xyvals} 
                      dataName={dataRef.current.nodesData[dataRef.current.currentNode][0].name} 
                      dataXKey = {'timestamp'} 
                      dataYKey={'data'} />
                  </Paper>
                </Grid>
                {/* Recent Orders */}
                <Grid item xs={12} >
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Orders />
                  </Paper>
                </Grid>
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Container>
            :
              <Box  
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ height: '100%', Width: '100%'}}>
                <Paper>
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              sx = {{
                p: 4
              }}
            >
              Waiting for data...
            </Typography>
            </Paper>
              </Box>
          }
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
