import { AppBar, Toolbar, MenuItem, Typography } from '@mui/material';
import { StylesProvider } from '@material-ui/core/styles';
import '../styles/App.scss';
import { NavLink } from 'react-router-dom';
import { useMoralis } from 'react-moralis';
import { useEffect } from 'react';

export default function Header() {
  const {
    enableWeb3,
    authenticate,
    isWeb3Enabled,
    isAuthenticated,
    logout,
    isAuthenticating,
    isWeb3EnableLoading,
  } = useMoralis();

  const enableAndAuthenticate = async () => {
    await enableWeb3();
    await authenticate();
  };

  useEffect(() => {
    if (isAuthenticated) {
      enableWeb3();
    }
  }, [isAuthenticated]);

  const createMenuItem = (url, text) => {
    return (
      <MenuItem
        activeClassName='selected'
        className='primary-hover'
        component={NavLink}
        exact
        to={url}
      >
        {text}
      </MenuItem>
    );
  };

  return (
    <StylesProvider injectFirst>
        <AppBar position='fixed' className='primary-background'>
          <Toolbar className='primary-background'>
            <Typography
              variant='h6'
              component='div'
              to={'/'}
              sx={{ flexGrow: 1 }}
            >
              SmartPicks
            </Typography>
            {createMenuItem('/', 'View Pools')}
            {createMenuItem('/pool/new', 'Create Pool')}
            {createMenuItem('/brackets', 'Brackets')}
            {createMenuItem('/about', 'About')}
            {
              <button
                onClick={() => {
                  if (!isWeb3Enabled || !isAuthenticated) {
                    enableAndAuthenticate();
                  } else logout();
                }}
              >
                {(isAuthenticating || isWeb3EnableLoading) && 'Loading'}
                {(!isAuthenticated || !isWeb3EnableLoading) &&
                  '🦊 Login with Metamask'}
                {isAuthenticated && '  Logout'}
              </button>
            }
          </Toolbar>
        </AppBar>
    </StylesProvider>
  );
}
