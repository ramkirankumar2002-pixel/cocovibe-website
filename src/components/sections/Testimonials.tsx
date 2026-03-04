import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Sarah Jenkins",
        role: "Fitness Coach",
        text: "CocoVibe is my go-to post-workout drink. The clean ingredients and absolute lack of artificial sweeteners make it the perfect recovery hydration.",
    },
    {
        name: "Michael Chen",
        role: "Wellness Blogger",
        text: "I've tasted dozens of coconut waters, but nothing comes close to this. It genuinely tastes like it was just cracked open on a beach.",
    },
    {
        name: "Emma Roberts",
        role: "Yoga Instructor",
        text: "The Mango Tango flavor is an absolute revelation. So refreshing, light, and perfectly balanced. I buy it by the case now!",
    }
];

export default function Testimonials() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="testimonials" className="py-32 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-black text-charcoal tracking-tight mb-6">
                        Loved by <span className="text-primary">Many</span>
                    </h2>
                    <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
                </div>

                <div className="max-w-4xl mx-auto relative h-[400px] md:h-[300px] flex items-center justify-center">
                    <Quote className="absolute top-0 left-4 text-beige-dark w-40 h-40 -z-10 opacity-60" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="text-center px-4 md:px-16 w-full"
                        >
                            <div className="flex justify-center mb-8">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="text-yellow-400 fill-yellow-400 w-7 h-7 mx-1 drop-shadow-sm" />
                                ))}
                            </div>
                            <p className="text-2xl md:text-4xl font-medium text-charcoal leading-relaxed mb-10 italic">
                                "{testimonials[current].text}"
                            </p>
                            <h4 className="text-2xl font-bold text-charcoal">{testimonials[current].name}</h4>
                            <p className="text-primary font-medium tracking-wide uppercase text-sm mt-2">{testimonials[current].role}</p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-3">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className={`w-3 h-3 rounded-full transition-all duration-500 ${idx === current ? 'bg-primary w-10' : 'bg-gray-200 hover:bg-accent'
                                    }`}
                                aria-label={`Go to testimonial ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Decorative Blur */}
            <div className="absolute top-1/2 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        </section>
    );
}
