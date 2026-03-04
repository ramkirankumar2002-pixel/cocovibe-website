import { motion, type Variants } from 'framer-motion';
import { Droplet, Leaf, ShieldCheck } from 'lucide-react';

export default function About() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const features = [
        {
            icon: <Droplet size={36} className="text-accent drop-shadow-sm" />,
            title: "100% Pure Hydration",
            desc: "Sourced directly from young, green coconuts for maximum hydration and naturally occurring electrolytes."
        },
        {
            icon: <Leaf size={36} className="text-primary drop-shadow-sm" />,
            title: "Ethically Harvested",
            desc: "Our coconuts are hand-picked from sustainable farms ensuring fair trade and zero environmental harm."
        },
        {
            icon: <ShieldCheck size={36} className="text-primary drop-shadow-sm" />,
            title: "No Added Sugar",
            desc: "We believe in nature's recipe. Zero preservatives, zero artificial flavors, just pure coconut water."
        }
    ];

    return (
        <section id="about" className="py-32 relative overflow-hidden bg-white">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl font-black mb-6 text-charcoal tracking-tight">
                        Nature's Perfect <br /><span className="text-primary">Refreshment</span>
                    </motion.h2>
                    <motion.div variants={itemVariants} className="w-24 h-1 bg-accent mx-auto mb-8 rounded-full" />
                    <motion.p variants={itemVariants} className="text-xl text-charcoal/70 leading-relaxed font-light">
                        Welcome to the future of hydration. CocoVibe brings the tropical freshness of the islands directly to your daily routine. Every sip is a step towards better health and renewed energy.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="grid md:grid-cols-3 gap-8 lg:gap-12"
                >
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ y: -15, scale: 1.02 }}
                            className="glass p-10 rounded-[2rem] text-center flex flex-col items-center hover:shadow-2xl transition-all duration-300 border border-white/60 bg-white/40"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-beige flex items-center justify-center mb-8 shadow-sm border border-white">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-charcoal mb-4">{feature.title}</h3>
                            <p className="text-charcoal/70 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
