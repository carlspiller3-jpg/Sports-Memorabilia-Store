```
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Search, Phone, Mail, FileText, Trash2, Save, X, User, Lock, Send, LogOut, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// Types
interface Note {
    date: string;
    content: string;
    author?: string; // Optional: track who wrote it
}

interface Contact {
    id: string;
    name: string;
    role: string;
    company_name: string;
    contact_number: string;
    contact_email: string;
    status: 'COLD' | 'WARM' | 'HOT';
    notes: Note[];
    created_at: string;
}

export function CRMPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'COLD' | 'WARM' | 'HOT'>('ALL');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Security State
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Contact>>({
        status: 'COLD',
        notes: []
    });
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        // Check session
        if (sessionStorage.getItem('crm_unlocked') === 'true') {
            setIsUnlocked(true);
            fetchContacts();
        }
    }, []);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple password protection - Change this to something secure!
        if (passwordInput === 'ADMIN2026') {
            setIsUnlocked(true);
            sessionStorage.setItem('crm_unlocked', 'true');
            fetchContacts();
        } else {
            setAuthError(true);
        }
    };

    const fetchContacts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('crm_contacts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching contacts:', error);
        } else {
            // Parse notes if they are stored as JSONB, usually comes as object/array automatically
            setContacts(data || []);
        }
        setLoading(false);
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
                status: selectedContact.status,
                notes: selectedContact.notes
            })
            .eq('id', selectedContact.id);

        if (error) {
            alert('Error updating contact: ' + error.message);
        } else {
            // Optimistic update locally or re-fetch
            fetchContacts(); // rigorous
            // Keep selected open?
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

        // specific format requested: "01/01 - notes..."
        // We will store it as a structured object { date: "01/01", content: "..." } for flexibility,
        // but the UI will display it as requested.
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const dateStr = `${ day }/${month}`;

// Check if we already have a note for today? No, just append.
// Actually, user example: "01/01 - contacted".
// I'll create a text string or object?
// Let's stick to object for better data structure, but render as text.

const noteObj: Note = { date: dateStr, content: newNote };

const updatedNotes = [...(selectedContact.notes || []), noteObj];

// Update local state first
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
    alert("Failed to save note");
} else {
    // Update main list too
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
}
    };

const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || c.status === filterStatus;
    return matchesSearch && matchesFilter;
});

if (!isUnlocked) {
    return (
        <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-4">
            <Helmet>
                <title>Restricted Access</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full border border-navy/10 text-center">
                <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="w-8 h-8 text-gold" />
                </div>
                <h1 className="font-serif text-2xl text-navy mb-2">Team Access Only</h1>
                <p className="text-charcoal/60 mb-6 text-sm">Please enter the admin password to access the CRM.</p>

                <form onSubmit={handleUnlock} className="space-y-4">
                    <input
                        type="password"
                        placeholder="Password"
                        value={passwordInput}
                        onChange={(e) => {
                            setPasswordInput(e.target.value);
                            setAuthError(false);
                        }}
                        className="w-full p-3 bg-ivory border border-navy/10 rounded focus:outline-none focus:border-gold text-center tracking-widest"
                    />
                    {authError && <p className="text-red-500 text-xs">Incorrect password</p>}
                    <button type="submit" className="w-full bg-navy text-white font-bold py-3 rounded hover:bg-navy/90 transition-colors">
                        Unlock
                    </button>
                </form>
            </div>
        </div>
    );
}

return (
    <div className="min-h-screen bg-ivory text-charcoal pt-24 pb-12 px-4 md:pt-32 md:pb-12 md:px-12">
        <Helmet>
            <title>Team CRM</title>
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="font-serif text-4xl text-navy mb-2">Team CRM</h1>
                    <p className="text-charcoal/60">Manage your contacts and relationships simply.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-gold hover:bg-gold/90 text-ivory px-6 py-3 rounded-md font-medium flex items-center gap-2 transition-colors shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Add New Contact
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-navy/5 mb-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-ivory border border-navy/10 rounded focus:outline-none focus:border-gold"
                    />
                </div>
                <div className="flex gap-2 bg-ivory p-1 rounded border border-navy/10">
                    {['ALL', 'COLD', 'WARM', 'HOT'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status as any)}
                            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${filterStatus === status
                                ? 'bg-navy text-white shadow-sm'
                                : 'text-charcoal/60 hover:text-navy hover:bg-black/5'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p>Loading contacts...</p>
                ) : filteredContacts.map(contact => (
                    <div
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className="bg-white p-6 rounded-lg shadow-sm border border-navy/5 hover:shadow-md hover:border-gold/30 transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${contact.status === 'HOT' ? 'bg-red-100 text-red-700' :
                                contact.status === 'WARM' ? 'bg-orange-100 text-orange-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                {contact.status}
                            </div>
                            <div className="text-xs text-charcoal/40 font-mono">
                                {new Date(contact.created_at).toLocaleDateString()}
                            </div>
                        </div>

                        <h3 className="font-serif text-xl text-navy group-hover:text-gold transition-colors mb-1">{contact.name}</h3>
                        <p className="text-sm font-medium text-charcoal/70 mb-4">{contact.role} @ {contact.company_name}</p>

                        <div className="space-y-2 text-sm text-charcoal/60">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {contact.contact_number || 'No number'}
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {contact.contact_email || 'No email'}
                            </div>
                        </div>

                        {/* Preview latest note if any */}
                        {contact.notes && contact.notes.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-navy/5">
                                <p className="text-xs text-charcoal/50 italic truncate">
                                    Latest: {contact.notes[contact.notes.length - 1].date} - {contact.notes[contact.notes.length - 1].content}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Add Contact Modal */}
        {isAdding && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/20 backdrop-blur-sm p-4">
                <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-serif text-2xl text-navy">Add New Contact</h2>
                        <button onClick={() => setIsAdding(false)}><X className="w-6 h-6 text-charcoal/50 hover:text-navy" /></button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="Name"
                                className="p-3 bg-ivory border border-navy/10 rounded w-full"
                                value={formData.name || ''}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                placeholder="Role"
                                className="p-3 bg-ivory border border-navy/10 rounded w-full"
                                value={formData.role || ''}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            />
                        </div>
                        <input
                            placeholder="Company Name"
                            className="p-3 bg-ivory border border-navy/10 rounded w-full"
                            value={formData.company_name || ''}
                            onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="Phone"
                                className="p-3 bg-ivory border border-navy/10 rounded w-full"
                                value={formData.contact_number || ''}
                                onChange={e => setFormData({ ...formData, contact_number: e.target.value })}
                            />
                            <input
                                placeholder="Email"
                                className="p-3 bg-ivory border border-navy/10 rounded w-full"
                                value={formData.contact_email || ''}
                                onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal/60 mb-1">Status</label>
                            <select
                                className="w-full p-3 bg-ivory border border-navy/10 rounded"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            >
                                <option value="COLD">COLD</option>
                                <option value="WARM">WARM</option>
                                <option value="HOT">HOT</option>
                            </select>
                        </div>

                        <button
                            onClick={handleSaveContact}
                            className="w-full bg-navy text-white py-3 rounded font-bold hover:bg-navy/90 mt-4"
                        >
                            Save Contact
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Detail / Edit Modal */}
        {selectedContact && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/20 backdrop-blur-sm p-4">
                <div className="bg-white p-0 rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex overflow-hidden animate-fade-in">

                    {/* Left: Details */}
                    <div className="w-1/3 bg-ivory p-8 border-r border-navy/10 overflow-y-auto">
                        <h2 className="font-serif text-2xl text-navy mb-1">{selectedContact.name}</h2>
                        <input
                            className="bg-transparent border-b border-navy/10 w-full mb-6 font-medium text-charcoal/70 focus:outline-none focus:border-gold"
                            value={selectedContact.role}
                            onChange={(e) => setSelectedContact({ ...selectedContact, role: e.target.value })}
                        />

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-charcoal/40 uppercase tracking-widest block mb-2">Company</label>
                                <input
                                    className="w-full p-2 bg-white border border-navy/10 rounded"
                                    value={selectedContact.company_name}
                                    onChange={(e) => setSelectedContact({ ...selectedContact, company_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-charcoal/40 uppercase tracking-widest block mb-2">Status</label>
                                <select
                                    className="w-full p-2 bg-white border border-navy/10 rounded"
                                    value={selectedContact.status}
                                    onChange={(e) => setSelectedContact({ ...selectedContact, status: e.target.value as any })}
                                >
                                    <option value="COLD">COLD</option>
                                    <option value="WARM">WARM</option>
                                    <option value="HOT">HOT</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-charcoal/40 uppercase tracking-widest block mb-2">Contact Info</label>
                                <input
                                    className="w-full p-2 bg-white border border-navy/10 rounded mb-2"
                                    value={selectedContact.contact_number}
                                    onChange={(e) => setSelectedContact({ ...selectedContact, contact_number: e.target.value })}
                                    placeholder="Phone"
                                />
                                <input
                                    className="w-full p-2 bg-white border border-navy/10 rounded"
                                    value={selectedContact.contact_email}
                                    onChange={(e) => setSelectedContact({ ...selectedContact, contact_email: e.target.value })}
                                    placeholder="Email"
                                />
                            </div>

                            <div className="pt-8 flex gap-2">
                                <button onClick={handleUpdateContact} className="flex-1 bg-navy text-white py-2 rounded text-sm font-bold flex justify-center items-center gap-2 hover:bg-navy/90">
                                    <Save className="w-4 h-4" /> Save
                                </button>
                                <button onClick={() => handleDeleteContact(selectedContact.id)} className="flex-1 bg-red-50 text-red-600 border border-red-100 py-2 rounded text-sm font-bold flex justify-center items-center gap-2 hover:bg-red-100">
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Notes */}
                    <div className="w-2/3 bg-white p-8 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-serif text-xl text-navy flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gold" />
                                Activity Log
                            </h3>
                            <button onClick={() => setSelectedContact(null)}>
                                <X className="w-6 h-6 text-charcoal/30 hover:text-navy" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-custom">
                            {selectedContact.notes && selectedContact.notes.length === 0 && (
                                <div className="text-center bg-ivory p-8 rounded border border-dashed border-navy/10 text-charcoal/40">
                                    No notes yet. Start tracking your interactions!
                                </div>
                            )}
                            {selectedContact.notes?.map((note, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="min-w-[60px] text-xs font-bold text-gold pt-1">
                                        {note.date}
                                    </div>
                                    <div className="bg-ivory p-3 rounded-lg border border-navy/5 flex-1 text-sm text-charcoal leading-relaxed">
                                        {note.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto">
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 bg-ivory border border-navy/10 rounded px-4 focus:outline-none focus:border-gold transition-colors"
                                    placeholder="Type a note (e.g. 'Had a call regarding pricing...')"
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addNote()}
                                />
                                <button
                                    onClick={addNote}
                                    className="bg-gold text-white px-6 py-3 rounded font-bold hover:bg-gold/90"
                                >
                                    Send
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
