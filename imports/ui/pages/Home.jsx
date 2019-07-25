import React, { Component } from 'react';
import { connect } from 'react-redux';
import Avatar from 'antd/lib/avatar';
import Dropdown from 'antd/lib/dropdown';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from '../components/Column';
import {
  homeSignOut,
  homeDragAndDropRequest,
  homeDragAndDropSuccess,
  homeDragAndDropFailure,
  homeCreateTodolist
} from '../actions/Home';

class Home extends Component {
  componentDidMount() {
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
            {columnOrder.map(cid => {
              const column = columns[cid];
              const theseTodos = column.todoIds.map(tid => todos[tid]);
              return <Column key={cid} column={column} todos={theseTodos} />
            })}
            <div
              className="column column-add-placeholder"
              onClick={() => createTodolist()}
            >
              <Icon type="plus" />&nbsp;new todolist
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
    signOut: history => {
      Meteor.logout(err => {
        dispatch(homeSignOut());
        history.push('/');
      });
    },
    onDragEnd: result => {
      dispatch(homeDragAndDropRequest(result));
    },
    createTodolist: () => {
      dispatch(homeCreateTodolist());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
