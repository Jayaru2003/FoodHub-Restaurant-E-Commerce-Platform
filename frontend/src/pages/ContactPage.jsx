import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    // Simulate contact form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      subject: 'General Inquiry',
      message: '',
    });
    setIsSubmitted(false);
    setErrorMsg('');
  };

  const CONTACT_INFO = [
    {
      icon: '📍',
      title: 'Our Location',
      details: '123 Gourmet Avenue, Suite 400',
      subDetail: 'Food City, FC 90210',
    },
    {
      icon: '📞',
      title: 'Phone Support',
      details: '+1 (800) 555-FOOD',
      subDetail: '+1 (800) 555-3663',
    },
    {
      icon: '✉️',
      title: 'Email Address',
      details: 'support@foodhub.com',
      subDetail: 'inquiries@foodhub.com',
    },
    {
      icon: '⏰',
      title: 'Operating Hours',
      details: 'Mon - Sun: 8:00 AM - 11:00 PM',
      subDetail: 'Kitchen open 365 days a year',
    },
  ];

  const FAQS = [
    {
      q: 'How fast is FoodHub delivery?',
      a: 'We average under 30 minutes from kitchen preparation to doorstep delivery. All orders are packed in temperature-guarded containers.',
    },
    {
      q: 'Can I track my live order status?',
      a: 'Yes! Once your order is placed, you can monitor kitchen preparation and driver delivery status in real-time under your account dashboard.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Credit/Debit cards (Visa, MasterCard, American Express), Apple Pay, Google Pay, and Cash on Delivery (COD).',
    },
    {
      q: 'How can I submit special dietary instructions?',
      a: 'During checkout, you can specify custom prep notes (e.g. extra spicy, gluten-sensitive, no onions) directly to our kitchen team.',
    },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">

        {/* ── 1. Hero Section ────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
            <span className="h-2 w-2 rounded-full bg-brand-600 animate-pulse" /> We're Here For You
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
            Get in Touch with FoodHub
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Have questions about an order, restaurant partnership inquiries, or feedback on your meal? Reach out and our dedicated support team will assist you promptly.
          </p>
        </div>

        {/* ── 2. Contact Info Cards ───────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONTACT_INFO.map((item, i) => (
            <div key={i} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-1">
              <div className="h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center text-2xl mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="text-sm font-semibold text-slate-700 mt-2">{item.details}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.subDetail}</p>
            </div>
          ))}
        </div>

        {/* ── 3. Contact Form & Map/Info Section ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Form */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-100 bg-white p-8 sm:p-10 shadow-soft">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Send Us a Message</h2>
              <p className="text-sm text-slate-500 mt-1">
                Fill out the form below and we will respond within 24 hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center space-y-4">
                <span className="text-5xl">🎉</span>
                <h3 className="text-xl font-bold text-emerald-900">Thank You!</h3>
                <p className="text-sm text-emerald-700 max-w-md mx-auto">
                  Your message has been sent successfully. Our support team will review your inquiry and contact you at <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-emerald-700 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm font-semibold text-red-700">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Sarah Jenkins"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="sarah@example.com"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Inquiry Subject
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Status / Issue">Order Status / Issue</option>
                    <option value="Restaurant Partnership">Restaurant Partnership</option>
                    <option value="Catering & Events">Catering & Events</option>
                    <option value="Feedback / Suggestions">Feedback / Suggestions</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-brand-700 transition disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message ✉️'}
                </button>
              </form>
            )}
          </div>

          {/* Side Banner & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-slate-900 text-white p-8 shadow-soft space-y-6">
              <span className="inline-block rounded-full bg-brand-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-400">
                Customer Care Guarantee
              </span>
              <h3 className="text-2xl font-bold">Fast & Friendly Support, Always.</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Whether you need assistance with an ongoing order, have special dietary requests, or want to discuss catering for a large event, our team is standing by to help.
              </p>
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span> Real human support (no automated bots)
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span> 100% resolution guarantee on all orders
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span> Average response time under 15 minutes
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-brand-100 bg-brand-50/60 p-6 space-y-3 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Looking to order food now?</p>
              <h4 className="text-lg font-bold text-slate-900">Explore Our Full Menu</h4>
              <Link
                to="/products"
                className="inline-block rounded-full bg-brand-600 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-700 transition"
              >
                Browse Menu →
              </Link>
            </div>
          </div>

        </div>

        {/* ── 4. Frequently Asked Questions ──────────────────── */}
        <div className="space-y-8 pt-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-bold uppercase tracking-widest text-brand-600 text-xs">Got Questions?</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 flex items-start gap-2">
                  <span className="text-brand-600 font-black">Q:</span> {faq.q}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-2 pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
