import { initializeDatabase } from './schema';

// Initialize the database on startup
export async function initializeApp() {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Explicitly call the function to initialize when loaded
initializeApp(); 