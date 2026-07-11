import React, { useState, useEffect } from 'react';
import { SystemProvider } from './context/SystemContext';
import { Dashboard } from './pages/Dashboard';
import { MobileHud } from './pages/MobileHud';
import { Monitor, Smartphone, Settings } from 'lucide-react';

const App: React.FC = () => {
  // Simple check for mobile viewport width to determine default view
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(localStorage.getItem("GEMINI_API_KEY") || "");

  useEffect(() => {
    const handleResize = () => {
      // Automatically switch if user resizes heavily, but respect manual toggles
      if (window.innerWidth < 768) setIsMobileView(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openSettings = () => {
    setTempApiKey(localStorage.getItem("GEMINI_API_KEY") || "");
    setShowSettings(true);
  };

  return (
    <SystemProvider>
      <div className="h-screen w-screen bg-nexus-950 text-gray-200 overflow-hidden flex flex-col relative">
        {/* Top Bar (Visible only when interaction is needed or desktop) */}
        {!isMobileView && (
            <header className="h-12 border-b border-gray-800 flex items-center justify-between px-6 bg-black">
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-nexus-green rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                <span className="font-mono font-bold tracking-widest text-sm text-gray-400">NEXUS v1.0</span>
            </div>
            <div class="flex items-center space-x-4">
                <button 
                onClick={() => setIsMobileView(true)}
                className="flex items-center space-x-2 text-xs font-mono text-gray-500 hover:text-white transition-colors"
                >
                <Smartphone className="w-4 h-4" />
                <span>SWITCH TO HUD</span>
                </button>
            </div>
            </header>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-hidden relative">
            {isMobileView ? <MobileHud /> : <Dashboard />}
            
            {/* Mobile View Toggle Back Button (Floating) */}
            {isMobileView && (
            <button 
                onClick={() => setIsMobileView(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur border border-gray-700 rounded-full text-gray-500 hover:text-white z-50 hidden md:block"
            >
                <Monitor className="w-4 h-4" />
            </button>
            )}
        </main>

        {/* Floating Settings Button */}
        <button 
          onClick={openSettings}
          className="absolute bottom-4 left-4 p-3 bg-black/60 border border-gray-800 rounded-full text-gray-400 hover:text-white hover:border-gray-600 transition-all z-40 shadow-lg"
          title="System Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-nexus-900 border border-gray-800 p-6 rounded-lg max-w-md w-full space-y-4 font-mono text-sm">
              <h3 className="text-nexus-green font-bold uppercase tracking-widest flex items-center gap-2">
                <Settings className="w-4 h-4" />
                NEXUS System Settings
              </h3>
              
              <div className="space-y-2">
                <label className="block text-xs text-gray-400">GEMINI_API_KEY</label>
                <input 
                  type="password" 
                  placeholder="Enter Gemini API key..." 
                  value={tempApiKey} 
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="w-full bg-black border border-gray-700 rounded p-2 text-xs text-white focus:outline-none focus:border-nexus-green font-mono"
                />
                <p className="text-[10px] text-gray-500">
                  Stored securely in your local browser storage. Get a free key at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" class="text-nexus-green hover:underline">Google AI Studio</a>.
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-800">
                <button 
                  onClick={() => {
                    localStorage.removeItem("GEMINI_API_KEY");
                    setTempApiKey("");
                    setShowSettings(false);
                    window.location.reload();
                  }} 
                  className="px-3 py-1.5 border border-nexus-red/30 text-nexus-red text-xs rounded hover:bg-nexus-red/10 transition-colors"
                >
                  Clear Key
                </button>
                <button 
                  onClick={() => {
                    if (tempApiKey.trim()) {
                      localStorage.setItem("GEMINI_API_KEY", tempApiKey.trim());
                    } else {
                      localStorage.removeItem("GEMINI_API_KEY");
                    }
                    setShowSettings(false);
                    window.location.reload();
                  }} 
                  className="px-4 py-1.5 bg-nexus-green text-black font-bold text-xs rounded hover:opacity-90 transition-opacity"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SystemProvider>
  );
};

export default App;