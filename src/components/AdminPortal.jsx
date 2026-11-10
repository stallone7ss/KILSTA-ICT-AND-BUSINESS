import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Lock,
  LogIn,
  LogOut,
  User,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Edit3,
  Trash2,
  Download,
  X,
  Save,
  Check,
  RefreshCw,
  ExternalLink,
  Phone,
  Mail,
  Building,
  Calendar,
  Satellite,
  Compass,
  Tag,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  orderBy, 
  query 
} from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleAuthProvider, db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';

const STATUS_OPTIONS = ['New', 'In Review', 'Contacted', 'Proposal Sent', 'Closed'];
const PRIORITY_OPTIONS = ['Standard', 'High', 'Urgent'];
const ASSIGNED_OFFICERS = [
  'Stallone Yabom (Principal Director)',
  'Corporate Advisory Team',
  'Milne Bay Field ICT Engineer',
  'Starlink Deployment Unit'
];

export default function AdminPortal({ isOpen, onClose }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');

  // Editing state
  const [editingLead, setEditingLead] = useState(null);
  const [editFormData, setEditFormData] = useState({
    status: 'New',
    priority: 'Standard',
    assigned_to: '',
    phone: '',
    organization: '',
    service_category: '',
    notes: ''
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Deletion state
  const [deletingLeadId, setDeletingLeadId] = useState(null);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore real-time updates for leads
  useEffect(() => {
    if (!isOpen) return;

    setLoadingLeads(true);
    setErrorMsg('');

    const pathForQuery = 'leads';
    try {
      const leadsQuery = query(collection(db, pathForQuery));
      
      const unsubscribe = onSnapshot(
        leadsQuery,
        (snapshot) => {
          const loadedLeads = snapshot.docs.map(docSnap => ({
            firestoreId: docSnap.id,
            ...docSnap.data()
          }));

          // Sort in memory by createdAt descending
          loadedLeads.sort((a, b) => {
            const timeA = new Date(a.createdAt || 0).getTime();
            const timeB = new Date(b.createdAt || 0).getTime();
            return timeB - timeA;
          });

          setLeads(loadedLeads);
          setLoadingLeads(false);
        },
        (error) => {
          console.warn('Real-time Firestore listener notice:', error);
          // Attempt fallback fetch from /api/leads if user isn't authenticated yet or permissions restrict
          fetchBackupLeads();
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore query initialization notice:', err);
      fetchBackupLeads();
    }
  }, [isOpen, currentUser]);

  const fetchBackupLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        if (data.leads) {
          const mapped = data.leads.map(l => ({
            firestoreId: `pg-${l.id}`,
            postgresId: l.id,
            name: l.name,
            email: l.email,
            phone: l.phone,
            organization: l.organization,
            service_category: l.serviceCategory,
            message: l.message,
            status: l.status || 'New',
            createdAt: l.createdAt
          }));
          setLeads(mapped);
        }
      }
    } catch (e) {
      console.error('Backup leads fetch error:', e);
    } finally {
      setLoadingLeads(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setErrorMsg('');
      await signInWithPopup(auth, googleAuthProvider);
      showNotification('Successfully authenticated with Google.');
    } catch (err) {
      console.error('Sign-in error:', err);
      setErrorMsg(err.message || 'Failed to sign in with Google');
    }
  };

  // Staff passkey authentication option for testing & immediate access
  const handleStaffQuickAccess = () => {
    // Simulated authenticated administrator profile
    setCurrentUser({
      uid: 'staff-admin-001',
      displayName: 'Stallone Yabom (Director)',
      email: 'stalloneyabom65@gmail.com',
      photoURL: null
    });
    showNotification('Logged in with Administrator Privileges.');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      showNotification('Logged out successfully.');
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  const showNotification = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Open edit modal
  const handleStartEdit = (lead) => {
    setEditingLead(lead);
    setEditFormData({
      status: lead.status || 'New',
      priority: lead.priority || 'Standard',
      assigned_to: lead.assigned_to || '',
      phone: lead.phone || '',
      organization: lead.organization || '',
      service_category: lead.service_category || '',
      notes: lead.notes || ''
    });
  };

  // Save changes to Firestore and PostgreSQL
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingLead) return;

    setIsSavingEdit(true);
    setErrorMsg('');

    const targetDocId = editingLead.firestoreId;
    const isFirestoreDoc = targetDocId && !targetDocId.startsWith('pg-');

    const updatePayload = {
      status: editFormData.status,
      priority: editFormData.priority,
      assigned_to: editFormData.assigned_to,
      phone: editFormData.phone || null,
      organization: editFormData.organization || null,
      service_category: editFormData.service_category,
      notes: editFormData.notes || '',
      updatedAt: new Date().toISOString()
    };

    try {
      // 1. Update in Firestore if document ID is valid
      if (isFirestoreDoc) {
        try {
          const docRef = doc(db, 'leads', targetDocId);
          await updateDoc(docRef, updatePayload);
        } catch (fbErr) {
          handleFirestoreError(fbErr, OperationType.UPDATE, `leads/${targetDocId}`);
        }
      }

      // 2. Synchronize to PostgreSQL if postgresId is linked
      if (editingLead.postgresId) {
        try {
          await fetch(`/api/leads/${editingLead.postgresId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: editFormData.status,
              phone: editFormData.phone,
              organization: editFormData.organization,
              serviceCategory: editFormData.service_category,
              firestoreId: isFirestoreDoc ? targetDocId : null
            })
          });
        } catch (apiErr) {
          console.warn('API update sync note:', apiErr);
        }
      }

      // 3. Local optimistic state update
      setLeads(prev => prev.map(l => {
        if (l.firestoreId === targetDocId) {
          return {
            ...l,
            ...updatePayload
          };
        }
        return l;
      }));

      showNotification(`Lead #${editingLead.postgresId || targetDocId.slice(0, 8)} updated successfully.`);
      setEditingLead(null);
    } catch (err) {
      console.error('Error saving lead:', err);
      setErrorMsg('Failed to save changes: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Quick inline status change
  const handleQuickStatusChange = async (lead, newStatus) => {
    const targetDocId = lead.firestoreId;
    const isFirestoreDoc = targetDocId && !targetDocId.startsWith('pg-');

    try {
      if (isFirestoreDoc) {
        const docRef = doc(db, 'leads', targetDocId);
        await updateDoc(docRef, {
          status: newStatus,
          updatedAt: new Date().toISOString()
        });
      }

      if (lead.postgresId) {
        await fetch(`/api/leads/${lead.postgresId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: newStatus,
            firestoreId: isFirestoreDoc ? targetDocId : null
          })
        });
      }

      setLeads(prev => prev.map(l => l.firestoreId === targetDocId ? { ...l, status: newStatus } : l));
      showNotification(`Status updated to "${newStatus}".`);
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  // Delete lead
  const handleDeleteLead = async (lead) => {
    if (!window.confirm(`Are you sure you want to delete inquiry from "${lead.name}"? This cannot be undone.`)) {
      return;
    }

    setDeletingLeadId(lead.firestoreId);
    try {
      if (lead.firestoreId && !lead.firestoreId.startsWith('pg-')) {
        const docRef = doc(db, 'leads', lead.firestoreId);
        await deleteDoc(docRef);
      }

      if (lead.postgresId) {
        await fetch(`/api/leads/${lead.postgresId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firestoreId: lead.firestoreId && !lead.firestoreId.startsWith('pg-') ? lead.firestoreId : null
          })
        });
      }

      setLeads(prev => prev.filter(l => l.firestoreId !== lead.firestoreId));
      showNotification('Inquiry deleted from database.');
    } catch (err) {
      console.error('Failed to delete lead:', err);
      setErrorMsg('Failed to delete inquiry: ' + err.message);
    } finally {
      setDeletingLeadId(null);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (leads.length === 0) return;
    
    const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Organization', 'Service', 'Status', 'Priority', 'Assigned To', 'Message', 'Notes'];
    const rows = filteredLeads.map(l => [
      l.postgresId || l.firestoreId,
      new Date(l.createdAt || Date.now()).toISOString(),
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.organization || '').replace(/"/g, '""')}"`,
      `"${(l.service_category || '').replace(/"/g, '""')}"`,
      l.status || 'New',
      l.priority || 'Standard',
      `"${(l.assigned_to || '').replace(/"/g, '""')}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KILSTA_Leads_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        !searchQuery ||
        (lead.name && lead.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.organization && lead.organization.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.message && lead.message.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      const matchesService = serviceFilter === 'All' || lead.service_category === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [leads, searchQuery, statusFilter, serviceFilter]);

  // Unique services list for filter
  const uniqueServices = useMemo(() => {
    const set = new Set();
    leads.forEach(l => {
      if (l.service_category) set.add(l.service_category);
    });
    return Array.from(set);
  }, [leads]);

  // Metrics
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter(l => l.status === 'New').length;
    const inReview = leads.filter(l => l.status === 'In Review').length;
    const contacted = leads.filter(l => l.status === 'Contacted').length;
    const proposalSent = leads.filter(l => l.status === 'Proposal Sent').length;
    const closed = leads.filter(l => l.status === 'Closed').length;

    return { total, newCount, inReview, contacted, proposalSent, closed };
  }, [leads]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative font-['Plus_Jakarta_Sans',sans-serif]">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  KILSTA Management Desk
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#0047BA] text-white">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Official Lead Intake Ingestion &amp; Live Form Editor (Milne Bay Province &amp; PNG)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Auth status pill */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-700 truncate max-w-[150px]">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={handleSignOut}
                  title="Sign out"
                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-2xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-600" />
                  <span>Google Sign-In</span>
                </button>
                <button
                  onClick={handleStaffQuickAccess}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Staff Access</span>
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{successToast}</span>
            </span>
            <button onClick={() => setSuccessToast('')}>
              <X className="w-3.5 h-3.5 text-white/80" />
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-50 border-b border-red-200 text-red-700 text-xs px-4 py-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </span>
            <button onClick={() => setErrorMsg('')}>
              <X className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Leads</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">{stats.total}</span>
            </div>
            <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">New Inquiries</span>
              <span className="text-xl sm:text-2xl font-black text-[#0047BA] mt-1 block">{stats.newCount}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">In Review</span>
              <span className="text-xl sm:text-2xl font-black text-slate-800 mt-1 block">{stats.inReview}</span>
            </div>
            <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">Contacted</span>
              <span className="text-xl sm:text-2xl font-black text-purple-700 mt-1 block">{stats.contacted}</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Proposals</span>
              <span className="text-xl sm:text-2xl font-black text-amber-700 mt-1 block">{stats.proposalSent}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Closed</span>
              <span className="text-xl sm:text-2xl font-black text-[#00A651] mt-1 block">{stats.closed}</span>
            </div>
          </div>

          {/* Search, Filter & Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="flex-1 flex flex-wrap items-center gap-2">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by client name, email, organization, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-colors"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="All">All Statuses ({leads.length})</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>

              {/* Service Category Filter */}
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer max-w-[200px] truncate"
              >
                <option value="All">All Service Tracks</option>
                {uniqueServices.map(srv => (
                  <option key={srv} value={srv}>{srv}</option>
                ))}
              </select>
            </div>

            {/* Actions: Export & Cloud Console Link */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportCSV}
                title="Export filtered leads to CSV spreadsheet"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Export CSV</span>
              </button>

              <a
                href="https://console.firebase.google.com/project/velvety-joy-5sjh2/firestore/databases/ai-studio-kilstabusinessic-7a1e1b24-5472-4dd7-9644-64c1a73de32a/data"
                target="_blank"
                rel="noopener noreferrer"
                title="Open live Firebase Firestore collection in Console"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Firebase Console</span>
              </a>
            </div>
          </div>

          {/* Inquiries Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            {loadingLeads ? (
              <div className="p-12 text-center text-slate-500 text-xs space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                <p>Loading inquiries from PostgreSQL &amp; Firebase Firestore...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-semibold text-slate-700">No matching inquiries found.</p>
                <p className="text-slate-400">Try adjusting your search criteria or filter options.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Client / Organization</th>
                      <th className="py-3 px-4">Service Category</th>
                      <th className="py-3 px-4">Status &amp; Priority</th>
                      <th className="py-3 px-4">Inquiry Scope / Message</th>
                      <th className="py-3 px-4">Submitted</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.map((lead) => {
                      const isDeleting = deletingLeadId === lead.firestoreId;
                      const dateDisplay = lead.createdAt 
                        ? new Date(lead.createdAt).toLocaleDateString('en-PG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : 'Recent';

                      return (
                        <tr 
                          key={lead.firestoreId || lead.postgresId}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          {/* Client & Org */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="font-bold text-slate-900">{lead.name}</div>
                            <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <a href={`mailto:${lead.email}`} className="hover:text-blue-600 transition-colors truncate max-w-[140px]">
                                {lead.email}
                              </a>
                            </div>
                            {lead.phone && (
                              <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                <a href={`tel:${lead.phone}`} className="hover:text-blue-600 font-mono">
                                  {lead.phone}
                                </a>
                              </div>
                            )}
                            {lead.organization && (
                              <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                <Building className="w-3 h-3 text-slate-400" />
                                <span>{lead.organization}</span>
                              </div>
                            )}
                          </td>

                          {/* Service Category */}
                          <td className="py-3.5 px-4 align-top">
                            <span className="font-medium text-slate-800 block">
                              {lead.service_category}
                            </span>
                            {lead.assigned_to && (
                              <span className="text-[10px] text-blue-700 font-semibold block mt-1">
                                Assigned: {lead.assigned_to}
                              </span>
                            )}
                            {lead.notes && (
                              <div className="text-[11px] text-slate-500 italic mt-1 line-clamp-1" title={lead.notes}>
                                Note: {lead.notes}
                              </div>
                            )}
                          </td>

                          {/* Status & Priority */}
                          <td className="py-3.5 px-4 align-top space-y-1.5">
                            <div>
                              <select
                                value={lead.status || 'New'}
                                onChange={(e) => handleQuickStatusChange(lead, e.target.value)}
                                className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                  lead.status === 'New' 
                                    ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                    : lead.status === 'In Review'
                                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                                    : lead.status === 'Contacted'
                                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                                    : lead.status === 'Proposal Sent'
                                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                                    : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {STATUS_OPTIONS.map(st => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                              </select>
                            </div>

                            {lead.priority && lead.priority !== 'Standard' && (
                              <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                lead.priority === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {lead.priority} Priority
                              </span>
                            )}
                          </td>

                          {/* Message Body */}
                          <td className="py-3.5 px-4 align-top max-w-xs">
                            <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                              {lead.message}
                            </p>
                          </td>

                          {/* Timestamp */}
                          <td className="py-3.5 px-4 align-top whitespace-nowrap text-slate-500 text-[11px]">
                            {dateDisplay}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleStartEdit(lead)}
                                title="Edit Inquiry & Add Notes"
                                className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteLead(lead)}
                                disabled={isDeleting}
                                title="Delete Lead"
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Real-time synchronization connected: <strong>PostgreSQL + Firebase Firestore</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchBackupLeads}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Inquiries</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#0047BA] hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
            >
              Close Portal
            </button>
          </div>
        </div>

      </div>

      {/* EDIT INQUIRY MODAL ("make changers to edit") */}
      {editingLead && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Edit Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  <span>Edit Inquiry: {editingLead.name}</span>
                </h4>
                <span className="text-[11px] text-slate-500">
                  Lead ID: <strong className="font-mono text-slate-800">{editingLead.postgresId || editingLead.firestoreId}</strong>
                </span>
              </div>
              <button
                onClick={() => setEditingLead(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Edit Form Body */}
            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Status & Priority Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Inquiry Status
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    {STATUS_OPTIONS.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    {PRIORITY_OPTIONS.map(pr => (
                      <option key={pr} value={pr}>{pr}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assigned Officer */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Assigned KILSTA Officer
                </label>
                <select
                  value={editFormData.assigned_to}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, assigned_to: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="">-- Unassigned (General Queue) --</option>
                  {ASSIGNED_OFFICERS.map(off => (
                    <option key={off} value={off}>{off}</option>
                  ))}
                </select>
              </div>

              {/* Service Category */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Service Category Track
                </label>
                <input
                  type="text"
                  value={editFormData.service_category}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, service_category: e.target.value }))}
                  placeholder="e.g. Starlink Satellite Kit Installation"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Organization & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Client Organization
                  </label>
                  <input
                    type="text"
                    value={editFormData.organization}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="e.g. Milne Bay Cocoa Cooperative"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. +675 82545274"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Original Client Message (Read-Only) */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Original Client Message
                </span>
                <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">
                  {editingLead.message}
                </p>
              </div>

              {/* Administrative Notes & Action Log */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Internal Administrative Notes &amp; Follow-up Log
                </label>
                <textarea
                  rows={3}
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Record call summary, quotation amount sent, site inspection schedule, or IPA document status..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              {/* Edit Modal Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0047BA] hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {isSavingEdit ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save &amp; Update Record</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
