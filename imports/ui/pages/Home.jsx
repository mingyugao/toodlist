import React, { Component } from 'react';
import { connect } from 'react-redux';
import Avatar from 'antd/lib/avatar';
import Dropdown from 'antd/lib/dropdown';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import notification from 'antd/lib/notification';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from '../components/Column';
import {
  homeSignOut,
  homeGetTodosRequest,
  homeGetTodosSuccess,
  homeGetTodosFailure,
  homeDragAndDropRequest,
  homeDragAndDropSuccess,
  homeDragAndDropFailure,
  homeCreateTodolistRequest,
  homeCreateTodolistSuccess,
  homeCreateTodolistFailure
} from '../actions/Home';

class Home extends Component {
  componentDidMount() {
    this.props.getTodos();
  }

  render() {
    const {
      history,
      todos,
      columns,
      columnOrder,
      signOut,
      onDragEnd,
      createTodolist
    } = this.props;

    return (
      <div id="home">
        <div>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => signOut(history)}>
                  Log out
                </Menu.Item>
              </Menu>
            }
            overlayClassName="home-avatar-dropdown"
            trigger={['click']}
          >
            <Avatar icon="user" />
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
                  {columnOrder.map((cid, index) => {
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
                  })}
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    todos: state.home.todos,
    columns: state.home.columns,
    columnOrder: state.home.columnOrder
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTodos: () => {
      dispatch(homeGetTodosRequest());
      Meteor.call('getData', Meteor.userId(), (err, response) => {
        if (err) {
          dispatch(homeGetTodosFailure());
        } else {
          dispatch(homeGetTodosSuccess(response));
        }
      });
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
        todoIds: []
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
