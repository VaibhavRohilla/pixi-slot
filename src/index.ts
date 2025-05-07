import { app } from './App';

// Initialize the application
app.init().catch(error => {
  console.error('Failed to initialize application:', error);
});
