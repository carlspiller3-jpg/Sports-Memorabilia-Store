import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Search, Phone, Mail, FileText, Trash2, Save, X, User, Lock, Send, LogOut, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// Types
interface Note {
    date: string;
    content: string;
    author?: string;
}

interface Contact {
    id: string;
    name: string;
    role: string;
    company_name: string;
    contact_number: string;
    contact_email: string;
    status: 'COLD' | 'WARM' | 'HOT';
    notes: Note[] | null;
    created_at: string;
}

export function CRMPage() {
    // Session State
    const [session, setSession] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Data State
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'COLD' | 'WARM' | 'HOT'>('ALL');

    // UI State
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Login Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);

    // Form State (Add)
    const [formData, setFormData] = useState<Partial<Contact>>({
        status: 'COLD',
        notes: []
    });

    // Form State (Note)
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        // 1. Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchContacts();
            setAuthLoading(false);
        });

        // 2. Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchContacts();
            setAuthLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('crm_contacts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching contacts:', error);
        } else {
            // Ensure notes is always an array for local usage
            const parsedData = data?.map(c => ({
                ...c,
                notes: c.notes || []
            })) || [];
            setContacts(parsedData);
        }
        setLoading(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoggingIn(true);
        setLoginError('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setLoginError(error.message);
        }
        setLoggingIn(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setContacts([]);
    };

    const handleSaveContact = async () => {
        if (!formData.name || !formData.company_name) {
            alert('Please provide at least a Name and Company.');
            return;
        }

        const { error } = await supabase
            .from('crm_contacts')
            .insert([
                {
                    name: formData.name,
                    role: formData.role,
                    company_name: formData.company_name,
                    contact_number: formData.contact_number,
                    contact_email: formData.contact_email,
                    status: formData.status,
                    notes: formData.notes || []
                }
            ]);

        if (error) {
            alert('Error saving contact: ' + error.message);
        } else {
            setIsAdding(false);
            setFormData({ status: 'COLD', notes: [] });
            fetchContacts();
        }
    };

    const handleUpdateContact = async () => {
        if (!selectedContact) return;

        const { error } = await supabase
            .from('crm_contacts')
            .update({
                name: selectedContact.name,
                role: selectedContact.role,
                company_name: selectedContact.company_name,
                contact_number: selectedContact.contact_number,
                contact_email: selectedContact.contact_email,
                status: selectedContact.status
            })
            .eq('id', selectedContact.id);

        if (error) {
            alert('Error updating contact: ' + error.message);
        } else {
            fetchContacts();
        }
    };

    const handleDeleteContact = async (id: string) => {
        if (!confirm('Are you sure you want to delete this contact?')) return;

        const { error } = await supabase
            .from('crm_contacts')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error deleting: ' + error.message);
        } else {
            if (selectedContact?.id === id) setSelectedContact(null);
            fetchContacts();
        }
    };

    const addNote = async () => {
        if (!newNote.trim() || !selectedContact) return;

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }); // e.g. 02/01 14:30

        const noteObj: Note = {
            date: dateStr,
            content: newNote,
            author: session?.user?.email || 'Unknown'
        };

        const currentNotes = Array.isArray(selectedContact.notes) ? selectedContact.notes : [];
        const updatedNotes = [...currentNotes, noteObj];

        // Optimistic Update
        const updatedContact = { ...selectedContact, notes: updatedNotes };
        setSelectedContact(updatedContact);
        setNewNote('');

        // Persist
        const { error } = await supabase
            .from('crm_contacts')
            .update({ notes: updatedNotes })
            .eq('id', selectedContact.id);

        if (error) {
            console.error("Failed to save note", error);
            alert("Failed to save note. Please check your connection.");
        } else {
            // Update main list in background
            setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
        }
    };

    const filteredContacts = contacts.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.company_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'ALL' || c.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (authLoading) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-navy" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-4">
                <Helmet>
                    <title>Team Login</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Helmet>
                <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-md w-full border border-navy/10 text-center">
                    <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-navy/20">
                        <Lock className="w-7 h-7 text-gold" />
                    </div>
                    <h1 className="font-serif text-3xl text-navy mb-2">Team Access</h1>
                    <p className="text-charcoal/60 mb-8 text-sm leading-relaxed">
                        Secure CRM Login. <br /> Please use your administrative credentials.
                    </p>

                    <form onSubmit={handleLogin} className="space-y-4 text-left">
                        <div>
                            <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 bg-ivory border border-navy/10 rounded focus:outline-none focus:border-gold transition-colors"
                                placeholder="name@sportssigned.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 bg-ivory border border-navy/10 rounded focus:outline-none focus:border-gold transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        {loginError && (
                            <div className="p-3 bg-red-50 text-red-600 text-xs rounded border border-red-100 flex items-center gap-2">
                                <X className="w-3 h-3" />
                                {loginError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loggingIn}
                            className="w-full bg-navy text-white font-bold py-4 rounded hover:bg-navy/90 transition-all flex justify-center items-center gap-2 mt-4"
                        >
                            {loggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ivory text-charcoal pt-24 pb-12 px-4 md:pt-32 md:pb-12 md:px-12">
            <Helmet>
                <title>Team CRM | Authenticated</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-navy/5 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="font-serif text-4xl text-navy">Team CRM</h1>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold tracking-widest rounded-full uppercase border border-green-200">
                                Secure
                            </span>
                        </div>
                        <p className="text-charcoal/60">Welcome back. You are logged in as <span className="text-navy font-semibold">{session.user.email}</span>.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleLogout}
                            className="bg-white border border-navy/10 text-charcoal/70 px-4 py-3 rounded-md font-medium flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-gold hover:bg-gold/90 text-ivory px-6 py-3 rounded-md font-medium flex items-center gap-2 transition-colors shadow-lg shadow-gold/20"
                        >
                            <Plus className="w-5 h-5" />
                            Add Contact
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-navy/5 mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search contacts by name or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-ivory border border-navy/10 rounded-lg focus:outline-none focus:border-gold transition-all"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto bg-ivory p-1.5 rounded-lg border border-navy/10 overflow-x-auto">
                        {['ALL', 'COLD', 'WARM', 'HOT'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status as any)}
                                className={`px-6 py-2 rounded-md text-sm font-bold tracking-wide transition-all ${filterStatus === status
                                    ? 'bg-navy text-white shadow-md'
                                    : 'text-charcoal/50 hover:text-navy hover:bg-white'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Grid */}
                {contacts.length === 0 && !loading ? (
                    <div className="text-center py-24 bg-white rounded-xl border border-dashed border-navy/10">
                        <div className="w-16 h-16 bg-ivory rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-charcoal/20" />
                        </div>
                        <h3 className="font-serif text-xl text-navy mb-2">No Contacts Found</h3>
                        <p className="text-charcoal/50 mb-6">Get started by adding your first lead.</p>
                        <button onClick={() => setIsAdding(true)} className="text-gold font-bold hover:underline">Add Contact Now</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
                            ))
                        ) : filteredContacts.map(contact => (
                            <div
                                key={contact.id}
                                onClick={() => setSelectedContact(contact)}
                                className="bg-white p-6 rounded-xl shadow-sm border border-navy/5 hover:shadow-xl hover:-translate-y-1 hover:border-gold/30 transition-all cursor-pointer group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-ivory p-2 rounded-full shadow-sm text-navy">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${contact.status === 'HOT' ? 'bg-red-50 text-red-600 border-red-100' :
                                        contact.status === 'WARM' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                            'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>
                                        {contact.status}
                                    </div>
                                </div>

                                <h3 className="font-serif text-xl text-navy group-hover:text-gold transition-colors mb-1 truncate">{contact.name}</h3>
                                <p className="text-sm font-medium text-charcoal/70 mb-6 truncate">{contact.role} <span className="text-charcoal/40">at</span> {contact.company_name}</p>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-charcoal/60 bg-ivory p-2 rounded border border-navy/5">
                                        <Phone className="w-4 h-4 text-gold" />
                                        <span className="truncate">{contact.contact_number || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-charcoal/60 bg-ivory p-2 rounded border border-navy/5">
                                        <Mail className="w-4 h-4 text-gold" />
                                        <span className="truncate">{contact.contact_email || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Footer Stats */}
                                <div className="mt-6 pt-4 border-t border-navy/5 flex justify-between items-center text-xs text-charcoal/40 font-mono">
                                    <span>Created: {new Date(contact.created_at).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1">
                                        <FileText className="w-3 h-3" />
                                        {(contact.notes || []).length} Notes
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Contact Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg relative border border-white/20">
                        <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-charcoal/50" />
                        </button>

                        <h2 className="font-serif text-2xl text-navy mb-6">Add New Contact</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Full Name</label>
                                    <input
                                        placeholder="e.g. John Smith"
                                        className="p-3 bg-ivory border border-navy/10 rounded w-full focus:border-gold focus:outline-none"
                                        value={formData.name || ''}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Role / Job Title</label>
                                    <input
                                        placeholder="e.g. CEO"
                                        className="p-3 bg-ivory border border-navy/10 rounded w-full focus:border-gold focus:outline-none"
                                        value={formData.role || ''}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Company</label>
                                <input
                                    placeholder="e.g. Acme Corp"
                                    className="p-3 bg-ivory border border-navy/10 rounded w-full focus:border-gold focus:outline-none"
                                    value={formData.company_name || ''}
                                    onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Phone</label>
                                    <input
                                        placeholder="+44..."
                                        className="p-3 bg-ivory border border-navy/10 rounded w-full focus:border-gold focus:outline-none"
                                        value={formData.contact_number || ''}
                                        onChange={e => setFormData({ ...formData, contact_number: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Email</label>
                                    <input
                                        placeholder="john@acme.com"
                                        className="p-3 bg-ivory border border-navy/10 rounded w-full focus:border-gold focus:outline-none"
                                        value={formData.contact_email || ''}
                                        onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Initial Status</label>
                                <select
                                    className="w-full p-3 bg-ivory border border-navy/10 rounded focus:border-gold focus:outline-none"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                >
                                    <option value="COLD">COLD (No contact)</option>
                                    <option value="WARM">WARM (In conversation)</option>
                                    <option value="HOT">HOT (Closing / Urgent)</option>
                                </select>
                            </div>

                            <button
                                onClick={handleSaveContact}
                                className="w-full bg-navy text-white py-4 rounded font-bold hover:bg-navy/90 mt-4 transition-transform active:scale-[0.98]"
                            >
                                Create Contact Record
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail / Edit Modal - Full Screen Style Overlay */}
            {selectedContact && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-navy/60 backdrop-blur-md p-4 pt-24 animate-in fade-in duration-200">
                    <div className="bg-ivory rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col md:flex-row overflow-hidden border border-white/10">

                        {/* Left: Details (Static/Editable) */}
                        <div className="w-full md:w-[350px] bg-white border-r border-navy/10 flex flex-col h-full z-10 shadow-lg">
                            <div className="p-6 border-b border-navy/5 bg-navy/5">
                                <div className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2">Lead Profile</div>
                                <input
                                    className="font-serif text-2xl text-navy bg-transparent border-none p-0 focus:ring-0 w-full font-bold placeholder:text-navy/30"
                                    value={selectedContact.name}
                                    onChange={(e) => setSelectedContact({ ...selectedContact, name: e.target.value })}
                                />
                                <input
                                    className="text-sm font-medium text-charcoal/60 bg-transparent border-none p-0 focus:ring-0 w-full mt-1"
                                    value={selectedContact.role}
                                    onChange={(e) => setSelectedContact({ ...selectedContact, role: e.target.value })}
                                />
                            </div>

                            <div className="p-6 space-y-6 overflow-y-auto flex-1">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block mb-1">Company</label>
                                        <div className="flex items-center gap-2 bg-ivory p-2 rounded border border-navy/5">
                                            <User className="w-4 h-4 text-gold" />
                                            <input
                                                className="w-full bg-transparent text-sm focus:outline-none"
                                                value={selectedContact.company_name}
                                                onChange={(e) => setSelectedContact({ ...selectedContact, company_name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block mb-1">Status</label>
                                        <select
                                            className="w-full p-2 bg-ivory border border-navy/5 rounded text-sm font-bold text-navy"
                                            value={selectedContact.status}
                                            onChange={(e) => setSelectedContact({ ...selectedContact, status: e.target.value as any })}
                                        >
                                            <option value="COLD">COLD</option>
                                            <option value="WARM">WARM</option>
                                            <option value="HOT">HOT</option>
                                        </select>
                                    </div>

                                    <div className="pt-4 border-t border-navy/5">
                                        <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block mb-2">Contact Details</label>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 bg-ivory p-2 rounded border border-navy/5">
                                                <Phone className="w-4 h-4 text-charcoal/40" />
                                                <input
                                                    className="w-full bg-transparent text-sm focus:outline-none"
                                                    value={selectedContact.contact_number}
                                                    onChange={(e) => setSelectedContact({ ...selectedContact, contact_number: e.target.value })}
                                                    placeholder="Add phone..."
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 bg-ivory p-2 rounded border border-navy/5">
                                                <Mail className="w-4 h-4 text-charcoal/40" />
                                                <input
                                                    className="w-full bg-transparent text-sm focus:outline-none"
                                                    value={selectedContact.contact_email}
                                                    onChange={(e) => setSelectedContact({ ...selectedContact, contact_email: e.target.value })}
                                                    placeholder="Add email..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-navy/10 bg-gray-50 flex gap-2">
                                <button onClick={() => { handleUpdateContact(); setSelectedContact(null); }} className="flex-1 bg-navy text-white py-3 rounded-lg text-sm font-bold hover:bg-navy/90 transition-colors shadow-sm">
                                    Save Changes
                                </button>
                                <button onClick={() => handleDeleteContact(selectedContact.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Contact">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Right: Activity Feed (The "Notes" Section) */}
                        <div className="flex-1 flex flex-col h-full bg-ivory/50">
                            {/* Feed Header */}
                            <div className="p-6 border-b border-navy/5 bg-white flex justify-between items-center sticky top-0 z-20">
                                <div>
                                    <h3 className="font-serif text-xl text-navy flex items-center gap-2">
                                        Activity & Notes
                                        <span className="bg-gold/10 text-gold text-xs px-2 py-1 rounded-full font-sans font-bold">
                                            {(selectedContact.notes || []).length}
                                        </span>
                                    </h3>
                                </div>
                                <button onClick={() => setSelectedContact(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-charcoal" />
                                </button>
                            </div>

                            {/* Feed Content */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                                <div className="max-w-3xl mx-auto space-y-6">
                                    {(!selectedContact.notes || selectedContact.notes.length === 0) && (
                                        <div className="text-center py-12 opacity-50">
                                            <FileText className="w-12 h-12 mx-auto mb-3 text-charcoal/20" />
                                            <p>No activity recorded yet.</p>
                                        </div>
                                    )}

                                    {/* Timeline items */}
                                    {selectedContact.notes?.map((note, idx) => (
                                        <div key={idx} className="flex gap-4 group">
                                            <div className="flex flex-col items-center">
                                                <div className="w-2 h-2 bg-gold rounded-full mt-2 ring-4 ring-ivory" />
                                                <div className="w-0.5 flex-1 bg-navy/10 my-1 group-last:hidden" />
                                            </div>
                                            <div className="flex-1 pb-6">
                                                <div className="bg-white p-5 rounded-xl border border-navy/5 shadow-sm active:scale-[0.99] transition-transform">
                                                    <p className="text-navy text-base leading-relaxed whitespace-pre-wrap">{note.content}</p>
                                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                                        <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">
                                                            {note.date}
                                                        </span>
                                                        {note.author && (
                                                            <>
                                                                <span className="text-[10px] text-charcoal/20">•</span>
                                                                <span className="text-[10px] font-bold text-gold uppercase tracking-widest">{note.author}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Note Input */}
                            <div className="p-6 bg-white border-t border-navy/5">
                                <div className="max-w-3xl mx-auto flex gap-4">
                                    <div className="flex-1 relative">
                                        <textarea
                                            className="w-full bg-ivory border border-navy/10 rounded-xl p-4 pr-12 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all resize-none shadow-inner"
                                            rows={3}
                                            placeholder="Type a new note, call summary, or update..."
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    addNote();
                                                }
                                            }}
                                        />
                                        <div className="absolute bottom-3 right-3 text-[10px] text-charcoal/30 font-bold uppercase tracking-widest">
                                            Press Enter to save
                                        </div>
                                    </div>
                                    <button
                                        onClick={addNote}
                                        disabled={!newNote.trim()}
                                        className="bg-gold text-white px-6 rounded-xl font-bold hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gold/20 flex flex-col items-center justify-center gap-1"
                                    >
                                        <Send className="w-5 h-5" />
                                        <span className="text-[10px] uppercase tracking-widest">Post</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
