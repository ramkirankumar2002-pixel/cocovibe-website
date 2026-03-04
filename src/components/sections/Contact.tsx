import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setIsSuccess(false), 5000);
        }, 1500);
    };

    return (
        <section id="contact" className="py-32 bg-beige relative overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Map & Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full h-[500px] lg:h-[600px] bg-white rounded-[3rem] shadow-2xl overflow-hidden relative border-[4px] border-white flex flex-col"
                    >
                        <iframe
                            src="https://maps.google.com/maps?q=chennai&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            className="w-full h-full object-cover"
                            style={{ border: 0, minHeight: '300px' }}
                            loading="lazy"
                            allowFullScreen
                        ></iframe>

                        {/* Contact Information Overlay */}
                        <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50">
                            <h3 className="text-xl font-bold text-charcoal mb-4 tracking-tight">Contact Information</h3>
                            <div className="space-y-3 text-charcoal/80 font-medium text-sm">
                                <p><span className="text-primary font-bold">Address:</span> Chennai, Tamil Nadu, India</p>
                                <p><span className="text-primary font-bold">Email:</span> ramkiran@gmail.com</p>
                                <p><span className="text-primary font-bold">Phone:</span> 88888888888</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-xl w-full mx-auto"
                    >
                        <h2 className="text-5xl md:text-6xl font-black text-charcoal mb-6 tracking-tight">
                            Get in <span className="text-primary">Touch</span>
                        </h2>
                        <p className="text-charcoal/70 mb-12 font-light text-xl leading-relaxed">
                            Have a question about our products, or just want to say hi? Drop us a message below.
                        </p>

                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="relative group">
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-transparent border-b-2 border-gray-300 py-3 px-2 text-charcoal text-lg focus:outline-none focus:border-primary transition-colors peer placeholder-transparent"
                                    placeholder="Your Name"
                                />
                                <label
                                    htmlFor="name"
                                    className="absolute left-2 top-3 text-gray-500 transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-focus:font-bold peer-placeholder-shown:top-3 peer-placeholder-shown:text-lg cursor-text"
                                >
                                    Your Name
                                </label>
                            </div>

                            <div className="relative group">
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-transparent border-b-2 border-gray-300 py-3 px-2 text-charcoal text-lg focus:outline-none focus:border-primary transition-colors peer placeholder-transparent"
                                    placeholder="Email Address"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-2 top-3 text-gray-500 transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-focus:font-bold peer-placeholder-shown:top-3 peer-placeholder-shown:text-lg cursor-text"
                                >
                                    Email Address
                                </label>
                            </div>

                            <div className="relative group pt-4">
                                <textarea
                                    id="message"
                                    rows={4}
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-transparent border-b-2 border-gray-300 py-3 px-2 text-charcoal text-lg focus:outline-none focus:border-primary transition-colors peer resize-none placeholder-transparent"
                                    placeholder="Your Message"
                                ></textarea>
                                <label
                                    htmlFor="message"
                                    className="absolute left-2 top-7 text-gray-500 transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-focus:font-bold peer-placeholder-shown:top-7 peer-placeholder-shown:text-lg cursor-text"
                                >
                                    Your Message
                                </label>
                            </div>

                            {isSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-primary/10 text-primary font-medium rounded-lg border border-primary/20 text-center"
                                >
                                    Thank you for contacting CocoVibe. We will get back to you soon.
                                </motion.div>
                            )}

                            <button
                                disabled={isSubmitting}
                                className="w-full py-5 bg-charcoal text-white text-lg font-bold rounded-full mt-10 hover:bg-primary transition-colors duration-300 shadow-xl hover:shadow-[0_10px_30px_rgba(46,125,50,0.4)] hover:-translate-y-1 flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Send Message'}
                            </button>
                        </form>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
