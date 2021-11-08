import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

export default function Title(props) {
  return (
    <div className='name'>
      <Typography variant='h2' component='h2'>
        {props.title}
      </Typography>
    </div>
  )
}

Title.propTypes = {
  title: PropTypes.string.isRequired
};
