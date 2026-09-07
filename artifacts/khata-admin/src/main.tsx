// import { createRoot } from 'react-dom/client';

// import App from './App';

// import './index.css';

// createRoot(document.getElementById('root')!).render(<App />);
import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@workspace/api-client-react';

import App from './App';

import './index.css';

<<<<<<< HEAD
setBaseUrl(import.meta.env.VITE_API_URL || 'http://localhost:3000');
=======
setBaseUrl('https://khata-pro.onrender.com');
>>>>>>> dd520935df100fa787865484198a4572cead7812

createRoot(document.getElementById('root')!).render(<App />);