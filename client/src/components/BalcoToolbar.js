import React from 'react';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  background-color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #45a049;
  }
`;

const ColorOption = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.color};
  cursor: pointer;
  border: 2px solid ${props => props.selected ? '#333' : 'transparent'};
  transition: border 0.2s;
  
  &:hover {
    border: 2px solid #666;
  }
`;

const ColorPalette = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-left: 1rem;
`;

const colors = ['#ffeb3b', '#ff9800', '#f44336', '#e91e63', '#9c27b0', '#3f51b5', '#2196f3', '#00bcd4', '#4CAF50', '#8bc34a'];

function BalcoToolbar({ onAddNote }) {
  const [selectedColor, setSelectedColor] = React.useState('#ffeb3b');

  const handleAddNote = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      content: '',
      title: 'New Note',
      color: selectedColor,
      position: {
        x: Math.random() * (window.innerWidth - 300),
        y: Math.random() * (window.innerHeight - 400) + 100
      }
    };
    onAddNote(newNote);
  };

  return (
    <ToolbarContainer>
      <Button onClick={handleAddNote}>➕ Add Sticky Note</Button>
      <ColorPalette>
        <span style={{ fontSize: '0.9rem', color: '#666' }}>Color:</span>
        {colors.map(color => (
          <ColorOption
            key={color}
            color={color}
            selected={selectedColor === color}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </ColorPalette>
    </ToolbarContainer>
  );
}

export default BalcoToolbar;
