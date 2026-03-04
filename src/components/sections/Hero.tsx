import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const imageModules = import.meta.glob('/public/cocovibe/*.png', { eager: true, as: 'url' }) as Record<string, string>;
const imageUrls = Object.keys(imageModules).sort().map(key => imageModules[key]);

export default function Hero() {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);

    useEffect(() => {
        let loadedCount = 0;
        const images: HTMLImageElement[] = [];

        if (imageUrls.length === 0) {
            setImagesLoaded(true);
            return;
        }

        imageUrls.forEach((url, i) => {
            const img = new Image();
            img.src = url.replace('/public', '');
            img.onload = () => {
                loadedCount++;
                if (loadedCount === imageUrls.length) setImagesLoaded(true);
            };
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === imageUrls.length) setImagesLoaded(true);
            };
            images[i] = img;
        });

        imagesRef.current = images;
    }, []);

    useEffect(() => {
        if (!imagesLoaded || !canvasRef.current || imagesRef.current.length === 0) return;

        let animationFrameId: number;
        let frameIndex = 0;
        let lastDrawTime = performance.now();
        const fps = 24;
        const interval = 1000 / fps;

        const render = (time: number) => {
            animationFrameId = requestAnimationFrame(render);
            const deltaTime = time - lastDrawTime;

            if (deltaTime > interval) {
                lastDrawTime = time - (deltaTime % interval);

                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const img = imagesRef.current[frameIndex];
                if (!img || !img.width) return;

                const canvasRatio = canvas.width / canvas.height;
                const imgRatio = img.width / img.height;
                let drawWidth, drawHeight, offsetX, offsetY;

                if (canvasRatio > imgRatio) {
                    drawWidth = canvas.width;
                    drawHeight = canvas.width / imgRatio;
                    offsetX = 0;
                    offsetY = (canvas.height - drawHeight) / 2;
                } else {
                    drawWidth = canvas.height * imgRatio;
                    drawHeight = canvas.height;
                    offsetX = (canvas.width - drawWidth) / 2;
                    offsetY = 0;
                }

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

                frameIndex = (frameIndex + 1) % imagesRef.current.length;
                setCurrentFrame(frameIndex);
            }
        };

        animationFrameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationFrameId);
    }, [imagesLoaded]);

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;

                if (imagesLoaded && imagesRef.current.length > 0) {
                    const ctx = canvasRef.current.getContext('2d');
                    const img = imagesRef.current[currentFrame];
                    if (ctx && img && img.width) {
                        const canvasRatio = canvasRef.current.width / canvasRef.current.height;
                        const imgRatio = img.width / img.height;
                        let drawWidth, drawHeight, offsetX, offsetY;

                        if (canvasRatio > imgRatio) {
                            drawWidth = canvasRef.current.width;
                            drawHeight = canvasRef.current.width / imgRatio;
                            offsetX = 0;
                            offsetY = (canvasRef.current.height - drawHeight) / 2;
                        } else {
                            drawWidth = canvasRef.current.height * imgRatio;
                            drawHeight = canvasRef.current.height;
                            offsetX = (canvasRef.current.width - drawWidth) / 2;
                            offsetY = 0;
                        }
                        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                    }
                }
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [imagesLoaded, currentFrame]);

    return (
        <section id="hero" className="relative h-screen w-full overflow-hidden bg-[#222] flex items-center justify-center">
            <div className="absolute inset-0 z-0">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover origin-center"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#111111]/90 via-[#111111]/50 to-transparent z-10 pointer-events-none" />
            </div>

            {!imagesLoaded && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#111]">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-30 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-20"
            >
                <div className="mb-4 inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm pointer-events-none">
                    <span className="text-accent text-sm font-semibold tracking-widest uppercase">100% Organic Coconut Water</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight leading-tight">
                    Pure. Fresh. <br />
                    <span className="text-accent">Natural.</span>
                </h1>

                <p className="text-xl md:text-2xl text-white/90 mb-10 font-light max-w-2xl">
                    Experience the finest tropical essence in every drop of CocoVibe.
                    Unleash nature's premium hydration.
                </p>

                <button
                    onClick={() => document.getElementById('flavours')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-10 py-4 bg-primary text-white text-lg font-bold rounded-full hover:bg-primary-light transition-colors flex items-center gap-2"
                >
                    Taste the Tropics
                </button>
            </motion.div>
        </section>
    );
}
