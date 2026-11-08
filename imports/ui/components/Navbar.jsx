import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { Avatar, Dropdown, Menu } from 'antd';
import { homeSignOut } from '../actions/Home';
import { openSettings } from '../actions/Settings';

const styles = (theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      padding: '0.5rem 1rem 0.5rem',
      backgroundColor: 'rgba(255,255,255,0.8)',
      '& > h1': {
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, 15%)',
        margin: '0'
      }
    },
    [theme.breakpoints.up('md')]: {
      padding: '1rem 1rem',
      '& > span': {
        cursor: 'pointer'
      },
      '& > h1': {
        display: 'none'
      }
    }
  }
});

function Navbar({ classes, email, avatarSrc, openSettings, signOut }) {
  const history = useHistory();

  const avatarMenu = (
    <Menu>
      <Menu.Item disabled>{email}</Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={() => openSettings()}>Settings</Menu.Item>
      <Menu.Item onClick={() => signOut(history)}>Log out</Menu.Item>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <Dropdown
        overlay={avatarMenu}
        overlayClassName="home-avatar-dropdown"
        trigger={['click']}
      >
        <Avatar icon="user" size="large" src={avatarSrc || ''} />
      </Dropdown>
      <h1>toodlist</h1>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    email: state.home.email,
    avatarSrc: state.home.avatarSrc
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openSettings: () => dispatch(openSettings()),
    signOut: (history) => {
      Meteor.logout((err) => {
        dispatch(homeSignOut());
        history.push('/');
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Navbar));
