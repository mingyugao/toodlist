import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import message from 'antd/lib/message';
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

  saveTodoRef = (ref) => (this.todoInput = ref);

  updateTodo = (e) => {
    this.props.editTodo({
      id: this.props.todo.id,
      content: e.target.value
    });
    this.setState({ isBeingEdited: false });
  };

  deleteTodo = () => {
    const todo = document.getElementById(this.props.todo.id);
    if (todo.animate) {
      const anim = todo.animate(
        {
          opacity: [1, 0],
          transform: ['scale(1)', 'scale(0)']
        },
        200
      );
      anim.onfinish = () => {
        this.props.deleteTodo(this.props.todo.id);
      };
    } else {
      this.props.deleteTodo(this.props.todo.id);
    }
  };

  render() {
    const { index, todo, editTodo } = this.props;

    return (
      <Draggable draggableId={todo.id} index={index}>
        {(todoProvided) => (
          <div
            className="todo"
            id={todo.id}
            ref={todoProvided.innerRef}
            {...todoProvided.draggableProps}
            {...todoProvided.dragHandleProps}
          >
            {!this.state.isBeingEdited && <span>{todo.content}</span>}
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
              <a onClick={this.deleteTodo}>
                <Icon type="delete" />
              </a>
            </span>
          </div>
        )}
      </Draggable>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    editTodo: (newTodo) => {
      if (newTodo.content) {
        dispatch(todoEditRequest(newTodo));
        Meteor.call('editTodo', Meteor.userId(), newTodo, (err, response) => {
          if (err) {
            dispatch(todoEditFailure());
            message.error('Your request failed to complete, please try again.');
          } else {
            dispatch(todoEditSuccess());
          }
        });
      }
    },
    deleteTodo: (tid) => {
      dispatch(todoDeleteRequest(tid));
      Meteor.call('deleteTodo', Meteor.userId(), tid, (err, response) => {
        if (err) {
          dispatch(todoDeleteFailure());
          message.error('Your request failed to complete, please try again.');
        } else {
          dispatch(todoDeleteSuccess());
        }
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Todo);
