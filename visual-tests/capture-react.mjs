import { captureApp } from './capture-app.mjs';

const BASE_URL = process.env.REACT_URL || 'http://localhost:5173';
captureApp(BASE_URL, 'react', 'React').catch(console.error);
