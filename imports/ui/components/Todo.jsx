import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import notification from 'antd/lib/notification';
import { Draggable } from 'react-beautiful-dnd';
import {
  todoEditRequest,
  todoEditSuccess,
  todoEditFailure,
  todoDeleteRequest,
  todoDeleteSuccess,
  todoDeleteFailure
} from '../actions/Todo';

class Todo extends Component {
  state = { isBeingEdited: false };

  componentDidUpdate = (_, prevState) => {
    if (!prevState.isBeingEdited && this.state.isBeingEdited) {
      this.todoInput.focus();
    }
  };

  toggleEditTodo = () => {
    this.setState({ isBeingEdited: true });
  };

  saveTodoRef = ref => (this.todoInput = ref);

  updateTodo = e => {
    this.props.editTodo({
      id: this.props.todo.id,
      content: e.target.value
    });
    this.setState({ isBeingEdited: false });
  };

  render() {
    const {
      index,
      todo,
      editTodo,
      deleteTodo
    } = this.props;

    return (
      <Draggable
        draggableId={todo.id}
        index={index}
      >
        {provided => (
          <div
            className="todo"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {!this.state.isBeingEdited && (
              <span>{todo.content}</span>
            )}
            {this.state.isBeingEdited && (
              <Input
                ref={this.saveTodoRef}
                defaultValue={todo.content}
                onBlur={this.updateTodo}
                onPressEnter={this.updateTodo}
              />
            )}
            <span>
              <a onClick={this.toggleEditTodo}>edit</a>
              {' | '}
              <a onClick={() => deleteTodo(todo.id)}><Icon type="delete" /></a>
            </span>
          </div>
        )}
      </Draggable>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    editTodo: newTodo => {
      if (newTodo.content) {
        dispatch(todoEditRequest(newTodo));
        Meteor.call(
          'editTodo',
          Meteor.userId(),
          newTodo,
          (err, response) => {
            if (err) {
              dispatch(todoEditFailure());
              notification.error({
                message: 'Your request failed to complete.',
                description: 'Please refresh the page and try again.'
              });
            } else {
              dispatch(todoEditSuccess());
            }
          }
        );
      }
    },
    deleteTodo: tid => {
      dispatch(todoDeleteRequest(tid));
      Meteor.call(
        'deleteTodo',
        Meteor.userId(),
        tid,
        (err, response) => {
          if (err) {
            dispatch(todoDeleteFailure());
            notification.error({
              message: 'Your request failed to complete.',
              description: 'Please refresh the page and try again.'
            });
          } else {
            dispatch(todoDeleteSuccess());
          }
        }
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Todo);
