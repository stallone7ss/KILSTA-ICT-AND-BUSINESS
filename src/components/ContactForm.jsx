import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  RotateCcw,
  ShieldCheck,
  Server,
  Building,
  User,
  MessageSquare,
  Facebook,
  Linkedin,
  Youtube,
  Share2,
  ExternalLink
} from 'lucide-react';
import { useLeadSubmission } from '../hooks/useLeadSubmission';

const SERVICE_OPTIONS = [
  'General Corporate Consultation',
  'Company Profile Writing',
  'IPA Registration Assistance',
  'IRC TIN Application & Compliance',
  'Project Proposals & Feasibility Studies',
  'Administration & Basic Bookkeeping Training',
  'Starlink Satellite Kit Installation',
  'Networking Setup & Maintenance',
  'Database Architecture & Development',
  'Web Design & Corporate Portals',
  'Technical Software Workshop'
];

export default function ContactForm({ preselectedService, onResetPreselected }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    service_category: preselectedService || 'General Corporate Consultation',
    message: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const { submitLead, isSubmitting, error, result, reset } = useLeadSubmission();

  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({
        ...prev,
        service_category: preselectedService
      }));
    }
  }, [preselectedService]);

  const validate = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Full name is required (min 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'A valid corporate or personal email address is required.';
    }
    if (!formData.service_category) {
      errors.service_category = 'Please select a service category.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Please provide details on your project or inquiry (min 10 characters).';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await submitLead(formData);
  };

  const handleResetForm = () => {
    reset();
    setFormData({
      name: '',
      email: '',
      phone: '',
      organization: '',
      service_category: 'General Corporate Consultation',
      message: ''
    });
    setValidationErrors({});
    if (onResetPreselected) onResetPreselected();
  };

  return (
    <section id="contact" className="py-20 bg-slate-50/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 tracking-wider uppercase mb-2">
            <Mail className="w-4 h-4 text-orange-500" />
            Direct Engagement Portal
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            Lead Intake &amp; Project Inquiries
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Submit your statutory compliance needs or ICT infrastructure requirements. Inquiries are processed directly through our secure Supabase database pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Physical Routing & Direct Contacts */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Channels Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span>Corporate Routing Desk</span>
              </h3>

              <div className="space-y-6">
                
                {/* Physical Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-orange-200 flex items-center justify-center shrink-0 mt-0.5 bg-orange-50">
                    <img 
                      src="/assets/aistudio/image_56d8a76b.png" 
                      alt="Milne Bay Province Flag" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Physical Headquarters
                    </span>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5 leading-snug">
                      Gumini Village, Huhu LLG
                    </p>
                    <p className="text-xs text-slate-600">
                      Alotau District, Milne Bay Province
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Papua New Guinea (PNG)
                    </p>
                  </div>
                </div>

                {/* Direct Dialing */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Direct Dialing &amp; WhatsApp
                    </span>
                    <a 
                      href="tel:+67582545274" 
                      className="text-base font-bold text-slate-900 hover:text-orange-600 transition-colors inline-block mt-0.5 tracking-wide"
                    >
                      +675 82545274
                    </a>
                    <p className="text-xs text-slate-500">
                      Monday – Saturday, 8:00 AM – 5:00 PM (PGT)
                    </p>
                  </div>
                </div>

                {/* Official Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Official Communications
                    </span>
                    <a 
                      href="mailto:kilsta2023@gmail.com" 
                      className="text-sm font-semibold text-slate-900 hover:text-orange-600 transition-colors inline-block mt-0.5"
                    >
                      kilsta2023@gmail.com
                    </a>
                    <p className="text-xs text-slate-500">
                      Formal project proposals &amp; tender correspondence
                    </p>
                  </div>
                </div>

                {/* Social Networks Channel */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Connect on Social Media
                    </span>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <a
                        href="https://www.facebook.com/profile.php?id=61595946544223"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#1877F2] text-xs font-semibold text-slate-700 hover:text-white transition-all duration-200 border border-slate-200 hover:border-[#1877F2] hover:scale-105"
                      >
                        <Facebook className="w-3.5 h-3.5 text-[#1877F2] group-hover:text-white" />
                        <span>Facebook</span>
                      </a>
                      <a
                        href="https://linkedin.com/company/kilsta-business-ict-consultants"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#0A66C2] text-xs font-semibold text-slate-700 hover:text-white transition-all duration-200 border border-slate-200 hover:border-[#0A66C2] hover:scale-105"
                      >
                        <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                        <span>LinkedIn</span>
                      </a>
                      <a
                        href="https://youtube.com/@kilsta-consultants"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#FF0000] text-xs font-semibold text-slate-700 hover:text-white transition-all duration-200 border border-slate-200 hover:border-[#FF0000] hover:scale-105"
                      >
                        <Youtube className="w-3.5 h-3.5 text-[#FF0000]" />
                        <span>YouTube</span>
                      </a>
                    </div>
                  </div>
                </div>

              </div>

              {/* State Credentials Footnote */}
              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-medium">IPA Registration</span>
                  <span className="text-xs font-bold text-slate-900 font-mono">6-129295384</span>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-200">
                  <span className="text-[11px] text-orange-700 block font-medium">Tax ID (TIN)</span>
                  <span className="text-xs font-bold text-orange-600 font-mono">502603269</span>
                </div>
              </div>

            </div>

            {/* Hyperdrive Pipeline Architecture Callout */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600 mb-2 uppercase tracking-wide">
                <Server className="w-4 h-4 text-orange-500" />
                <span>Cloudflare Hyperdrive Gateway</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Client submissions pass through regional Cloudflare Workers and execute via Hyperdrive connection pooling directly into Supabase PostgreSQL, ensuring zero packet loss even on remote mobile links.
              </p>
            </div>

          </div>

          {/* Right Column: Controlled Lead Intake Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-9 shadow-sm relative overflow-hidden">
              
              {/* Form Title & Context */}
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">
                  Client Project Intake Form
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Required fields are marked with an asterisk (*). All transmissions are encrypted.
                </p>
              </div>

              {/* Result State (Success Confirmation) */}
              {result ? (
                <div className="py-6 space-y-6 transition-all duration-300">
                  <div className="p-6 bg-orange-50 border border-orange-300 rounded-2xl shadow-sm transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 animate-bounce" style={{ animationIterationCount: 2 }}>
                        <CheckCircle className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                          Database Record Ingested
                        </span>
                        <h4 className="text-xl font-bold text-slate-900 mt-1">
                          Inquiry Successfully Registered
                        </h4>
                        <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                          Thank you, <strong className="text-slate-900">{result.name}</strong>. Your project inquiry has been queued for evaluation by our Principal Director and ICT Management desk.
                        </p>
                      </div>
                    </div>

                    {/* Metadata Table */}
                    <div className="mt-6 pt-5 border-t border-orange-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block">PostgreSQL Lead ID:</span>
                        <span className="font-mono text-slate-900 select-all break-all">{result.id}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Firebase Document:</span>
                        <span className="font-mono text-orange-600 font-semibold select-all break-all">
                          {result.firebase_id ? `leads/${result.firebase_id}` : 'Synced to Firestore'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Service Track:</span>
                        <span className="font-semibold text-orange-600">{result.service_category}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Status &amp; Cloud Sync:</span>
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-orange-500 text-white">
                          {result.status} · Synced
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="flex-1 py-3 px-4 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Submit Another Inquiry</span>
                    </button>
                    <a
                      href="https://console.firebase.google.com/project/velvety-joy-5sjh2/firestore/databases/ai-studio-kilstabusinessic-7a1e1b24-5472-4dd7-9644-64c1a73de32a/data"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 text-xs font-bold text-orange-800 bg-orange-100 hover:bg-orange-200 border border-orange-200 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4 text-orange-600" />
                      <span>View in Firebase Console</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  
                  {/* General Error Banner */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-xs">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold">Transmission Error</strong>
                        <span>{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Client / Contact Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Samuel Kora"
                          disabled={isSubmitting}
                          className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
                            validationErrors.name ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-orange-500'
                          } rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors`}
                        />
                      </div>
                      {validationErrors.name && (
                        <p className="text-red-600 text-xs mt-1">{validationErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Official Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. samuel@cooperative.org.pg"
                        disabled={isSubmitting}
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
                          validationErrors.email ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-orange-500'
                        } rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors`}
                      />
                      {validationErrors.email && (
                        <p className="text-red-600 text-xs mt-1">{validationErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Organization Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +675 7xxxxxxx"
                        disabled={isSubmitting}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Business / Community Org (Optional)
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        placeholder="e.g. Milne Bay Cocoa Farmers Assoc."
                        disabled={isSubmitting}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Service Requested Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Service Requested *
                    </label>
                    <select
                      name="service_category"
                      value={formData.service_category}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
                    >
                      {SERVICE_OPTIONS.map((opt, idx) => (
                        <option key={idx} value={opt} className="bg-white text-slate-900">
                          {opt}
                        </option>
                      ))}
                    </select>
                    {validationErrors.service_category && (
                      <p className="text-red-600 text-xs mt-1">{validationErrors.service_category}</p>
                    )}
                  </div>

                  {/* Project Description / Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Project Requirements &amp; Scope *
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Outline your requirements (e.g. number of staff to train, Starlink installation location, business registration details, or network requirements)..."
                      disabled={isSubmitting}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
                        validationErrors.message ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-orange-500'
                      } rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors resize-none`}
                    />
                    {validationErrors.message && (
                      <p className="text-red-600 text-xs mt-1">{validationErrors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 hover:scale-[1.01] active:scale-[0.99] disabled:bg-slate-300 disabled:text-slate-500 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Saving to PostgreSQL Database...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Inquiry to KILSTA Consultants</span>
                        </>
                      )}
                    </button>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 px-1">
                      <span>Encrypted SSL Connection</span>
                      <span className="font-mono text-orange-600 font-semibold">PostgreSQL + Drizzle ORM</span>
                    </div>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
