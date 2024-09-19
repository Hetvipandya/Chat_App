import React from 'react';
import './Messenger.css';
import { AppBar, Toolbar, Box } from '@mui/material';
import UserLogin from '../UserLogin/UserLogin';

const Messenger = () => {
  return (
    <Box
    position="static"
    sx={{height: '100vh' , backgroundColor: '#DCDCDC'}}
    >
      <AppBar
        position="static"
        sx={{ height: '220px', backgroundColor: '#00bfa5' , boxShadow: 'none' }}
      >
        <Toolbar>
          {/* Add your toolbar content here */}
        </Toolbar>
      </AppBar>
      <UserLogin/>
    </Box>
  );
};

export default Messenger;
