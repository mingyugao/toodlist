import React from 'react';
import { connect } from 'react-redux';
import Icon from 'antd/lib/icon';
import { Draggable } from 'react-beautiful-dnd';
import {
  todoEditRequest,
  todoEditSuccess,
  todoEditFailure,
  todoDeleteRequest,
  todoDeleteSuccess,
  todoDeleteFailure
} from '../actions/Todo';

const Todo = ({
  index,
  todo,
  editTodo,
  deleteTodo
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
          <a onClick={() => deleteTodo(todo)}><Icon type="delete" /></a>
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
    deleteTodo: todo => {
      dispatch(todoDeleteRequest(todo));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Todo);
