#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Main server startup function
async function startServer() {
  try {
    // Import the compiled server classes
    const { A11yChecklistServer } = await import('../dist/server.cjs');

    // Create Express app
    const app = express();
    const port = process.env.A11Y_SERVER_PORT || 3001;

    // Middleware
    app.use(cors({
      origin: ['http://localhost:6006', 'http://localhost:3000'], // Storybook and potential dev servers
      credentials: true
    }));
    app.use(express.json());

    // Create server instance
    const projectRoot = process.cwd();
    const a11yServer = new A11yChecklistServer({ 
      projectRoot,
      checklistDir: path.join(projectRoot, '.storybook', 'a11y-checklists')
    });

    // Setup API routes
    const router = express.Router();
    a11yServer.setupRoutes(router);
    app.use('/api', router);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', service: 'a11y-checklist-server' });
    });

    // Start server
    app.listen(port, () => {
      console.log(`🌟 A11Y Checklist Server running on port ${port}`);
      console.log(`   Health check: http://localhost:${port}/health`);
      console.log(`   API endpoint: http://localhost:${port}/api/a11y-checklist/:storyId`);
      console.log(`   Project root: ${projectRoot}`);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n👋 Shutting down A11Y Checklist Server...');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start A11Y Checklist Server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();