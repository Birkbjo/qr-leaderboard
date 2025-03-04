import { useEffect, useState } from 'react';

interface CoinAnimationProps {
    onComplete: () => void;
}

export function CoinAnimation({ onComplete }: CoinAnimationProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onComplete();
        }, 1000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className={`absolute inset-0 flex items-center justify-center ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            <div className="animate-spin-slow">
                <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-yellow-500 shadow-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-700">$</span>
                </div>
            </div>
        </div>
    );
} 