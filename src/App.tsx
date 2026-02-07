import { useState, useEffect } from 'react';
import { Scene } from '@/components/three/Scene';
import { 
  TopBar, 
  BottomBar, 
  AgentBanner,
  LoadingScreen,
} from '@/components/ui-custom';
import { useAppStore } from '@/store/appStore';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { cn } from '@/lib/utils';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { 
    highContrast, 
    bannerOpen, 
    bannerAgentId, 
    closeBanner,
    setBannerPanel,
  } = useAppStore();

  // Initialize session timer
  useSessionTimer();

  // Handle loading completion
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && ['1', '2', '3'].includes(e.key)) {
        e.preventDefault();
        const panels = ['metrics', 'chat', 'summary'] as const;
        const panelIndex = parseInt(e.key) - 1;
        if (panels[panelIndex]) {
          setBannerPanel(panels[panelIndex]);
        }
      }
      if (e.key === 'Escape' && bannerOpen) {
        closeBanner();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bannerOpen, closeBanner, setBannerPanel]);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <div 
      className={cn(
        'relative w-screen h-screen overflow-hidden',
        highContrast && 'high-contrast'
      )}
      style={{
        background: highContrast 
          ? '#000000' 
          : 'linear-gradient(180deg, #0A0E17 0%, #0D1320 100%)',
      }}
    >
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <Scene className="absolute inset-0" />

      {!isLoading && (
        <>
          <TopBar />
          <BottomBar />
          {bannerOpen && bannerAgentId && (
            <AgentBanner 
              agentId={bannerAgentId} 
              onClose={closeBanner} 
            />
          )}
        </>
      )}

      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 14, 23, 0.3) 100%)',
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 150px rgba(0, 0, 0, 0.5)',
        }}
      />
    </div>
  );
}

export default App;
