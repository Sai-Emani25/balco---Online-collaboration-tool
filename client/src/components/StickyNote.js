import React, { useState } from 'react';
import styled from 'styled-components';

const NoteContainer = styled.div`
  width: 250px;
  min-height: 250px;
  background-color: ${props => props.color || '#ffeb3b'};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  cursor: move;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: box-shadow 0.2s;
  
  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
  
  ${props => props.isConnecting && `
    border: 3px solid #667eea;
  `}
`;

const DragHandle = styled.div`
  cursor: move;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
  font-weight: bold;
  font-size: 0.9rem;
  color: #333;
`;

const TextArea = styled.textarea`
  flex: 1;
  border: none;
  background: transparent;
  resize: none;
  outline: none;
  font-family: 'Segoe UI', sans-serif;
  font-size: 1rem;
  min-height: 150px;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #ff6b6b;
  color: white;
`;

const ConnectButton = styled(Button)`
  background-color: #667eea;
  color: white;
`;

const ColorPicker = styled.input`
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

function StickyNote({ note, onUpdate, onDelete, onConnect, isConnecting }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content || '');

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate({ ...note, content });
  };

  const handleColorChange = (e) => {
    onUpdate({ ...note, color: e.target.value });
  };

  return (
    <NoteContainer color={note.color} isConnecting={isConnecting}>
      <DragHandle className="drag-handle">
        {note.title || 'Note'}
      </DragHandle>
      
      <TextArea
        value={content}
        onChange={handleContentChange}
        onFocus={() => setIsEditing(true)}
        onBlur={handleBlur}
        placeholder="Type your note here..."
      />
      
      <ButtonContainer>
        <ColorPicker
          type="color"
          value={note.color || '#ffeb3b'}
          onChange={handleColorChange}
        />
        <ConnectButton onClick={() => onConnect(note.id)}>
          {isConnecting ? 'Connecting...' : 'Connect'}
        </ConnectButton>
        <DeleteButton onClick={() => onDelete(note.id)}>
          Delete
        </DeleteButton>
      </ButtonContainer>
    </NoteContainer>
  );
}

export default StickyNote;
