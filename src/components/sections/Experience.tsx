import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

export default function Experience() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);
    const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);

    const [particles] = useState(() => {
        return Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            duration: Math.random() * 2 + 1.5,
            delay: Math.random() * 2,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`
        }));
    });

    return (
        <section ref={containerRef} id="experience" className="py-40 relative overflow-hidden bg-charcoal text-white min-h-[120vh] flex items-center">
            {/* Parallax Background using one of the hero frames as fallback */}
            <motion.div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    y: y1,
                    backgroundImage: 'url(/cocovibe/Coconut_sliced_open_slow_motion_5a11cb956c_050.png)',
                    opacity: 0.3
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal" />

            {/* Particle Sparkles */}
            <div className="absolute inset-0 z-10 opacity-40">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Infinity,
                            delay: particle.delay,
                            ease: "easeInOut"
                        }}
                        className="absolute w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_15px_rgba(165,214,167,0.9)]"
                        style={{
                            top: particle.top,
                            left: particle.left
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-20">
                <motion.div
                    style={{ scale, opacity }}
                    className="max-w-5xl mx-auto text-center glass-dark p-12 md:p-24 rounded-[3rem] border-white/20"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">
                            More Than A Drink.<br />
                            An <span className="text-accent text-glow">Experience.</span>
                        </h2>
                        <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed max-w-3xl mx-auto mb-10">
                            From the moment you break the seal, you are transported to a sun-drenched beach. The subtle aroma, the pristine clarity, the unmatched taste.
                        </p>
                        <button className="px-12 py-5 bg-white text-charcoal text-lg font-bold rounded-full hover:bg-accent transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(165,214,167,0.4)]">
                            Immerse Yourself
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
