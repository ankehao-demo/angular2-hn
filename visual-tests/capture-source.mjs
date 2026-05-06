import { captureApp } from './capture-app.mjs';

const BASE_URL = process.env.SOURCE_URL || 'http://localhost:4200';
captureApp(BASE_URL, 'source', 'Source (Angular)').catch(console.error);
