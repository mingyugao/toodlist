import { callMethod } from '../callMethod';
import { PlusOutlined } from '@ant-design/icons';
import { Random } from 'meteor/random';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import message from 'antd/lib/message';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import ToodList from '../components/ToodList';
import Loading from '../components/Loading';
import Settings from '../components/Settings';
import {
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
import { Navbar } from '../components';

const styles = (theme) => ({
  root: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between'
    }
  },
  listContainer: {
    display: 'flex',
    padding: '1rem',
    overflow: 'auto',
    '& > div:nth-of-type(1)': {
      display: 'flex'
    },
    [theme.breakpoints.down('md')]: {
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
  todos,
  columns,
  columnOrder,
  isSettingsOpen,
  getUserData,
  onDragEnd,
  createTodolist
}) {
  useEffect(() => {
    getUserData(history);
  }, []);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const renderedColumns = columnOrder.map((cid, index) => {
    const column = columns[cid];
    const theseTodos = column.todoIds.map((tid) => todos[tid]);
    return (
      <ToodList key={cid} index={index} column={column} todos={theseTodos} />
    );
  });

  return (
    <div
      id="home"
      className={classes.root}
      style={isSettingsOpen ? { filter: 'blur(2px)' } : {}}
    >
      <Navbar />
      <div className={classes.listContainer}>
        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
          <Droppable
            droppableId="main-droppable-container"
            direction={isMobile ? 'vertical' : 'horizontal'}
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
            <PlusOutlined />
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
      callMethod('getUserData', (err, response) => {
        if (err) {
          dispatch(homeGetUserDataFailure());
          message.error(
            'Your board could not be loaded. Please refresh to try again.'
          );
        } else {
          dispatch(
            homeGetUserDataSuccess({
              email: response.emails[0]?.address || '',
              avatarSrc: response.avatarSrc,
              todos: response.todos,
              columns: response.columns,
              columnOrder: response.columnOrder
            })
          );
        }
      });
    },
    onDragEnd: (result) => {
      const { reason, destination } = result;
      if (reason !== 'CANCEL' && destination) {
        dispatch(homeDragAndDropRequest(result));
        callMethod('dragAndDrop', result, (err, response) => {
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
        id: Random.id(),
        title: 'my toodlist',
        todoIds: [],
        color: 'white'
      };
      dispatch(homeCreateTodolistRequest(newColumn));
      callMethod('createTodolist', newColumn, (err, response) => {
        if (err) {
          dispatch(homeCreateTodolistFailure());
          message.error('Your request failed to complete, please try again.');
        } else {
          dispatch(homeCreateTodolistSuccess());
        }
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Home));
