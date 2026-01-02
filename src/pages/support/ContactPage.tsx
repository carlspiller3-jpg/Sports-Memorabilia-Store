import { Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function ContactPage() {
    return (
        <div className="min-h-screen bg-ivory py-12 lg:py-20">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">Contact Us</h1>
                    <p className="text-navy/60">We're here to help with any questions about our collection.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-sm shadow-sm border border-stone/10 space-y-6">
                            <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">Get in Touch</h2>
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center">
                                    <Mail className="w-8 h-8 text-gold" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-charcoal text-lg">Email Us</h3>
                                    <p className="text-navy/60 mb-2">For general inquiries and support</p>
                                    <a href="mailto:support@sportssigned.com" className="text-gold hover:underline font-medium text-lg">support@sportssigned.com</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-sm shadow-sm border border-stone/10">
                        <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">Send a Message</h2>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-navy">First Name</label>
                                    <input type="text" className="w-full border border-stone/20 rounded-sm p-3 focus:border-gold focus:outline-none" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-navy">Last Name</label>
                                    <input type="text" className="w-full border border-stone/20 rounded-sm p-3 focus:border-gold focus:outline-none" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-navy">Email</label>
                                <input type="email" className="w-full border border-stone/20 rounded-sm p-3 focus:border-gold focus:outline-none" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-navy">Subject</label>
                                <select className="w-full border border-stone/20 rounded-sm p-3 focus:border-gold focus:outline-none bg-white">
                                    <option>General Inquiry</option>
                                    <option>Order Status</option>
                                    <option>Authenticity Question</option>
                                    <option>Returns</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-navy">Message</label>
                                <textarea className="w-full border border-stone/20 rounded-sm p-3 focus:border-gold focus:outline-none min-h-[150px]" placeholder="How can we help you?"></textarea>
                            </div>
                            <Button className="w-full gap-2">
                                <Send className="w-4 h-4" />
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
