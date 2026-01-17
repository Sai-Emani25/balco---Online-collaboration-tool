import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  text-align: center;
  max-width: 600px;
  padding: 0 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const CreateButton = styled(Button)`
  background-color: #4CAF50;
  color: white;
`;

const JoinButton = styled(Button)`
  background-color: white;
  color: #667eea;
`;

const Input = styled.input`
  padding: 1rem;
  font-size: 1rem;
  border: 2px solid white;
  border-radius: 8px;
  margin-right: 1rem;
  width: 300px;
`;

function BalcoHome() {
  const navigate = useNavigate();
  const [showJoinInput, setShowJoinInput] = React.useState(false);
  const [roomId, setRoomId] = React.useState('');

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 10);
    navigate(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <Container>
      <Title>🎨 Balco</Title>
      <Subtitle>
        Collaborate in real-time with digital sticky notes, task management, and instant synchronization.
        Create projects, connect ideas, and work together seamlessly.
      </Subtitle>

      {!showJoinInput ? (
        <ButtonContainer>
          <CreateButton onClick={createRoom}>Create New Room</CreateButton>
          <JoinButton onClick={() => setShowJoinInput(true)}>Join Room</JoinButton>
        </ButtonContainer>
      ) : (
        <div>
          <Input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
          />
          <JoinButton onClick={joinRoom}>Join</JoinButton>
          <Button onClick={() => setShowJoinInput(false)} style={{ marginLeft: '1rem', background: '#666', color: 'white' }}>
            Cancel
          </Button>
        </div>
      )}

      {/* Recent Rooms Component */}
      <RecentRooms />

    </Container>
  );
}

function RecentRooms() {
  const navigate = useNavigate();
  const [recent, setRecent] = React.useState([]);

  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('balco_recent_rooms') || '[]');
    setRecent(saved);
  }, []);

  if (recent.length === 0) return null;

  return (
    <div style={{ marginTop: '3rem', width: '100%', maxWidth: '600px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem', opacity: 0.8 }}>Recent Rooms</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {recent.map(room => (
          <div
            key={room.id}
            onClick={() => navigate(`/room/${room.id}`)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <span style={{ fontWeight: 'bold' }}>{room.name || 'Untitled Room'}</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>ID: {room.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


export default BalcoHome;
