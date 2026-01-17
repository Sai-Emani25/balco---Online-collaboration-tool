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
  z-index: 10;
`;

const RoomNameInput = styled.input`
  font-size: 1.5rem;
  font-weight: bold;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: white;
  padding: 0.2rem 0.5rem;
  outline: none;
  transition: all 0.2s;
  min-width: 200px;
  
  &:hover, &:focus {
    border-bottom: 2px solid rgba(255,255,255,0.5);
    background: rgba(255,255,255,0.1);
  }
`;

const ErrorMessage = styled.div`
  background-color: #ff9800;
  color: white;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
`;

const ZoomControls = styled.div`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  background: white;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 100;
`;

const ZoomButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const ZoomLevel = styled.span`
  min-width: 50px;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

let socket = null;

function BalcoRoom() {
  const { roomId } = useParams();
  const [notes, setNotes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [roomName, setRoomName] = useState('Untitled Room');

  // Load/Update Recent Rooms
  useEffect(() => {
    const updateRecentRooms = () => {
      const recent = JSON.parse(localStorage.getItem('balco_recent_rooms') || '[]');
      const newRoom = { id: roomId, name: roomName, lastVisited: Date.now() };

      // Remove existing entry for this room if exists
      const filtered = recent.filter(r => r.id !== roomId);

      // Add new to front
      filtered.unshift(newRoom);

      // Keep max 3
      const trimmed = filtered.slice(0, 3);

      localStorage.setItem('balco_recent_rooms', JSON.stringify(trimmed));
    };

    if (roomId && roomName) {
      updateRecentRooms();
    }
  }, [roomId, roomName]);

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
        if (roomState.name) setRoomName(roomState.name);
      });

      socket.on('room-name-updated', (name) => {
        setRoomName(name);
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
          socket.off('room-name-updated');
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

  const handleNameChange = (e) => {
    setRoomName(e.target.value);
  };

  const handleNameBlur = () => {
    if (socket && isConnected) {
      socket.emit('update-room-name', { roomId, name: roomName });
    }
  };

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
        <RoomNameInput
          value={roomName}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          placeholder="Untitled Room"
        />
        <BalcoShareLink roomId={roomId} />
      </Header>
      <BalcoToolbar onAddNote={handleNoteUpdate} />
      <BalcoCanvas
        notes={notes}
        connections={connections}
        zoom={zoom}
        setZoom={setZoom}
        pan={pan}
        setPan={setPan}
        onNoteUpdate={handleNoteUpdate}
        onNoteDelete={handleNoteDelete}
        onConnectionUpdate={handleConnectionUpdate}
        onConnectionDelete={handleConnectionDelete}
      />
      <ZoomControls>
        <ZoomButton onClick={() => setZoom(z => Math.max(0.2, z - 0.1))}>-</ZoomButton>
        <ZoomLevel>{Math.round(zoom * 100)}%</ZoomLevel>
        <ZoomButton onClick={() => setZoom(z => Math.min(2, z + 0.1))}>+</ZoomButton>
      </ZoomControls>
    </Container>
  );
}

export default BalcoRoom;
