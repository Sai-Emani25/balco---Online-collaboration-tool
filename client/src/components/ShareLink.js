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

const CopyMessage = styled.span`
  font-size: 0.85rem;
  color: #4CAF50;
  background-color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
`;

function ShareLink({ roomId }) {
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
      <Button onClick={handleCopy}>
        {copied ? '✓ Copied!' : '📋 Share Link'}
      </Button>
    </Container>
  );
}

export default ShareLink;
