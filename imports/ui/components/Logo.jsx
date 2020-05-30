import React from 'react';
import { Typography, withStyles } from '@material-ui/core';

const styles = (theme) => ({
  root: {
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'default',
    '& > img': {
      width: '28px',
      height: 'auto'
    },
    '& > span': {
      margin: theme.spacing(0, 0, 0, 1),
      fontSize: '2rem'
    }
  }
});

function Logo({ classes, iconOnly = false }) {
  return (
    <div className={classes.root}>
      <img src="/favicon.ico" alt="logo" />
      {!Boolean(iconOnly) && <Typography component="span">toodlist</Typography>}
    </div>
  );
}

export default withStyles(styles)(Logo);
