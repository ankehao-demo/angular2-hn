import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';

function AppContent() {
    const { settings } = useSettings();

    return (
        <div className={settings.theme}>
            <div className="body-cover">
                <div className="wrapper">
                    <Header />
                    <Routes>
                        <Route path="/" element={<Navigate to="/news/1" replace />} />
                        <Route path="/news/:page" element={<div>Feed placeholder</div>} />
                        <Route path="/newest/:page" element={<div>Feed placeholder</div>} />
                        <Route path="/show/:page" element={<div>Feed placeholder</div>} />
                        <Route path="/ask/:page" element={<div>Feed placeholder</div>} />
                        <Route path="/jobs/:page" element={<div>Feed placeholder</div>} />
                        <Route path="/item/:id" element={<div>Item details placeholder</div>} />
                        <Route path="/user/:id" element={<div>User profile placeholder</div>} />
                    </Routes>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <SettingsProvider>
                <AppContent />
            </SettingsProvider>
        </BrowserRouter>
    );
}

export default App;
