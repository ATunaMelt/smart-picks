import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { StylesProvider } from '@material-ui/core/styles';
import '../styles/App.scss';
import { NavLink } from 'react-router-dom';

export default function Header() {
  const createMenuItem = (url, text) => {
    return (
      <MenuItem 
        activeClassName='selected'
        className='primary-hover'
        component={NavLink}
        exact to={url}>
            {text}
      </MenuItem>
    )
  };

  return (
    <StylesProvider injectFirst>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='fixed' className='primary-background'>
          <Toolbar className='primary-background'>
            <Typography variant='h6' component='div' to={'/'} sx={{ flexGrow: 1 }}>
              SmartPicks
            </Typography>
            {createMenuItem('/', 'View Pools')}
            {createMenuItem('/pool/new', 'Create Pool')}
            {createMenuItem('/brackets', 'Brackets')}
            {createMenuItem('/about', 'About')}
          </Toolbar>
        </AppBar>
      </Box>
    </StylesProvider>
  );
}
