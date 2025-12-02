"use client";
import React, { useState, useRef, useEffect } from 'react';
import { SmoothCursor } from "@/components/ui/smooth-cursor"


interface CardProps {
    color: string;
    image: string;
    index: number;
    totalCards: number;
    activeIndex: number;
    dragOffset: number;
}

const Card = ({ color, image, index, totalCards, activeIndex, dragOffset }: CardProps) => {

    const getPositionStyle = () => {
        const positions = [
            { x: -55, y: 15, rotate: -15, scale: 0.7, z: 15, opacity: 0.5 },  // Left card
            { x: 0, y: 0, rotate: 0, scale: 1, z: 20, opacity: 1 },           // Center card
            { x: 55, y: 15, rotate: 15, scale: 0.7, z: 15, opacity: 0.5 }     // Right card
        ];

        let relativeIndex = (index - activeIndex + totalCards) % totalCards;

        if (relativeIndex > totalCards / 2) {
            relativeIndex -= totalCards;
        }

        let posStyle;
        if (relativeIndex === -1) {
            posStyle = positions[0];
        } else if (relativeIndex === 0) {
            posStyle = positions[1];
        } else if (relativeIndex === 1) {
            posStyle = positions[2];
        } else {
            posStyle = { x: 0, y: 0, rotate: 0, scale: 0, z: 0, opacity: 0 };
        }

        const adjustedX = posStyle.x + (dragOffset * 0.1);

        return { ...posStyle, x: adjustedX };
    };

    const posStyle = getPositionStyle();

    return (
        <div
            className="absolute transition-all ease-out w-full h-full flex items-center justify-center"
            style={{
                transform: `translateX(${posStyle.x}%) rotate(${posStyle.rotate}deg) scale(${posStyle.scale})`,
                zIndex: posStyle.z,
                opacity: posStyle.opacity,
                pointerEvents: posStyle.z === 20 ? 'auto' : 'none',
                transitionDuration: dragOffset !== 0 ? '0ms' : '700ms'
            }}
        >
            <div
                className="w-full h-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] xl:max-w-[450px] 
                           max-h-80 sm:max-h-[400px] md:max-h-[440px] lg:max-h-[480px] xl:max-h-[520px] 
                           rounded-2xl md:rounded-3xl overflow-hidden select-none shadow-lg"
                style={{
                    background: color,
                }}
            >
                <img
                    src={image}
                    alt="Card Image"
                    className="w-full h-full object-cover"
                    draggable="false"
                />
            </div>
        </div>
    );
};

export default function FeatureSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const dragStartX = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const cards = [
        { image: "/CarbonCut-fe/feature/Card_1.svg" },
        { image: "/CarbonCut-fe/feature/Card_2.svg" },
        { image: "/CarbonCut-fe/feature/Card_3.svg" },
        { image: "/CarbonCut-fe/feature/Card_4.svg" },
    ];

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragStartX.current = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const diff = e.clientX - dragStartX.current;
        requestAnimationFrame(() => {
            setDragOffset(diff);
        });
    };

    const handleMouseUp = () => {
        if (!isDragging) return;

        const threshold = 50;

        if (dragOffset < -threshold) {
            setActiveIndex(prev => (prev + 1) % cards.length);
        } else if (dragOffset > threshold) {
            setActiveIndex(prev => (prev - 1 + cards.length) % cards.length);
        }

        setIsDragging(false);
        setDragOffset(0);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        dragStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;

        const diff = e.touches[0].clientX - dragStartX.current;
        requestAnimationFrame(() => {
            setDragOffset(diff);
        });
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;

        const threshold = 50;

        if (dragOffset < -threshold) {
            setActiveIndex(prev => (prev + 1) % cards.length);
        } else if (dragOffset > threshold) {
            setActiveIndex(prev => (prev - 1 + cards.length) % cards.length);
        }

        setIsDragging(false);
        setDragOffset(0);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        if (isDragging) {
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    return (
        <>
            {isHovering && <SmoothCursor />}

            <div
                ref={containerRef}
                className="w-full min-h-screen lg:min-h-[120vh] bg-[#fcfdf6] flex flex-col justify-center overflow-hidden relative py-8 sm:py-12 md:py-16 lg:py-20"
                onMouseDown={handleMouseDown}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            >
                <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center min-h-full">
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24">
                        <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight text-[#080c04] leading-tight'>
                            Powerful Features for{" "}
                            <br className="hidden sm:block" />
                            <span className="text-[#F0db18]"> Carbon Reduction </span>
                        </h2>
                    </div>

                    {/* Cards Container */}
                    <div className="relative w-full flex-1 flex items-center justify-center min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px] xl:min-h-[600px]">
                        {cards.map((card, index) => (
                            <Card
                                color={''}
                                key={index}
                                {...card}
                                index={index}
                                totalCards={cards.length}
                                activeIndex={activeIndex}
                                dragOffset={dragOffset}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
