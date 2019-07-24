import React from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import Icon from 'antd/lib/icon';
import {
  todoEditRequest,
  todoEditSuccess,
  todoEditFailure,
  todoRemoveRequest,
  todoRemoveSuccess,
  todoRemoveFailure
} from '../actions/Todo';

const Todo = ({
  index,
  todo,
  editTodo,
  removeTodo
}) => (
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
        <span>{todo.content}</span>
        <span>
          <a onClick={() => editTodo(todo)}>edit</a>
          {' | '}
          <a onClick={() => removeTodo(todo)}><Icon type="delete" /></a>
      </span>
      </div>
    )}
  </Draggable>
);

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    editTodo: todo => {
      dispatch(todoEditRequest(todo));
    },
    removeTodo: todo => {
      dispatch(todoRemoveRequest(todo));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Todo);
