import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import io from 'socket.io-client';
import BalcoCanvas from '../components/BalcoCanvas';
import BalcoToolbar from '../components/BalcoToolbar';
import BalcoShareLink from '../components/BalcoShareLink';

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

const ErrorMessage = styled.div`
  background-color: #ff9800;
  color: white;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
`;

let socket = null;

function BalcoRoom() {
  const { roomId } = useParams();
  const [notes, setNotes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    try {
      // Try to connect to backend
      socket = io('http://localhost:1000', {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 3
      });

      socket.on('connect', () => {
        setIsConnected(true);
        socket.emit('join-room', roomId);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.log('Connection error:', error);
        setIsConnected(false);
      });

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

    return () => {
      if (socket) {
        socket.off('room-state');
        socket.off('note-updated');
        socket.off('note-deleted');
        socket.off('connection-updated');
        socket.off('connection-deleted');
        socket.off('connect');
        socket.off('disconnect');
      }
    };
    } catch (error) {
      console.log('Failed to initialize socket:', error);
      setIsConnected(false);
    }
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
    if (socket && isConnected) {
      socket.emit('update-note', { roomId, note });
    }
  };

  const handleNoteDelete = (noteId) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    if (socket && isConnected) {
      socket.emit('delete-note', { roomId, noteId });
    }
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
    if (socket && isConnected) {
      socket.emit('update-connection', { roomId, connection });
    }
  };

  const handleConnectionDelete = (connectionId) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
    if (socket && isConnected) {
      socket.emit('delete-connection', { roomId, connectionId });
    }
  };

  return (
    <Container>
      {!isConnected && (
        <ErrorMessage>
          ⚠️ Offline Mode: Backend server not available. Changes will not be synced. For full features, run the backend server locally.
        </ErrorMessage>
      )}
      <Header>
        <Title>Live-Sync Classroom</Title>
        <BalcoShareLink roomId={roomId} />
      </Header>
      <BalcoToolbar onAddNote={handleNoteUpdate} />
      <BalcoCanvas
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

export default BalcoRoom;
