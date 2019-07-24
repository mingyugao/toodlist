import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Todo = ({ index, todo }) => (
  <Draggable
    draggableId={todo.id}
    index={index}
  >
    {provided => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {todo.content}
      </div>
    )}
  </Draggable>
);

export default Todo;
