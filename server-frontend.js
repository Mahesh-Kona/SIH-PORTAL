import express from 'express';
import path from 'path';
import cors from 'cors'
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Backend URL for API proxy
const BACKEND_URL = process.env.BACKEND_URL || 'https://sih-backend.onrender.com';

console.log(`� Backend URL: ${BACKEND_URL}`);
app.use(cors())

// Middleware to parse JSON requests
app.use(express.json());
// API proxy to backend service
app.use('/api', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // Keep the /api prefix
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: 'Backend connection failed' });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`� Proxying: ${req.method} ${req.path} -> ${BACKEND_URL}${req.path}`);
  }
}));

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SIH Frontend Server is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    backendUrl: BACKEND_URL
  });
});

// Handle SPA routing - send all non-API requests to index.html
app.get('*', (req, res) => {
  // Don't serve index.html for API requests
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SIH Frontend Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Proxy: ${BACKEND_URL}`);
});