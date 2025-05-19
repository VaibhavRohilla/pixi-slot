import { app } from './core/App';

// Initialize the application
app.init().catch(error => {
  console.error('Failed to initialize application:', error);
});
