import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
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
              <a onClick={() => deleteTodo(todo)}><Icon type="delete" /></a>
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
    editTodo: todo => {
      dispatch(todoEditRequest(todo));
    },
    deleteTodo: todo => {
      dispatch(todoDeleteRequest(todo));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Todo);
