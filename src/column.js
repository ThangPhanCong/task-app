import React, { Component } from "react";
import styled from "styled-components";
import Task from "./task";
import { Droppable, Draggable } from "react-beautiful-dnd";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  width: 220px;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const Title = styled.h3`
  padding: 8px;
`;

const TaskList = styled.div`
  padding: 8px;
  background-color: ${props => props.isDraggingOver ? "skyblue" : "inherit"};
  flex-grow: 1
`;

class Column extends Component {
  render() {
    const { column, tasks } = this.props;

    return (
      <Draggable draggableId={column.id} index={this.props.index}>
        {(provided) => (
          <Container {...provided.draggableProps}
                     innerRef={provided.innerRef}>
            <Title {...provided.dragHandleProps}>{column.title}</Title>
            <Droppable droppableId={column.id} type={'task'}>
              {(provided, snapshot) => (
                <TaskList {...provided.droppableProps}
                          isDraggingOver={snapshot.isDraggingOver}
                          innerRef={provided.innerRef}>
                  {tasks.map((task, index) => <Task key={task.id} task={task} index={index}/>)}
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
            {provided.placeholder}
          </Container>

        )}
      </Draggable>

    )
  }
}

export default Column;