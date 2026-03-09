import { SettingsProvider, useSettings } from './context/SettingsContext';

function AppContent() {
  const { settings } = useSettings();
  return (
    <div className={settings.theme}>
      <div className="body-cover"></div>
      <div className="wrapper">
        <h1>Angular2-HN React Migration</h1>
        <p>Phase 1 complete. Theme: {settings.theme}</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;
