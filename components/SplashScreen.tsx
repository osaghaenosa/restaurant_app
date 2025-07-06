
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';

// This SVG creates the subtle wave pattern for the background
const WaveBackground = () => (
    <div className="absolute inset-0 z-0 opacity-50" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3e%3cpath fill='%23D6EAF8' fill-opacity='0.4' d='M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,218.7C960,235,1056,213,1152,192C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3e%3c/path%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
);

// This is the logo that will be revealed
const AppLogo = ({ visible, pulsing, logoUrl, name }: { visible: boolean, pulsing: boolean, logoUrl: string, name: string }) => (
    <div className={`relative transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <img src={logoUrl} alt="App Logo" className={`w-28 h-28 object-contain transition-transform duration-500 ${pulsing ? 'scale-105' : 'scale-100'}`} />
        <div className="absolute -bottom-4 left-0 right-0 h-1 font-bold text-3xl text-center text-[#5DADE2]">{name.split(' ')[0]}</div>
    </div>
);


export const SplashScreen = ({ appSettings }: { appSettings: AppSettings }) => {
    const [progress, setProgress] = useState(0);
    const [animationStep, setAnimationStep] = useState(0); // 0: start, 1: droplet, 2: logo, 3: pulse

    useEffect(() => {
        const timers: ReturnType<typeof setTimeout>[] = [];
        
        timers.push(setTimeout(() => setAnimationStep(1), 100));      // Start droplet animation
        timers.push(setTimeout(() => setAnimationStep(2), 1000));     // Reveal logo
        timers.push(setTimeout(() => setAnimationStep(3), 2000));     // Pulse logo

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval as any);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        timers.push(progressInterval as any);

        return () => {
            timers.forEach(timerId => clearTimeout(timerId));
        };
    }, []);


    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#FFFFFF] relative overflow-hidden">
            <WaveBackground />
            <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
                {/* Animation Container */}
                <div className="w-40 h-40 flex items-center justify-center">
                    {/* Water Droplet falling */}
                     <div className={`absolute w-8 h-8 bg-[#5DADE2] rounded-full transition-all duration-700 ease-in ${animationStep >= 1 ? 'top-1/2 -translate-y-1/2 opacity-0' : 'top-0 opacity-100'}`} style={{ clipPath: 'path("M12 0 C6 0 0 6 0 12 C0 18 12 30 12 30 S24 18 24 12 C24 6 18 0 12 0 Z")' }} />
                    
                    {/* Ripple Effect -> becomes Logo */}
                    <div className={`absolute w-2 h-2 rounded-full bg-[#5DADE2] transition-all duration-1000 ${animationStep >= 1 ? 'scale-[20] opacity-0' : 'scale-0'}`}></div>
                    
                    {/* The Logo */}
                    <AppLogo visible={animationStep >= 2} pulsing={animationStep === 3} logoUrl={appSettings.appLogoUrl} name={appSettings.appName}/>
                </div>

                {/* Loading Text */}
                <p className="text-lg text-[#666666] z-10">Preparing your experience...</p>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-4/5 max-w-sm h-2 bg-[#D6EAF8] rounded-full overflow-hidden z-10">
                <div 
                    className="h-full bg-gradient-to-r from-[#5DADE2] to-[#2874A6] rounded-full transition-all duration-300 ease-linear" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};
