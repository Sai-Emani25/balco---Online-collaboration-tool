# 🎨 Balco

A real-time collaborative workspace where multiple users can create sticky notes, manage tasks, and collaborate on projects with instant synchronization using WebSockets.

## ✨ Features

- **Real-time Collaboration**: Instant synchronization across all users in a room
- **Digital Sticky Notes**: Create, edit, move, and customize colorful sticky notes
- **Visual Connections**: Draw connections between notes to show relationships
- **Share Links**: Easily share room links to invite collaborators
- **Drag & Drop Interface**: Intuitive canvas-based interface for organizing ideas
- **Color Customization**: Choose from multiple colors for your sticky notes
- **Project Management**: Organize tasks and ideas visually

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd "balco - Online collaboration tool"
```

2. Install all dependencies:
```bash
npm run install-all
```

This will install dependencies for:
- Root project
- Server (backend)
- Client (frontend)

### Running the Application

Start both the server and client concurrently:
```bash
npm run dev
```

Or run them separately:

**Server (Backend)**:
```bash
npm run server
```

**Client (Frontend)**:
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📁 Project Structure

```
balco - Online collaboration tool/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Canvas.js  # Main collaborative canvas
│   │   │   ├── StickyNote.js
│   │   │   ├── Toolbar.js
│   │   │   └── ShareLink.js
│   │   ├── pages/         # Page components
│   │   │   ├── Home.js
│   │   │   └── Room.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Socket.io server
│   ├── .env.example       # Environment variables template
│   └── package.json
├── .github/
│   └── copilot-instructions.md
├── package.json           # Root package with scripts
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React**: UI framework
- **Socket.io Client**: Real-time WebSocket communication
- **React Router**: Navigation
- **Styled Components**: CSS-in-JS styling
- **React Draggable**: Drag and drop functionality

### Backend
- **Node.js**: Runtime environment
- **Express**: Web server framework
- **Socket.io**: WebSocket library for real-time communication
- **CORS**: Cross-origin resource sharing

## 🎯 How to Use

1. **Create a Room**: Click "Create New Room" on the home page
2. **Share the Link**: Copy the room link from the header and share with collaborators
3. **Add Sticky Notes**: Click the "➕ Add Sticky Note" button
4. **Customize Notes**: 
   - Type content directly in the note
   - Change colors using the color picker
   - Drag notes around the canvas
5. **Connect Notes**: Click "Connect" on one note, then click "Connect" on another to create a visual connection
6. **Delete**: Remove notes or connections as needed

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory (use `.env.example` as template):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/balco
```

**Note**: MongoDB is optional for the initial setup. The app uses in-memory storage by default.

## 🌐 Deployment

### Building for Production

Build the client:
```bash
npm run build
```

The production-ready files will be in `client/build/`.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📝 Future Enhancements

- [ ] User authentication
- [ ] Persistent storage with MongoDB
- [ ] Rich text editing in notes
- [ ] File attachments
- [ ] Chat functionality
- [ ] Templates for common workflows
- [ ] Export/import projects
- [ ] Mobile app version

## 📄 License

MIT License - feel free to use this project for your own purposes!

## 🙏 Acknowledgments

Built with modern web technologies to enable seamless remote collaboration.

---

**Happy Collaborating! 🎉**
