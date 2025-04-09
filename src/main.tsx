
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Clean mount of the application with no redirects
createRoot(document.getElementById("root")!).render(<App />);
