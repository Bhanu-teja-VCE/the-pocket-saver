import React, { useState, useEffect } from 'react';
import { SystemProvider } from './context/SystemContext';
import { Dashboard } from './pages/Dashboard';
import { MobileHud } from './pages/MobileHud';
import { Monitor, Smartphone, Settings } from 'lucide-react';

const App: React.FC = () => {
  // Simple check for mobile viewport width to determine default view
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Automatically switch if user resizes heavily, but respect manual toggles
      if (window.innerWidth < 768) setIsMobileView(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SystemProvider>
      <div className="h-screen w-screen bg-nexus-950 text-gray-200 overflow-hidden flex flex-col">
        {/* Top Bar (Visible only when interaction is needed or desktop) */}
        {!isMobileView && (
            <header className="h-12 border-b border-gray-800 flex items-center justify-between px-6 bg-black">
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-nexus-green rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                <span className="font-mono font-bold tracking-widest text-sm text-gray-400">NEXUS v1.0</span>
            </div>
            <div className="flex items-center space-x-4">
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
      </div>
    </SystemProvider>
  );
};

export default App;