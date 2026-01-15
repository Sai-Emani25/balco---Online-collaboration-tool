import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import io from 'socket.io-client';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';
import ShareLink from '../components/ShareLink';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`;

const Header = styled.div`
  background-color: #667eea;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  margin: 0;
`;

const socket = io('http://localhost:5000');

function Room() {
  const { roomId } = useParams();
  const [notes, setNotes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Join the room
    socket.emit('join-room', roomId);

    // Listen for initial room state
    socket.on('room-state', (roomState) => {
      setNotes(roomState.notes || []);
      setConnections(roomState.connections || []);
    });

    // Listen for note updates
    socket.on('note-updated', (note) => {
      setNotes(prev => {
        const index = prev.findIndex(n => n.id === note.id);
        if (index !== -1) {
          const newNotes = [...prev];
          newNotes[index] = note;
          return newNotes;
        }
        return [...prev, note];
      });
    });

    // Listen for note deletions
    socket.on('note-deleted', (noteId) => {
      setNotes(prev => prev.filter(n => n.id !== noteId));
    });

    // Listen for connection updates
    socket.on('connection-updated', (connection) => {
      setConnections(prev => {
        const index = prev.findIndex(c => c.id === connection.id);
        if (index !== -1) {
          const newConnections = [...prev];
          newConnections[index] = connection;
          return newConnections;
        }
        return [...prev, connection];
      });
    });

    // Listen for connection deletions
    socket.on('connection-deleted', (connectionId) => {
      setConnections(prev => prev.filter(c => c.id !== connectionId));
    });

    // Listen for user events
    socket.on('user-joined', ({ userId }) => {
      setUsers(prev => [...prev, userId]);
    });

    return () => {
      socket.off('room-state');
      socket.off('note-updated');
      socket.off('note-deleted');
      socket.off('connection-updated');
      socket.off('connection-deleted');
      socket.off('user-joined');
    };
  }, [roomId]);

  const handleNoteUpdate = (note) => {
    setNotes(prev => {
      const index = prev.findIndex(n => n.id === note.id);
      if (index !== -1) {
        const newNotes = [...prev];
        newNotes[index] = note;
        return newNotes;
      }
      return [...prev, note];
    });
    socket.emit('update-note', { roomId, note });
  };

  const handleNoteDelete = (noteId) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    socket.emit('delete-note', { roomId, noteId });
  };

  const handleConnectionUpdate = (connection) => {
    setConnections(prev => {
      const index = prev.findIndex(c => c.id === connection.id);
      if (index !== -1) {
        const newConnections = [...prev];
        newConnections[index] = connection;
        return newConnections;
      }
      return [...prev, connection];
    });
    socket.emit('update-connection', { roomId, connection });
  };

  const handleConnectionDelete = (connectionId) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
    socket.emit('delete-connection', { roomId, connectionId });
  };

  return (
    <Container>
      <Header>
        <Title>Live-Sync Classroom</Title>
        <ShareLink roomId={roomId} />
      </Header>
      <Toolbar onAddNote={handleNoteUpdate} />
      <Canvas
        notes={notes}
        connections={connections}
        onNoteUpdate={handleNoteUpdate}
        onNoteDelete={handleNoteDelete}
        onConnectionUpdate={handleConnectionUpdate}
        onConnectionDelete={handleConnectionDelete}
      />
    </Container>
  );
}

export default Room;
