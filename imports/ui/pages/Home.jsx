import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Avatar from 'antd/lib/avatar';
import Dropdown from 'antd/lib/dropdown';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import message from 'antd/lib/message';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from '../components/Column';
import Loading from '../components/Loading';
import Settings from '../components/Settings';
import {
  homeSignOut,
  homeGetUserDataRequest,
  homeGetUserDataSuccess,
  homeGetUserDataFailure,
  homeDragAndDropRequest,
  homeDragAndDropSuccess,
  homeDragAndDropFailure,
  homeCreateTodolistRequest,
  homeCreateTodolistSuccess,
  homeCreateTodolistFailure
} from '../actions/Home';
import { openSettings } from '../actions/Settings';

const styles = (theme) => ({
  root: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between'
    }
  },
  toolBar: {
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
  },
  listContainer: {
    display: 'flex',
    padding: '1rem',
    overflow: 'auto',
    '& > div:nth-of-type(1)': {
      display: 'flex'
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      '& > div:nth-of-type(1)': {
        flexDirection: 'column'
      }
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      '& > div:nth-of-type(1)': {
        flexDirection: 'row'
      }
    }
  },
  columnAddPlaceholder: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    border: '1px solid darkslategrey',
    borderStyle: 'dashed',
    borderRadius: '5px',
    color: 'darkslategrey',
    cursor: 'pointer',
    opacity: '0.8',
    padding: '0.5rem',
    width: '100%',
    height: 'fit-content',
    '& > i': {
      marginTop: '4px'
    },
    [theme.breakpoints.up('md')]: {
      marginRight: '1rem',
      minWidth: '22rem',
      maxWidth: '22rem',
      '&:hover': {
        borderColor: 'black',
        color: 'black',
        opacity: '1'
      }
    }
  }
});

function Home({
  classes,
  history,
  isLoading,
  email,
  avatarSrc,
  todos,
  columns,
  columnOrder,
  isSettingsOpen,
  getUserData,
  openSettings,
  signOut,
  onDragEnd,
  createTodolist
}) {
  useEffect(() => {
    getUserData(history);
  }, []);

  const isMobile = () => {
    return useMediaQuery((theme) => theme.breakpoints.down('sm'));
  };

  const avatarMenu = (
    <Menu>
      <Menu.Item disabled>{email}</Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={() => openSettings(history)}>Settings</Menu.Item>
      <Menu.Item onClick={() => signOut(history)}>Log out</Menu.Item>
    </Menu>
  );

  const renderedColumns = columnOrder.map((cid, index) => {
    const column = columns[cid];
    const theseTodos = column.todoIds.map((tid) => todos[tid]);
    return (
      <Column key={cid} index={index} column={column} todos={theseTodos} />
    );
  });

  return (
    <div
      id="home"
      className={classes.root}
      style={isSettingsOpen ? { filter: 'blur(2px)' } : {}}
    >
      <div className={classes.toolBar}>
        <Dropdown
          overlay={avatarMenu}
          overlayClassName="home-avatar-dropdown"
          trigger={['click']}
        >
          <Avatar icon="user" size="large" src={avatarSrc || ''} />
        </Dropdown>
        <h1>toodlist</h1>
      </div>
      <div className={classes.listContainer}>
        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
          <Droppable
            droppableId="main-droppable-container"
            direction={isMobile() ? 'vertical' : 'horizontal'}
            type="column"
          >
            {(mainProvided) => (
              <div ref={mainProvided.innerRef} {...mainProvided.droppableProps}>
                {renderedColumns}
                {mainProvided.placeholder}
              </div>
            )}
          </Droppable>
          <div
            className={classes.columnAddPlaceholder}
            onClick={() => createTodolist()}
          >
            <Icon type="plus" />
            &nbsp;new toodlist
          </div>
        </DragDropContext>
      </div>
      <Settings />
      {isLoading && <Loading />}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.home.isLoading,
    email: state.home.email,
    avatarSrc: state.home.avatarSrc,
    todos: state.home.todos,
    columns: state.home.columns,
    columnOrder: state.home.columnOrder,
    isSettingsOpen: state.settings.visible
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserData: (history) => {
      dispatch(homeGetUserDataRequest());
      Meteor.call('getUserData', Meteor.userId(), (err, response) => {
        if (err) {
          dispatch(homeGetUserDataFailure());
          history.push('/');
        } else {
          dispatch(
            homeGetUserDataSuccess({
              email: response.emails[0].address,
              avatarSrc: response.avatarSrc,
              todos: response.todos,
              columns: response.columns,
              columnOrder: response.columnOrder
            })
          );
        }
      });
    },
    openSettings: () => {
      dispatch(openSettings());
    },
    signOut: (history) => {
      Meteor.logout((err) => {
        dispatch(homeSignOut());
        history.push('/');
      });
    },
    onDragEnd: (result) => {
      const { reason, destination } = result;
      if (reason !== 'CANCEL' && destination) {
        dispatch(homeDragAndDropRequest(result));
        Meteor.call('dragAndDrop', Meteor.userId(), result, (err, response) => {
          if (err) {
            dispatch(homeDragAndDropFailure());
            message.error('Your request failed to complete, please try again.');
          } else {
            dispatch(homeDragAndDropSuccess());
          }
        });
      }
    },
    createTodolist: () => {
      const newColumn = {
        id: Date.now(),
        title: 'my toodlist',
        todoIds: [],
        color: 'white'
      };
      dispatch(homeCreateTodolistRequest(newColumn));
      Meteor.call(
        'createTodolist',
        Meteor.userId(),
        newColumn,
        (err, response) => {
          if (err) {
            dispatch(homeCreateTodolistFailure());
            message.error('Your request failed to complete, please try again.');
          } else {
            dispatch(homeCreateTodolistSuccess());
          }
        }
      );
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Home));
