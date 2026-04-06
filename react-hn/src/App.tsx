import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<div>Phase 1 scaffold complete. UI coming in Phase 2.</div>} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default App;
