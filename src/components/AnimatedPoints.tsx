"use client"

import { useEffect, useState } from 'react';
import { CoinAnimation } from './CoinAnimation';

interface AnimatedPointsProps {
    points: number;
    className?: string;
    animateOnMount?: boolean;
    plus?: boolean;
}

export function AnimatedPoints({ points, className = '', animateOnMount = false, plus = false }: AnimatedPointsProps) {
    const [displayPoints, setDisplayPoints] = useState(points);
    const [showAnimation, setShowAnimation] = useState(animateOnMount);

    useEffect(() => {
        if (points !== displayPoints) {
            setShowAnimation(true);
            setDisplayPoints(points);
        }
    }, [points, displayPoints]);

    return (
        <div className={`relative ${className}`}>
            {showAnimation && (
                <CoinAnimation
                    onComplete={() => setShowAnimation(false)}
                />
            )}
            <span className={`${!showAnimation ? '' : 'animate-pulse'}`}>
                {plus ? '+' : ''}{displayPoints}
            </span>
        </div>
    );
} 