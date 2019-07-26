import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Popconfirm from 'antd/lib/popconfirm';
import Typography from 'antd/lib/typography';
import notification from 'antd/lib/notification';
import { Droppable } from 'react-beautiful-dnd';
import Todo from './Todo';
import {
  columnUpdateTitleRequest,
  columnUpdateTitleSuccess,
  columnUpdateTitleFailure,
  columnDeleteTodolistRequest,
  columnDeleteTodolistSuccess,
  columnDeleteTodolistFailure,
  columnCreateTodoRequest,
  columnCreateTodoSuccess,
  columnCreateTodoFailure
} from '../actions/Column';

const { Title } = Typography;

class Column extends Component {
  state = {
    isTitleInputVisible: false,
    isTodoInputVisible: false
  };

  componentDidUpdate = (_, prevState) => {
    const {
      isTitleInputVisible,
      isTodoInputVisible
    } = this.state;

    if (!prevState.isTitleInputVisible && isTitleInputVisible) {
      this.titleInput.focus();
    } else if (!prevState.isTodoInputVisible && isTodoInputVisible) {
      this.todoInput.focus();
    }
  };

  saveTitleRef = ref => (this.titleInput = ref);

  saveTodoRef = ref => (this.todoInput = ref);

  toggleEditTitle = () => {
    this.setState({ isTitleInputVisible: true });
  };

  toggleNewTodo = () => {
    this.setState({ isTodoInputVisible: true });
  };

  updateTitle = e => {
    this.props.updateTitle(
      this.props.column.id,
      e.target.value
    );
    this.setState({ isTitleInputVisible: false });
  };

  createTodo = e => {
    this.props.createTodo(
      this.props.column.id,
      e.target.value
    );
    this.setState({ isTodoInputVisible: false });
  };

  createTodoAndFocusInput = e => {
    this.props.createTodo(
      this.props.column.id,
      e.target.value
    );
    this.todoInput.state.value = "";
    this.todoInput.focus();
  };

  render() {
    const { column, todos, deleteTodolist } = this.props;

    return (
      <div className="column">
        <div>
          {!this.state.isTitleInputVisible && (
            <Title
              level={4}
              onClick={this.toggleEditTitle}
            >
              {column.title}
            </Title>
          )}
          {this.state.isTitleInputVisible && (
            <Input
              ref={this.saveTitleRef}
              defaultValue={column.title}
              onBlur={this.updateTitle}
              onPressEnter={this.updateTitle}
            />
          )}
          <Popconfirm
            okType="danger"
            title="Delete toodlist?"
            icon={<Icon type="warning" />}
            onConfirm={() => deleteTodolist(column.id)}
          >
            <Button
              icon="close"
              shape="circle"
              size="small"
              type="danger"
            />
          </Popconfirm>
        </div>
        <Droppable droppableId={column.id}>
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {todos.map((todo, index) => (
                <Todo
                  key={todo.id}
                  index={index}
                  todo={todo}
                />
              ))}
              {provided.placeholder}
              {!this.state.isTodoInputVisible && (
                <div
                  className="todo todo-add-placeholder"
                  onClick={this.toggleNewTodo}
                >
                  <Icon type="plus" />&nbsp;new item
                </div>
              )}
              {this.state.isTodoInputVisible && (
                <Input
                  className="todo todo-add-input"
                  ref={this.saveTodoRef}
                  defaultValue=""
                  onBlur={this.createTodo}
                  onPressEnter={this.createTodoAndFocusInput}
                />
              )}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    updateTitle: (cid, title) => {
      if (title) {
        dispatch(columnUpdateTitleRequest(cid, title));
        Meteor.call(
          'updateTitle',
          Meteor.userId(),
          cid,
          title,
          (err, response) => {
            if (err) {
              dispatch(columnUpdateTitleFailure());
              notification.error({
                message: 'Your request failed to complete.',
                description: 'Please refresh the page and try again.'
              });
            } else {
              dispatch(columnUpdateTitleSuccess());
            }
          }
        );
      }
    },
    deleteTodolist: cid => {
      dispatch(columnDeleteTodolistRequest(cid));
      Meteor.call(
        'deleteTodolist',
        Meteor.userId(),
        cid,
        (err, response) => {
          if (err) {
            dispatch(columnDeleteTodolistFailure());
            notification.error({
              message: 'Your request failed to complete.',
              description: 'Please refresh the page and try again.'
            });
          } else {
            dispatch(columnDeleteTodolistSuccess());
          }
        }
      );
    },
    createTodo: (cid, todoContent) => {
      if (todoContent) {
        const newTodo = {
          id: Date.now(),
          content: todoContent
        };
        dispatch(columnCreateTodoRequest(cid, newTodo));
        Meteor.call(
          'createTodo',
          Meteor.userId(),
          cid,
          newTodo,
          (err, response) => {
            if (err) {
              dispatch(columnCreateTodoFailure());
              notification.error({
                message: 'Your request failed to complete.',
                description: 'Please refresh the page and try again.'
              });
            } else {
              dispatch(columnCreateTodoSuccess());
            }
          }
        );
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Column);
