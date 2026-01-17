import React, { useState } from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import BalcoStickyNote from './BalcoStickyNote';

const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: #f9f9f9;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
`;

const SVGCanvas = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Connection = styled.line`
  stroke: #667eea;
  stroke-width: 2;
  pointer-events: stroke;
  cursor: pointer;
  
  &:hover {
    stroke: #ff6b6b;
    stroke-width: 3;
  }
`;

function BalcoCanvas({ notes, connections, onNoteUpdate, onNoteDelete, onConnectionUpdate, onConnectionDelete }) {
  const [connectingFrom, setConnectingFrom] = useState(null);

  const handleNoteDrag = (noteId, e, data) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      onNoteUpdate({
        ...note,
        position: { x: data.x, y: data.y }
      });
    }
  };

  const handleStartConnection = (noteId) => {
    if (connectingFrom === null) {
      setConnectingFrom(noteId);
    } else if (connectingFrom !== noteId) {
      // Create connection
      const connection = {
        id: `conn-${Date.now()}`,
        from: connectingFrom,
        to: noteId
      };
      onConnectionUpdate(connection);
      setConnectingFrom(null);
    }
  };

  const handleConnectionClick = (connectionId) => {
    if (window.confirm('Delete this connection?')) {
      onConnectionDelete(connectionId);
    }
  };

  const getNoteCenterPosition = (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return { x: 0, y: 0 };
    return {
      x: note.position.x + 125, // Half of note width (250/2)
      y: note.position.y + 125  // Half of note height (250/2)
    };
  };

  return (
    <CanvasContainer>
      <SVGCanvas>
        {connections.map(conn => {
          const from = getNoteCenterPosition(conn.from);
          const to = getNoteCenterPosition(conn.to);
          return (
            <Connection
              key={conn.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              onClick={() => handleConnectionClick(conn.id)}
            />
          );
        })}
      </SVGCanvas>
      
      {notes.map(note => (
        <Draggable
          key={note.id}
          position={note.position}
          onStop={(e, data) => handleNoteDrag(note.id, e, data)}
          handle=".drag-handle"
        >
          <div style={{ position: 'absolute' }}>
            <BalcoStickyNote
              note={note}
              onUpdate={onNoteUpdate}
              onDelete={onNoteDelete}
              onConnect={handleStartConnection}
              isConnecting={connectingFrom === note.id}
            />
          </div>
        </Draggable>
      ))}
    </CanvasContainer>
  );
}

export default BalcoCanvas;
