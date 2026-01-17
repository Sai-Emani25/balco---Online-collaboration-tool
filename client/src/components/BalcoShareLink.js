import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RoomId = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-family: monospace;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid white;
  border-radius: 6px;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

function BalcoShareLink({ roomId }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Container>
      <RoomId>Room: {roomId}</RoomId>
      <Button
        onClick={handleCopy}
        title="To share with others on your WiFi, replace 'localhost' with your computer's IP address (e.g., 192.168.x.x) in the copied link."
      >
        {copied ? '✓ Copied!' : '📋 Share Link'}
      </Button>
    </Container>
  );
}

export default BalcoShareLink;
