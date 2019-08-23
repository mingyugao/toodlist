import React, { Component } from 'react';
import { connect } from 'react-redux';
import Avatar from 'antd/lib/avatar';
import Dropdown from 'antd/lib/dropdown';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import notification from 'antd/lib/notification';
import {
  DragDropContext,
  Droppable
} from 'react-beautiful-dnd';
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

class Home extends Component {
  componentDidMount() {
    this.props.getUserData(this.props.history);
  }

  render() {
    const {
      history,
      isLoading,
      email,
      avatarSrc,
      todos,
      columns,
      columnOrder,
      isSettingsOpen,
      openSettings,
      signOut,
      onDragEnd,
      createTodolist
    } = this.props;

    const avatarMenu = (
      <Menu>
        <Menu.Item disabled>
          {email}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={() => openSettings(history)}>
          Settings
        </Menu.Item>
        <Menu.Item onClick={() => signOut(history)}>
          Log out
        </Menu.Item>
      </Menu>
    );

    const renderedColumns = columnOrder.map((cid, index) => {
      const column = columns[cid];
      const theseTodos = column.todoIds.map(tid => todos[tid]);
      return (
        <Column
          key={cid}
          index={index}
          column={column}
          todos={theseTodos}
        />
      );
    });

    return (
      <div
        id="home"
        style={isSettingsOpen ? { filter: 'blur(2px)' } : {}}
      >
        <div>
          <Dropdown
            overlay={avatarMenu}
            overlayClassName="home-avatar-dropdown"
            trigger={['click']}
          >
            <Avatar
              icon="user"
              size="large"
              src={avatarSrc || ''}
            />
          </Dropdown>
        </div>
        <div>
          <DragDropContext
            onDragEnd={result => onDragEnd(result)}
          >
            <Droppable
              droppableId="main-droppable-container"
              direction="horizontal"
              type="column"
            >
              {mainProvided => (
                <div
                  ref={mainProvided.innerRef}
                  {...mainProvided.droppableProps}
                >
                  {renderedColumns}
                  {mainProvided.placeholder}
                </div>
              )}
            </Droppable>
            <div
              className="column-add-placeholder"
              onClick={() => createTodolist()}
            >
              <Icon type="plus" />&nbsp;new toodlist
            </div>
          </DragDropContext>
        </div>
        <Settings />
        {isLoading && (<Loading />)}
      </div>
    );
  }
}

const mapStateToProps = state => {
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

const mapDispatchToProps = dispatch => {
  return {
    getUserData: history => {
      dispatch(homeGetUserDataRequest());
      Meteor.call(
        'getUserData',
        Meteor.userId(),
        (err, response) => {
          if (err) {
            dispatch(homeGetUserDataFailure());
            history.push('/');
          } else {
            dispatch(homeGetUserDataSuccess({
              email: response.emails[0].address,
              avatarSrc: response.avatarSrc,
              todos: response.todos,
              columns: response.columns,
              columnOrder: response.columnOrder
            }));
          }
        }
      );
    },
    openSettings: () => {
      dispatch(openSettings());
    },
    signOut: history => {
      Meteor.logout(err => {
        dispatch(homeSignOut());
        history.push('/');
      });
    },
    onDragEnd: result => {
      const { reason, destination } = result;
      if (reason !== 'CANCEL' && destination) {
        dispatch(homeDragAndDropRequest(result));
        Meteor.call(
          'dragAndDrop',
          Meteor.userId(),
          result,
          (err, response) => {
            if (err) {
              dispatch(homeDragAndDropFailure());
              notification.error({
                message: 'Your request failed to complete.',
                description: 'Please refresh the page and try again.'
              });
            } else {
              dispatch(homeDragAndDropSuccess());
            }
          }
        );
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
            notification.error({
              message: 'Your request failed to complete.',
              description: 'Please refresh the page and try again.'
            });
          } else {
            dispatch(homeCreateTodolistSuccess());
          }
        }
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
