import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Search, Phone, Mail, FileText, Trash2, Save, X, User, Lock, Send, LogOut, Loader2, Upload } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import * as XLSX from 'xlsx';

// Types
interface Note {
    date: string;
    content: string;
    author?: string;
}

interface Contact {
    id: string;
    contact_type: 'INDIVIDUAL' | 'BUSINESS';
    name: string;
    role: string;
    company_name: string;
    website?: string;
    owner?: string;
    contact_number: string;
    contact_email: string;
    industry?: string;
    status: 'COLD' | 'WARM' | 'HOT';
    notes: Note[] | null;
    created_at: string;
    recipient_name?: string;
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
    const [filterIndustry, setFilterIndustry] = useState<string>('ALL');
    const [activeTab, setActiveTab] = useState<'INDIVIDUAL' | 'BUSINESS'>('INDIVIDUAL');

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
        contact_type: 'INDIVIDUAL',
        status: 'COLD',
        owner: 'Carl Spiller',
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
            const parsedData = data?.map((c: any) => ({
                ...c,
                notes: c.notes || []
            })) || [];
            setContacts(parsedData);
        }
        setLoading(false);
    };

    // Helper for owner change security
    const handleOwnerChange = (newOwner: string, currentOwner?: string) => {
        // If it's a new contact (no currentOwner), allow freely
        if (!currentOwner) return true;

        // If changing an existing owner, require password
        const password = prompt("Security Check: Enter Admin Password to change owner");
        if (password === "C4rlSp0rtsMem2025!") {
            return true;
        } else {
            alert("Incorrect Password. Owner change denied.");
            return false;
        }
    };

    // File Import Logic
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleWipeAllContacts = async () => {
        if (!confirm('WARNING: THIS WILL DELETE ALL CONTACTS IN THE CRM. THIS CANNOT BE UNDONE.\n\nAre you sure you want to proceed?')) return;
        if (!confirm('Seriously, are you sure? This will wipe the entire database.')) return;

        setLoading(true);
        const { error } = await supabase
            .from('crm_contacts')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

        if (error) alert('Error: ' + error.message);
        else {
            alert('All contacts wiped successfully.');
            fetchContacts();
        }
        setLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                if (data.length === 0) {
                    alert('No data found in spreadsheet');
                    return;
                }

                // Helper for fuzzy matching headers
                const getValue = (row: any, candidates: string[]) => {
                    const rowKeys = Object.keys(row);
                    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

                    for (const candidate of candidates) {
                        const target = normalize(candidate);
                        const match = rowKeys.find(k => normalize(k) === target);
                        if (match) return row[match];
                    }
                    return null;
                };

                const contactsToInsert = data.map((row: any) => {
                    const notes = [];
                    const noteContent = getValue(row, ['notes', 'note', 'comments']);

                    if (noteContent) {
                        notes.push({
                            date: new Date().toLocaleDateString('en-GB', {
                                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                            }),
                            content: String(noteContent),
                            author: session?.user?.email || 'Import'
                        });
                    }

                    let status: "COLD" | "WARM" | "HOT" = 'COLD';
                    const rowStatus = String(getValue(row, ['status', 'stage']) || '').toUpperCase();
                    if (['WARM', 'HOT'].includes(rowStatus)) status = rowStatus as "COLD" | "WARM" | "HOT";

                    const companyName = getValue(row, ['company', 'company name', 'organization', 'business']) || 'Unknown Company';
                    let name = getValue(row, ['full name', 'fullname', 'name', 'contact']);

                    // Auto-detect type
                    let type: 'INDIVIDUAL' | 'BUSINESS' = 'INDIVIDUAL';
                    if (!name && companyName !== 'Unknown Company') {
                        type = 'BUSINESS';
                        name = companyName;
                    } else if (!name) {
                        name = 'Unknown Contact';
                    }

                    return {
                        contact_type: type,
                        name: name,
                        // If Unknown Contact (Business), try to set recipient_name if found elsewhere? No, keeping simple.
                        recipient_name: '',
                        role: getValue(row, ['role', 'job title', 'title', 'position']) || (type === 'BUSINESS' ? 'Business Entity' : 'Unknown Role'),
                        company_name: companyName,
                        contact_number: String(getValue(row, ['phone', 'mobile', 'cell', 'tel', 'contact number']) || ''),
                        contact_email: getValue(row, ['email', 'e-mail', 'mail']) || '',
                        website: getValue(row, ['website', 'site', 'url']) || '',
                        owner: 'Carl Spiller',
                        status: status,
                        notes: notes
                    };
                });

                if (confirm(`Found ${contactsToInsert.length} rows. Ready to import?`)) {
                    const { error } = await supabase.from('crm_contacts').insert(contactsToInsert);
                    if (error) {
                        console.error('Import error:', error);
                        alert('Error importing contacts: ' + error.message);
                    } else {
                        alert(`Successfully imported ${contactsToInsert.length} contacts.`);
                        fetchContacts();
                    }
                }
            } catch (err) {
                console.error('File parse error:', err);
                alert('Error reading file. Please ensure it is a valid Excel file.');
            }
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsBinaryString(file);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoggingIn(true);
        setLoginError('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setLoginError(error.message);
        setLoggingIn(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setContacts([]);
    };

    const handleSaveContact = async () => {
        // Final sanity check before saving
        // If "Individual", we need a Name. If "Business", we need a Company Name.
        // But our logic is: Contact ID logic is driven by Name presence.

        if ((!formData.name && formData.contact_type === 'INDIVIDUAL') || !formData.company_name) {
            // However, if user explicitly selected Individual but left name blank, that's an error.
            // If user selected Business, Name can be blank.
            if (formData.contact_type === 'INDIVIDUAL' && !formData.name) {
                alert('Name is required for Individuals.');
                return;
            }
            if (!formData.company_name) {
                alert('Company Name is required.');
                return;
            }
        }

        // Force type logic
        const finalType = (!formData.name || formData.name.trim() === '') ? 'BUSINESS' : 'INDIVIDUAL';

        const { error } = await supabase
            .from('crm_contacts')
            .insert([
                {
                    contact_type: finalType,
                    name: finalType === 'BUSINESS' ? '' : formData.name, // Ensure empty if business
                    recipient_name: formData.recipient_name || '',
                    role: finalType === 'BUSINESS' ? 'Business Entity' : formData.role,
                    company_name: formData.company_name,
                    contact_number: formData.contact_number,
                    contact_email: formData.contact_email,
                    website: formData.website,
                    owner: formData.owner || 'Carl Spiller',
                    industry: formData.industry,
                    status: formData.status,
                    notes: formData.notes || []
                }
            ]);

        if (error) {
            alert('Error saving contact: ' + error.message);
        } else {
            setIsAdding(false);
            setFormData({ contact_type: activeTab, status: 'COLD', owner: 'Carl Spiller', notes: [] });
            fetchContacts();
        }
    };

    const handleUpdateContact = async () => {
        if (!selectedContact) return;

        const finalType = (!selectedContact.name || selectedContact.name.trim() === '') ? 'BUSINESS' : 'INDIVIDUAL';

        const { error } = await supabase
            .from('crm_contacts')
            .update({
                name: selectedContact.name,
                role: selectedContact.role,
                company_name: selectedContact.company_name,
                contact_number: selectedContact.contact_number,
                contact_email: selectedContact.contact_email,
                industry: selectedContact.industry,
                status: selectedContact.status,
                contact_type: finalType,
                recipient_name: selectedContact.recipient_name,
                website: selectedContact.website,
                owner: selectedContact.owner
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
        const { error } = await supabase.from('crm_contacts').delete().eq('id', id);
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
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        });

        const noteObj: Note = {
            date: dateStr,
            content: newNote,
            author: session?.user?.email || 'Unknown'
        };

        const currentNotes = Array.isArray(selectedContact.notes) ? selectedContact.notes : [];
        const updatedNotes = [...currentNotes, noteObj];

        const updatedContact = { ...selectedContact, notes: updatedNotes };
        setSelectedContact(updatedContact);
        setNewNote('');

        const { error } = await supabase
            .from('crm_contacts')
            .update({ notes: updatedNotes })
            .eq('id', selectedContact.id);

        if (error) {
            console.error("Failed to save note", error);
            alert("Failed to save note. Please check your connection.");
        } else {
            setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
        }
    };

    const industries = Array.from(new Set(contacts.map(c => c.industry).filter(Boolean)));

    const filteredContacts = contacts.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.company_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
        const matchesIndustry = filterIndustry === 'ALL' || c.industry === filterIndustry;
        const matchesTab = (c.contact_type || 'INDIVIDUAL') === activeTab;
        return matchesSearch && matchesStatus && matchesIndustry && matchesTab;
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
                <Helmet><title>Team Login</title></Helmet>
                <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-md w-full border border-navy/10 text-center">
                    <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-navy/20">
                        <Lock className="w-7 h-7 text-gold" />
                    </div>
                    <h1 className="font-serif text-3xl text-navy mb-2">Team Access</h1>
                    <p className="text-charcoal/60 mb-8 text-sm leading-relaxed">Secure CRM Login.</p>

                    <form onSubmit={handleLogin} className="space-y-4 text-left">
                        <div>
                            <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-1">Email</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-ivory border border-navy/10 rounded focus:outline-none focus:border-gold transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-1">Password</label>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-ivory border border-navy/10 rounded focus:outline-none focus:border-gold transition-colors" />
                        </div>
                        {loginError && <div className="p-3 bg-red-50 text-red-600 text-xs rounded border border-red-100 flex items-center gap-2"><X className="w-3 h-3" />{loginError}</div>}
                        <button type="submit" disabled={loggingIn} className="w-full bg-navy text-white font-bold py-4 rounded hover:bg-navy/90 transition-all flex justify-center items-center gap-2 mt-4">{loggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ivory text-charcoal pt-24 pb-12 px-4 md:pt-32 md:pb-12 md:px-12">
            <Helmet><title>Team CRM</title></Helmet>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-navy/5 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="font-serif text-4xl text-navy">Team CRM</h1>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold tracking-widest rounded-full uppercase border border-green-200">Secure</span>
                        </div>
                        <p className="text-charcoal/60">Logged in as <span className="text-navy font-semibold">{session.user.email}</span>.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleLogout} className="bg-white border border-navy/10 text-charcoal/70 px-4 py-3 rounded-md font-medium flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"><LogOut className="w-4 h-4" />Logout</button>
                        <button onClick={handleWipeAllContacts} className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-md font-medium flex items-center gap-2 hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" />Wipe All</button>
                        <input type="file" accept=".xlsx, .xls, .csv" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                        <button onClick={() => fileInputRef.current?.click()} className="bg-white border border-navy/10 text-charcoal/70 px-4 py-3 rounded-md font-medium flex items-center gap-2 hover:bg-navy/5 transition-colors"><Upload className="w-4 h-4" />Import</button>
                        <button onClick={() => setIsAdding(true)} className="bg-gold hover:bg-gold/90 text-ivory px-6 py-3 rounded-md font-medium flex items-center gap-2 transition-colors shadow-lg shadow-gold/20"><Plus className="w-5 h-5" />Add Contact</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button onClick={() => setActiveTab('INDIVIDUAL')} className={`flex-1 py-4 text-center font-serif text-lg border-b-2 transition-colors ${activeTab === 'INDIVIDUAL' ? 'border-navy text-navy font-bold' : 'border-transparent text-charcoal/40 hover:text-navy'}`}>Individuals</button>
                    <button onClick={() => setActiveTab('BUSINESS')} className={`flex-1 py-4 text-center font-serif text-lg border-b-2 transition-colors ${activeTab === 'BUSINESS' ? 'border-navy text-navy font-bold' : 'border-transparent text-charcoal/40 hover:text-navy'}`}>Target Businesses</button>
                </div>

                {/* Search & Filter */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-navy/5 mb-8 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40 w-5 h-5" />
                            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-ivory border border-navy/10 rounded-lg focus:outline-none focus:border-gold transition-all" />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto bg-ivory p-1.5 rounded-lg border border-navy/10 overflow-x-auto">
                            {['ALL', 'COLD', 'WARM', 'HOT'].map((status) => (
                                <button key={status} onClick={() => setFilterStatus(status as any)} className={`px-6 py-2 rounded-md text-sm font-bold tracking-wide transition-all ${filterStatus === status ? 'bg-navy text-white shadow-md' : 'text-charcoal/50 hover:text-navy hover:bg-white'}`}>{status}</button>
                            ))}
                        </div>
                    </div>
                    {/* Industry List */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                        <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest whitespace-nowrap">Filter Industry:</span>
                        <button onClick={() => setFilterIndustry('ALL')} className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${filterIndustry === 'ALL' ? 'bg-gold text-white border-gold' : 'bg-white border-navy/10 text-charcoal/60 hover:border-gold'}`}>All</button>
                        {industries.map(ind => (
                            <button key={ind} onClick={() => setFilterIndustry(ind!)} className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${filterIndustry === ind ? 'bg-gold text-white border-gold' : 'bg-white border-navy/10 text-charcoal/60 hover:border-gold'}`}>{ind}</button>
                        ))}
                    </div>
                </div>

                {/* List View */}
                {contacts.length === 0 && !loading ? (
                    <div className="text-center py-24 bg-white rounded-xl border border-dashed border-navy/10">
                        <User className="w-8 h-8 text-charcoal/20 mx-auto mb-4" />
                        <h3 className="font-serif text-xl text-navy mb-2">No Contacts Found</h3>
                        <button onClick={() => setIsAdding(true)} className="text-gold font-bold hover:underline">Add Contact Now</button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <div className="hidden md:flex px-4 py-2 text-[10px] font-bold text-charcoal/40 uppercase tracking-widest gap-4">
                            <div className="w-2" />
                            <div className="flex-1">{activeTab === 'BUSINESS' ? 'Company Name' : 'Name / Role'}</div>
                            <div className="flex-1">Owner</div>
                            <div className="flex-1">Contact</div>
                            <div className="w-32 text-right">Status</div>
                        </div>

                        {loading ? <Loader2 className="animate-spin w-8 h-8 text-navy mx-auto my-12" /> : filteredContacts.map(contact => (
                            <div key={contact.id} onClick={() => setSelectedContact(contact)} className="bg-white p-4 rounded-lg shadow-sm border border-navy/5 hover:border-gold/50 cursor-pointer group flex flex-col md:flex-row md:items-center gap-4 relative overflow-hidden">
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${contact.status === 'HOT' ? 'bg-red-500' : contact.status === 'WARM' ? 'bg-orange-400' : 'bg-blue-400'}`} />
                                <div className="flex-1 min-w-0 pl-3">
                                    <h3 className="font-serif text-lg text-navy font-bold truncate group-hover:text-gold transition-colors">{contact.name || contact.company_name}</h3>
                                    {contact.contact_type === 'INDIVIDUAL' && <p className="text-xs text-charcoal/60 truncate uppercase tracking-wider font-bold">{contact.role}</p>}
                                    {contact.contact_type === 'BUSINESS' && <p className="text-xs text-charcoal/60 truncate uppercase tracking-wider font-bold">{contact.industry || 'Unknown Industry'}</p>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 text-xs font-bold text-navy bg-navy/5 px-2 py-1 rounded w-fit">
                                        <Lock className="w-3 h-3" />
                                        {contact.owner || 'Carl Spiller'}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 hidden md:block space-y-1">
                                    {contact.contact_email && <div className="flex items-center gap-2 text-xs text-charcoal/60"><Mail className="w-3 h-3 text-gold" /> {contact.contact_email}</div>}
                                    {contact.contact_number && <div className="flex items-center gap-2 text-xs text-charcoal/60"><Phone className="w-3 h-3 text-gold" /> {contact.contact_number}</div>}
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pl-3 md:pl-0 mt-2 md:mt-0 border-t md:border-t-0 border-navy/5 pt-2 md:pt-0">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${contact.status === 'HOT' ? 'bg-red-50 text-red-600 border-red-100' : contact.status === 'WARM' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{contact.status}</span>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteContact(contact.id); }} className="text-gray-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg relative border border-white/20">
                        <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-charcoal/50" /></button>
                        <h2 className="font-serif text-2xl text-navy mb-6">Add New Contact</h2>
                        <div className="space-y-4">
                            <div className="bg-ivory p-1 rounded-lg border border-navy/10 flex mb-4">
                                <button disabled className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${formData.contact_type === 'INDIVIDUAL' ? 'bg-navy text-white shadow-sm' : 'text-charcoal/30'}`}>Individual</button>
                                <button disabled className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${formData.contact_type === 'BUSINESS' ? 'bg-navy text-white shadow-sm' : 'text-charcoal/30'}`}>Business</button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Full Name</label>
                                    <input placeholder="Leave empty for Business" className="p-3 bg-ivory border border-navy/10 rounded w-full focus:border-gold focus:outline-none" value={formData.name || ''}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setFormData(prev => ({
                                                ...prev,
                                                name: val,
                                                contact_type: val.trim().length > 0 ? 'INDIVIDUAL' : 'BUSINESS'
                                            }));
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Role / Title</label>
                                    <input placeholder="e.g. CEO" className="p-3 bg-ivory border border-navy/10 rounded w-full focus:border-gold focus:outline-none" value={formData.role || ''} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                </div>
                            </div>

                            {formData.contact_type === 'BUSINESS' && (
                                <div>
                                    <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Recipient Name (Contact Person)</label>
                                    <input
                                        placeholder="e.g. John Doe"
                                        className="p-3 bg-ivory border border-navy/10 rounded w-full focus:border-gold focus:outline-none relative z-10"
                                        value={formData.recipient_name || ''}
                                        onChange={e => setFormData({ ...formData, recipient_name: e.target.value })}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Company</label>
                                <input placeholder="e.g. Acme Corp" className="p-3 bg-ivory border border-navy/10 rounded w-full focus:border-gold focus:outline-none" value={formData.company_name || ''}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            company_name: val,
                                            contact_type: (!prev.name) ? 'BUSINESS' : prev.contact_type
                                        }));
                                    }}
                                />
                            </div>

                            {/* Owner */}
                            <div>
                                <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Account Owner</label>
                                <select className="w-full p-3 bg-ivory border border-navy/10 rounded focus:border-gold focus:outline-none font-medium text-navy" value={formData.owner || 'Carl Spiller'} onChange={e => setFormData({ ...formData, owner: e.target.value })}>
                                    <option value="Carl Spiller">Carl Spiller</option>
                                    <option value="Rhys Barker">Rhys Barker</option>
                                    <option value="Unassigned">Unassigned</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Status</label>
                                <select className="w-full p-3 bg-ivory border border-navy/10 rounded focus:border-gold focus:outline-none" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}>
                                    <option value="COLD">COLD</option>
                                    <option value="WARM">WARM</option>
                                    <option value="HOT">HOT</option>
                                </select>
                            </div>

                            <button onClick={handleSaveContact} className="w-full bg-navy text-white py-4 rounded font-bold hover:bg-navy/90 mt-4 transition-transform active:scale-[0.98]">Create Record</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {selectedContact && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-navy/60 backdrop-blur-md p-4 pt-24 animate-in fade-in duration-200">
                    <div className="relative bg-ivory rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col md:flex-row overflow-hidden border border-white/10">
                        {/* Details */}
                        <div className="w-full md:w-[350px] bg-white border-r border-navy/10 flex flex-col h-full z-10 shadow-lg">
                            <div className="p-6 border-b border-navy/5 bg-navy/5">
                                <div className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2">Lead Profile</div>
                                <input className="font-serif text-2xl text-navy bg-transparent border-none p-0 focus:ring-0 w-full font-bold placeholder:text-navy/30 placeholder:italic"
                                    value={selectedContact.name} placeholder="Click to add Name..."
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSelectedContact({ ...selectedContact, name: val, contact_type: val.trim().length > 0 ? 'INDIVIDUAL' : 'BUSINESS' });
                                    }}
                                />
                                <div className="mt-1">
                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded text-white ${selectedContact.contact_type === 'INDIVIDUAL' ? 'bg-navy' : 'bg-gold'}`}>{selectedContact.contact_type}</span>
                                </div>
                                <input className="text-sm font-medium text-charcoal/60 bg-transparent border-none p-0 focus:ring-0 w-full mt-2" value={selectedContact.role} placeholder="Role/Title" onChange={(e) => setSelectedContact({ ...selectedContact, role: e.target.value })} />
                            </div>

                            <div className="p-6 space-y-6 overflow-y-auto flex-1">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block mb-1">Company</label>
                                        <div className="flex items-center gap-2 bg-ivory p-2 rounded border border-navy/5">
                                            <User className="w-4 h-4 text-gold" />
                                            <input className="w-full bg-transparent text-sm focus:outline-none" value={selectedContact.company_name} onChange={(e) => setSelectedContact({ ...selectedContact, company_name: e.target.value })} />
                                        </div>
                                    </div>
                                    {/* Edit Owner */}
                                    <div>
                                        <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Account Owner</label>
                                        <div className="relative">
                                            <Lock className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30" />
                                            <select className="w-full p-2 pl-8 bg-ivory border border-navy/5 rounded text-sm font-bold text-navy" value={selectedContact.owner || 'Carl Spiller'}
                                                onChange={e => {
                                                    const newOwner = e.target.value;
                                                    const oldOwner = selectedContact.owner;
                                                    if (handleOwnerChange(newOwner, oldOwner)) {
                                                        setSelectedContact({ ...selectedContact, owner: newOwner });
                                                    }
                                                }}
                                            >
                                                <option value="Carl Spiller">Carl Spiller</option>
                                                <option value="Rhys Barker">Rhys Barker</option>
                                                <option value="Unassigned">Unassigned</option>
                                            </select>
                                        </div>
                                    </div>
                                    {/* Status */}
                                    <div>
                                        <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block mb-1">Status</label>
                                        <select className="w-full p-2 bg-ivory border border-navy/5 rounded text-sm font-bold text-navy" value={selectedContact.status} onChange={(e) => setSelectedContact({ ...selectedContact, status: e.target.value as any })}>
                                            <option value="COLD">COLD</option>
                                            <option value="WARM">WARM</option>
                                            <option value="HOT">HOT</option>
                                        </select>
                                    </div>
                                    {/* Industry */}
                                    <div>
                                        <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block mb-1">Industry</label>
                                        <div className="flex items-center gap-2 bg-ivory p-2 rounded border border-navy/5">
                                            <select className="w-full bg-transparent text-sm focus:outline-none" value={selectedContact.industry || ''} onChange={(e) => setSelectedContact({ ...selectedContact, industry: e.target.value })}>
                                                <option value="">No Industry</option>
                                                <option value="Professional Club">Professional Club</option>
                                                <option value="Corporate">Corporate</option>
                                                <option value="Retail">Retail</option>
                                                <option value="Hospitality">Hospitality</option>
                                                <option value="Agency">Agency</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    {/* Contact */}
                                    <div className="pt-4 border-t border-navy/5">
                                        <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block mb-2">Contact Details</label>
                                        <div className="space-y-2">
                                            {selectedContact.contact_type === 'BUSINESS' && (
                                                <>
                                                    <div className="flex items-center gap-2 bg-ivory p-2 rounded border border-navy/5">
                                                        <User className="w-4 h-4 text-gold" />
                                                        <input className="w-full bg-transparent text-sm focus:outline-none font-bold text-navy" placeholder="Recipient Name (e.g. John)" value={selectedContact.recipient_name || ''} onChange={(e) => setSelectedContact({ ...selectedContact, recipient_name: e.target.value })} />
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-ivory p-2 rounded border border-navy/5">
                                                        <Upload className="w-4 h-4 text-gold" />
                                                        <input className="w-full bg-transparent text-sm focus:outline-none" placeholder="Website" value={selectedContact.website || ''} onChange={(e) => setSelectedContact({ ...selectedContact, website: e.target.value })} />
                                                    </div>
                                                </>
                                            )}
                                            <div className="flex items-center gap-2 bg-ivory p-2 rounded border border-navy/5">
                                                <Mail className="w-4 h-4 text-gold" />
                                                <input className="w-full bg-transparent text-sm focus:outline-none" value={selectedContact.contact_email} onChange={(e) => setSelectedContact({ ...selectedContact, contact_email: e.target.value })} />
                                            </div>
                                            <div className="flex items-center gap-2 bg-ivory p-2 rounded border border-navy/5">
                                                <Phone className="w-4 h-4 text-gold" />
                                                <input className="w-full bg-transparent text-sm focus:outline-none" value={selectedContact.contact_number} onChange={(e) => setSelectedContact({ ...selectedContact, contact_number: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 border-t border-navy/5 flex gap-2">
                                <button onClick={handleUpdateContact} className="flex-1 bg-navy text-white text-sm font-bold py-3 rounded hover:bg-navy/90 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save Changes</button>
                                <button onClick={() => handleDeleteContact(selectedContact.id)} className="bg-red-50 text-red-600 p-3 rounded hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {/* Right: Notes */}
                        <div className="flex-1 bg-ivory flex flex-col h-full overflow-hidden">
                            <div className="h-full flex flex-col">
                                <div className="p-6 border-b border-navy/5 flex justify-between items-center bg-white/50">
                                    <h3 className="font-serif text-xl text-navy">Activity & Notes</h3>
                                    <span className="text-xs font-mono text-charcoal/40">{selectedContact.notes?.length || 0} entries</span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {(!selectedContact.notes || selectedContact.notes.length === 0) && (
                                        <div className="text-center py-12 text-charcoal/30 italic">No notes yet. Start the conversation.</div>
                                    )}
                                    {selectedContact.notes?.map((note, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-navy/5 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-bold text-gold uppercase tracking-widest">{note.date}</span>
                                                <span className="text-[10px] font-bold text-navy/40">{note.author}</span>
                                            </div>
                                            <p className="text-charcoal/80 text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 bg-white border-t border-navy/5">
                                    <div className="relative">
                                        <textarea placeholder="Type a note..." className="w-full p-4 pr-12 bg-ivory border border-navy/10 rounded-lg focus:outline-none focus:border-gold resize-none h-24 text-sm" value={newNote} onChange={(e) => setNewNote(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addNote(); } }} />
                                        <button onClick={addNote} disabled={!newNote.trim()} className="absolute right-3 bottom-3 p-2 bg-navy text-white rounded-md disabled:opacity-50 hover:bg-gold transition-colors"><Send className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setSelectedContact(null)} className="absolute top-4 right-4 z-50 bg-white shadow-md p-2 rounded-full text-navy hover:bg-red-50 hover:text-red-500 transition-colors pointer-events-auto"><X className="w-6 h-6" /></button>
                    </div>
                </div>
            )}
        </div>
    );
}
