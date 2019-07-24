import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from 'antd/lib/typography';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import { Droppable } from 'react-beautiful-dnd';
import Todo from './Todo';
import {
  columnUpdateTitleRequest,
  columnUpdateTitleSuccess,
  columnUpdateTitleFailure
} from '../actions/Column';

const { Title } = Typography;

class Column extends Component {
  state = {
    isInputVisible: false
  };

  componentDidUpdate = (_, prevState) => {
    if (
      prevState.isInputVisible === false &&
      this.state.isInputVisible
    ) {
      this.input.focus();
    }
  };

  editTitle = () => {
    this.setState({ isInputVisible: true });
  };

  updateTitle = e => {
    this.props.updateTitle(
      this.props.column.id,
      e.target.value
    );
    this.setState({ isInputVisible: false });
  };

  saveRef = ref => (this.input = ref);

  render() {
    const {
      column,
      todos
    } = this.props;

    return (
      <div className="column">
        <div>
          {!this.state.isInputVisible && (
            <Title
              level={4}
              onClick={this.editTitle}
            >
              {column.title}
            </Title>
          )}
          {this.state.isInputVisible && (
            <Input
              ref={this.saveRef}
              defaultValue={column.title}
              onBlur={this.updateTitle}
              onPressEnter={this.updateTitle}
            />
          )}
          <Button
            icon="plus"
            shape="circle"
            size="small"
            onClick={() => {}}
          />
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
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Column);
