import React from 'react';
import ReactDOM from 'react-dom';
import initialData from "./initial-data";
import Column from "./column";
import '@atlaskit/css-reset';
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {
  state = initialData;

  _onDragStart = start => {
    document.body.style.color = "orange";
    document.body.style.transition = "background-color 0.2s ease";
  }

  _onDragUpdate = update => {
    const { tasks } = this.state;
    const { destination } = update;
    const opacity = destination ? destination.index / Object.keys(tasks).length : 0;

    document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`
  }

  _onDragEnd = result => {
    document.body.style.color = "inherit";
    document.body.style.backgroundColor = "inherit";

    const { destination, source, draggableId, type } = result;
    const { columns, columnOrder } = this.state;

    if(!destination) {
      return;
    }

    if(destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if(type === 'column') {
      const newColumnOrder = Array.from(columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...this.state,
        columnOrder: newColumnOrder
      }

      this.setState(newState);
      return;
    }

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if(start === finish) {
      const newTaskIds = Array.from(start.taskIds);

      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        },
      };

      this.setState(newState);
      return;
    }

    const newTaskIds = Array.from(start.taskIds);

    newTaskIds.splice(source.index, 1);

    const newTaskFinishIds = Array.from(finish.taskIds);

    newTaskFinishIds.splice(destination.index, 0, draggableId);

    const newStart = {
      ...start,
      taskIds: newTaskIds
    };

    const newFinish = {
      ...finish,
      taskIds: newTaskFinishIds
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    this.setState(newState);
  }

  render() {
    const { columnOrder, columns, tasks } = this.state;

    return (
      <DragDropContext
        onDragStart={this._onDragStart}
        onDragUpdate={this._onDragUpdate}
        onDragEnd={this._onDragEnd}
      >
        <Droppable droppableId={'all-columns'} type={'column'} direction={'horizontal'}>
          {(provided, snapshot) => (
            <Container {...provided.droppableProps}  innerRef={provided.innerRef}>
              {columnOrder.map((columnId, index) => {
                const column = columns[columnId];
                const newTasks = column.taskIds.map(taskId => tasks[taskId]);

                return <Column column={column} key={column.id} tasks={newTasks} index={index}/>
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>


      </DragDropContext>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
