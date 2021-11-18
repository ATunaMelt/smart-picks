import { Stack, Button, Snackbar, Alert as MuiAlert } from '@mui/material';
import { useState, useEffect, forwardRef } from 'react';

import PropTypes from 'prop-types';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

export default function CustomizedSnackbars(props) {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar open={open} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={props.alertType}
        sx={{ width: '100%' }}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
}

CustomizedSnackbars.propTypes = {
  alertType: PropTypes.oneOf(['error', 'warning', 'info', 'success'])
    .isRequired,
  message: PropTypes.string.isRequired
};
