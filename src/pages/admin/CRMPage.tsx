import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Search, Phone, Mail, FileText, Trash2, Save, X, User, Lock, Send, LogOut, Loader2, Upload, ArrowLeft, Copy, Check, ExternalLink, Package, Truck, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import * as XLSX from 'xlsx';
import { Link, useNavigate } from 'react-router-dom';

// Types
export interface Note {
    date: string;
    content: string;
    author?: string;
}

export type PipelineStatus =
    | 'New Prospect'
    | 'Cold Email Sent'
    | 'Digital Mockup Sent'
    | 'Sample Requested'
    | 'Pro Forma Invoiced'
    | 'Active Corporate Account'
    | 'COLD'
    | 'WARM'
    | 'HOT';

export interface Contact {
    id: string;
    contact_type: 'INDIVIDUAL' | 'BUSINESS';
    name: string;
    first_name?: string;
    role: string;
    company_name: string;
    website?: string;
    owner?: string;
    contact_number: string;
    contact_email: string;
    industry?: string;
    status: PipelineStatus;
    recent_deal?: string;
    allocated_inventory?: string;
    courier_tracking?: string;
    notes: Note[] | null;
    created_at: string;
    recipient_name?: string;
}

export interface EmailBlueprint {
    id: string;
    name: string;
    sector: string;
    subject: string;
    body: string;
}

export const EMAIL_BLUEPRINTS: EmailBlueprint[] = [
    {
        id: 'ma',
        name: 'M and A (Mergers and Acquisitions)',
        sector: 'Mergers and Acquisitions',
        subject: 'Congratulations on {{contact.recent_deal}}',
        body: `Hi {{contact.first_name}},

Noticed {{contact.company}} recently advised on {{contact.recent_deal}}. Congratulations to the team on completing such a significant transaction.

We specialize in bespoke corporate deal commemoration for leading financial and legal advisors. We supply museum grade framed sports memorabilia with laser etched deal plaques to celebrate key transaction milestones.

Would you be open to seeing a digital mockup customized for {{contact.company}}?

Kind regards,
Carl Spiller
Sports Memorabilia Store`
    },
    {
        id: 'cre',
        name: 'Commercial Real Estate',
        sector: 'Commercial Real Estate',
        subject: 'Deal Commemoration for {{contact.company}}',
        body: `Hi {{contact.first_name}},

Congratulations on the recent completion regarding {{contact.recent_deal}}.

We work with commercial real estate firms to produce executive closing gifts and deal display pieces for key client handovers and boardroom displays.

Would you like us to send across a digital mockup showing how a framed heritage piece with custom deal plaque would look for {{contact.company}}?

Kind regards,
Carl Spiller
Sports Memorabilia Store`
    },
    {
        id: 'recruitment',
        name: 'Executive Recruitment',
        sector: 'Executive Recruitment',
        subject: 'Placings and Milestones at {{contact.company}}',
        body: `Hi {{contact.first_name}},

I saw the recent news regarding {{contact.recent_deal}} at {{contact.company}}. Fantastic work by the search team.

We partner with premier executive recruitment agencies to supply high value placement gifts and boardroom display assets for high net worth clients and senior hires.

Should I send over a quick digital mockup and sample details for {{contact.company}}?

Kind regards,
Carl Spiller
Sports Memorabilia Store`
    }
];

export function CRMPage() {
    const navigate = useNavigate();
    // Session State
    const [session, setSession] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Data State
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [filterIndustry, setFilterIndustry] = useState<string>('ALL');
    const [activeTab, setActiveTab] = useState<'INDIVIDUAL' | 'BUSINESS'>('INDIVIDUAL');

    // UI State
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailModalContact, setEmailModalContact] = useState<Contact | null>(null);
    const [selectedBlueprint, setSelectedBlueprint] = useState<EmailBlueprint>(EMAIL_BLUEPRINTS[0]);
    const [copiedSubject, setCopiedSubject] = useState(false);
    const [copiedBody, setCopiedBody] = useState(false);

    // Login Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);

    // Form State (Add)
    const [formData, setFormData] = useState<Partial<Contact>>({
        contact_type: 'INDIVIDUAL',
        status: 'New Prospect',
        owner: 'Carl Spiller',
        notes: []
    });

    // Import State
    const [importOwner, setImportOwner] = useState('Carl Spiller');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // Form State (Note)
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsEmailModalOpen(false);
                setSelectedContact(null);
                setIsAdding(false);
                setIsImportModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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
            const parsedData = data?.map((c: any) => ({
                ...c,
                status: c.status === '50% Deposit Invoiced' ? 'Pro Forma Invoiced' : (c.status || 'New Prospect'),
                notes: c.notes || []
            })) || [];
            setContacts(parsedData);
        }
        setLoading(false);
    };

    const getFirstName = (c: Partial<Contact>): string => {
        if (c.first_name && c.first_name.trim().length > 0) return c.first_name;
        if (c.name && c.name.trim().length > 0) return c.name.trim().split(' ')[0];
        if (c.recipient_name && c.recipient_name.trim().length > 0) return c.recipient_name.trim().split(' ')[0];
        return 'there';
    };

    const formatTemplateText = (templateText: string, c: Contact | null): string => {
        if (!c) return templateText;
        const firstName = getFirstName(c);
        const company = c.company_name || 'your firm';
        const recentDeal = c.recent_deal || 'your recent deal';
        const role = c.role || 'Team';
        const email = c.contact_email || '';

        return templateText
            .replace(/\{\{contact\.first_name\}\}/g, firstName)
            .replace(/\{\{first_name\}\}/g, firstName)
            .replace(/\{\{contact\.company\}\}/g, company)
            .replace(/\{\{company\}\}/g, company)
            .replace(/\{\{company_name\}\}/g, company)
            .replace(/\{\{contact\.recent_deal\}\}/g, recentDeal)
            .replace(/\{\{recent_deal\}\}/g, recentDeal)
            .replace(/\{\{contact\.role\}\}/g, role)
            .replace(/\{\{contact\.email\}\}/g, email);
    };

    const handleOwnerChange = (newOwner: string, currentOwner?: string) => {
        if (!currentOwner || currentOwner === 'Unassigned') return true;
        const password = prompt("Security Check: Enter Admin Password to change owner");
        if (password === "C4rlSp0rtsMem2025!") {
            return true;
        } else {
            alert("Incorrect Password. Owner change denied.");
            return false;
        }
    };

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

                    let status: PipelineStatus = 'New Prospect';
                    const rowStatus = String(getValue(row, ['status', 'stage', 'pipeline']) || '').toUpperCase();
                    if (rowStatus.includes('COLD EMAIL')) status = 'Cold Email Sent';
                    else if (rowStatus.includes('MOCKUP')) status = 'Digital Mockup Sent';
                    else if (rowStatus.includes('SAMPLE')) status = 'Sample Requested';
                    else if (rowStatus.includes('INVOICE') || rowStatus.includes('PRO FORMA')) status = 'Pro Forma Invoiced';
                    else if (rowStatus.includes('ACTIVE') || rowStatus.includes('ACCOUNT')) status = 'Active Corporate Account';
                    else if (rowStatus === 'WARM') status = 'WARM';
                    else if (rowStatus === 'HOT') status = 'HOT';
                    else if (rowStatus === 'COLD') status = 'COLD';

                    const companyName = getValue(row, ['company', 'company name', 'organization', 'business']) || 'Unknown Company';
                    let name = getValue(row, ['full name', 'fullname', 'name', 'contact', 'contact name', 'person', 'recipient', 'recipient name', 'lead']);
                    let firstName = getValue(row, ['first name', 'firstname', 'given name']);
                    const recentDeal = getValue(row, ['recent deal', 'deal', 'milestone', 'transaction', 'recent transaction']);

                    let type: 'INDIVIDUAL' | 'BUSINESS' = 'INDIVIDUAL';
                    if (!name && companyName !== 'Unknown Company') {
                        type = 'BUSINESS';
                        name = '';
                    } else if (!name) {
                        name = 'Unknown Contact';
                    }

                    if (!firstName && name) {
                        firstName = String(name).trim().split(' ')[0];
                    }

                    return {
                        contact_type: type,
                        name: name,
                        first_name: firstName || '',
                        recipient_name: getValue(row, ['recipient', 'recipient name', 'contact person', 'contact']) || '',
                        role: getValue(row, ['role', 'job title', 'title', 'position']) || (type === 'BUSINESS' ? 'Business Entity' : 'Unknown Role'),
                        company_name: companyName,
                        recent_deal: recentDeal || '',
                        contact_number: String(getValue(row, ['phone', 'mobile', 'cell', 'tel', 'contact number']) || ''),
                        contact_email: getValue(row, ['email', 'e-mail', 'mail']) || '',
                        website: getValue(row, ['website', 'site', 'url']) || '',
                        owner: importOwner,
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
            setIsImportModalOpen(false);
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
        if ((!formData.name && formData.contact_type === 'INDIVIDUAL') || !formData.company_name) {
            if (formData.contact_type === 'INDIVIDUAL' && !formData.name) {
                alert('Name is required for Individuals.');
                return;
            }
            if (!formData.company_name) {
                alert('Company Name is required.');
                return;
            }
        }

        const finalType = (!formData.name || formData.name.trim() === '') ? 'BUSINESS' : 'INDIVIDUAL';
        const derivedFirstName = formData.first_name || (formData.name ? formData.name.trim().split(' ')[0] : '');

        const { error } = await supabase
            .from('crm_contacts')
            .insert([
                {
                    contact_type: finalType,
                    name: finalType === 'BUSINESS' ? '' : formData.name,
                    first_name: derivedFirstName,
                    recipient_name: formData.recipient_name || '',
                    role: finalType === 'BUSINESS' ? 'Business Entity' : formData.role,
                    company_name: formData.company_name,
                    recent_deal: formData.recent_deal || '',
                    contact_number: formData.contact_number,
                    contact_email: formData.contact_email,
                    website: formData.website,
                    owner: formData.owner || 'Carl Spiller',
                    industry: formData.industry,
                    status: formData.status || 'New Prospect',
                    allocated_inventory: formData.allocated_inventory || '',
                    courier_tracking: formData.courier_tracking || '',
                    notes: formData.notes || []
                }
            ]);

        if (error) {
            alert('Error saving contact: ' + error.message);
        } else {
            setIsAdding(false);
            setFormData({ contact_type: activeTab, status: 'New Prospect', owner: 'Carl Spiller', notes: [] });
            fetchContacts();
        }
    };

    const handleUpdateContact = async () => {
        if (!selectedContact) return;

        const isNameEmpty = !selectedContact.name || selectedContact.name.trim() === '';
        const isNameDuplicate = selectedContact.name?.trim() === selectedContact.company_name?.trim();
        const isBusinessRole = selectedContact.role === 'Business Entity';

        let typeToSave = (isNameEmpty || isNameDuplicate || isBusinessRole) ? 'BUSINESS' : 'INDIVIDUAL';
        let nameToSave = selectedContact.name;
        let recipientToSave = selectedContact.recipient_name;

        if (typeToSave === 'BUSINESS' && selectedContact.recipient_name && selectedContact.recipient_name.trim().length > 0) {
            typeToSave = 'INDIVIDUAL';
            nameToSave = selectedContact.recipient_name;
            recipientToSave = '';
        }

        const derivedFirstName = selectedContact.first_name || (nameToSave ? nameToSave.trim().split(' ')[0] : '');

        const { error } = await supabase
            .from('crm_contacts')
            .update({
                name: typeToSave === 'BUSINESS' ? '' : nameToSave,
                first_name: derivedFirstName,
                role: selectedContact.role,
                company_name: selectedContact.company_name,
                recent_deal: selectedContact.recent_deal || '',
                contact_number: selectedContact.contact_number,
                contact_email: selectedContact.contact_email,
                industry: selectedContact.industry,
                status: selectedContact.status,
                allocated_inventory: selectedContact.allocated_inventory || '',
                courier_tracking: selectedContact.courier_tracking || '',
                contact_type: typeToSave,
                recipient_name: recipientToSave,
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

    const updateContactStatus = async (contactId: string, newStatus: PipelineStatus, noteContent?: string) => {
        const target = contacts.find(c => c.id === contactId);
        if (!target) return;

        let updatedNotes = target.notes || [];
        if (noteContent) {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-GB', {
                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
            });
            updatedNotes = [...updatedNotes, {
                date: dateStr,
                content: noteContent,
                author: session?.user?.email || 'System'
            }];
        }

        const { error } = await supabase
            .from('crm_contacts')
            .update({ status: newStatus, notes: updatedNotes })
            .eq('id', contactId);

        if (error) {
            alert('Error updating status: ' + error.message);
        } else {
            setContacts(prev => prev.map(c => c.id === contactId ? { ...c, status: newStatus, notes: updatedNotes } : c));
            if (selectedContact?.id === contactId) {
                setSelectedContact({ ...selectedContact, status: newStatus, notes: updatedNotes });
            }
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

    const openEmailModalForContact = (c: Contact) => {
        setEmailModalContact(c);
        if (c.industry && c.industry.toLowerCase().includes('real estate')) {
            setSelectedBlueprint(EMAIL_BLUEPRINTS[1]);
        } else if (c.industry && c.industry.toLowerCase().includes('recruitment')) {
            setSelectedBlueprint(EMAIL_BLUEPRINTS[2]);
        } else {
            setSelectedBlueprint(EMAIL_BLUEPRINTS[0]);
        }
        setIsEmailModalOpen(true);
    };

    const openInvoiceGeneratorForContact = (c: Contact) => {
        const clientName = encodeURIComponent(getFirstName(c));
        const clientCompany = encodeURIComponent(c.company_name || '');
        const clientEmail = encodeURIComponent(c.contact_email || '');
        navigate(`/admin/invoice-generator?clientName=${clientName}&clientCompany=${clientCompany}&clientEmail=${clientEmail}&invoiceType=PRO_FORMA`);
    };

    const industries = Array.from(new Set(contacts.map(c => c.industry).filter(Boolean)));

    const pipelineStatuses: PipelineStatus[] = [
        'New Prospect',
        'Cold Email Sent',
        'Digital Mockup Sent',
        'Sample Requested',
        'Pro Forma Invoiced',
        'Active Corporate Account'
    ];

    const filteredContacts = contacts.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.recent_deal && c.recent_deal.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
        const matchesIndustry = filterIndustry === 'ALL' || c.industry === filterIndustry;
        const matchesTab = (c.contact_type || 'INDIVIDUAL') === activeTab;
        return matchesSearch && matchesStatus && matchesIndustry && matchesTab;
    });

    const getStatusBadgeStyle = (status: PipelineStatus) => {
        switch (status) {
            case 'New Prospect':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Cold Email Sent':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Digital Mockup Sent':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Sample Requested':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'Pro Forma Invoiced':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
            case 'Active Corporate Account':
                return 'bg-gold/20 text-navy border-gold font-bold';
            case 'HOT':
                return 'bg-red-50 text-red-600 border-red-100';
            case 'WARM':
                return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'COLD':
            default:
                return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

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
                <Helmet><title>Team Login | Admin</title></Helmet>
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
        <div className="min-h-screen bg-ivory text-charcoal pt-36 pb-12 px-4 md:pt-36 md:pb-12 md:px-12">
            <Helmet><title>Corporate CRM | Admin</title></Helmet>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-navy/5 pb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/admin" className="p-2 hover:bg-stone/20 rounded-full text-navy/60 transition-colors self-start mt-1">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="font-serif text-4xl text-navy">Corporate CRM</h1>
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold tracking-widest rounded-full uppercase border border-green-200">Live Hub</span>
                            </div>
                            <p className="text-charcoal/60">Automated lead prospecting, email template merge tags, pro forma invoicing, and dispatch tracking.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={handleLogout} className="bg-white border border-navy/10 text-charcoal/70 px-4 py-3 rounded-md font-medium flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"><LogOut className="w-4 h-4" />Logout</button>
                        <button onClick={handleWipeAllContacts} className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-md font-medium flex items-center gap-2 hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" />Wipe All</button>
                        <input type="file" accept=".xlsx, .xls, .csv" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                        <button onClick={() => setIsImportModalOpen(true)} className="bg-white border border-navy/10 text-charcoal/70 px-4 py-3 rounded-md font-medium flex items-center gap-2 hover:bg-navy/5 transition-colors"><Upload className="w-4 h-4" />Import</button>
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
                            <input type="text" placeholder="Search name, company, or recent deal..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-ivory border border-navy/10 rounded-lg focus:outline-none focus:border-gold transition-all" />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto bg-ivory p-1.5 rounded-lg border border-navy/10 overflow-x-auto">
                            <button onClick={() => setFilterStatus('ALL')} className={`px-4 py-2 rounded-md text-xs font-bold tracking-wide transition-all whitespace-nowrap ${filterStatus === 'ALL' ? 'bg-navy text-white shadow-md' : 'text-charcoal/50 hover:text-navy hover:bg-white'}`}>All Statuses</button>
                            {pipelineStatuses.map((st) => (
                                <button key={st} onClick={() => setFilterStatus(st)} className={`px-4 py-2 rounded-md text-xs font-bold tracking-wide transition-all whitespace-nowrap ${filterStatus === st ? 'bg-navy text-white shadow-md' : 'text-charcoal/50 hover:text-navy hover:bg-white'}`}>{st}</button>
                            ))}
                        </div>
                    </div>
                    {/* Industry Filter */}
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
                            <div className="flex-1">{activeTab === 'BUSINESS' ? 'Company Name' : 'Name and Role'}</div>
                            <div className="flex-1">Recent Deal / Milestone</div>
                            <div className="w-48">Contact and Actions</div>
                            <div className="w-44 text-right">Pipeline Status</div>
                        </div>

                        {loading ? <Loader2 className="animate-spin w-8 h-8 text-navy mx-auto my-12" /> : filteredContacts.map(contact => (
                            <div key={contact.id} onClick={() => setSelectedContact(contact)} className="bg-white p-4 rounded-lg shadow-sm border border-navy/5 hover:border-gold/50 cursor-pointer group flex flex-col md:flex-row md:items-center gap-4 relative overflow-hidden">
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${contact.status === 'Active Corporate Account' ? 'bg-gold' : contact.status === 'Pro Forma Invoiced' ? 'bg-emerald-500' : contact.status === 'Sample Requested' ? 'bg-orange-500' : 'bg-blue-400'}`} />

                                <div className="flex-1 min-w-0 pl-3">
                                    <h3 className="font-serif text-lg text-navy font-bold truncate group-hover:text-gold transition-colors">
                                        {contact.contact_type === 'BUSINESS' ? contact.company_name : (contact.name || contact.company_name)}
                                    </h3>
                                    {contact.contact_type === 'INDIVIDUAL' && (
                                        <p className="text-xs text-charcoal/60 truncate uppercase tracking-wider font-bold">
                                            {contact.role} {contact.company_name && <span className="text-charcoal/40">at {contact.company_name}</span>}
                                        </p>
                                    )}
                                    {contact.contact_type === 'BUSINESS' && (
                                        <div className="flex flex-col">
                                            <p className="text-xs text-charcoal/60 truncate uppercase tracking-wider font-bold">{contact.industry || 'Corporate Target'}</p>
                                            {contact.recipient_name && <p className="text-[10px] text-navy/60 font-bold mt-0.5">Contact: {contact.recipient_name}</p>}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    {contact.recent_deal ? (
                                        <div className="text-xs text-navy/80 bg-stone/20 p-2 rounded border border-navy/5 font-medium truncate" title={contact.recent_deal}>
                                            <span className="font-bold text-gold mr-1">Deal:</span> {contact.recent_deal}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-charcoal/30 italic">No deal specified</span>
                                    )}
                                </div>

                                <div className="w-48 flex items-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openEmailModalForContact(contact); }}
                                        className="p-2 bg-navy/5 hover:bg-gold hover:text-white rounded-md text-navy text-xs font-bold flex items-center gap-1 transition-colors"
                                        title="Email Template"
                                    >
                                        <Mail className="w-3.5 h-3.5" /> Template
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openInvoiceGeneratorForContact(contact); }}
                                        className="p-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-md text-emerald-700 text-xs font-bold flex items-center gap-1 border border-emerald-200 transition-colors"
                                        title="Pro Forma Invoice"
                                    >
                                        <FileText className="w-3.5 h-3.5" /> Pro Forma
                                    </button>
                                </div>

                                <div className="w-44 flex items-center justify-between md:justify-end gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border whitespace-nowrap ${getStatusBadgeStyle(contact.status)}`}>
                                        {contact.status}
                                    </span>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteContact(contact.id); }} className="text-gray-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Contact Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/40 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setIsAdding(false)}>
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg relative border border-white/20 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-charcoal/50" /></button>
                        <h2 className="font-serif text-2xl text-navy mb-6">Add Corporate Prospect</h2>
                        <div className="space-y-4">
                            <div className="bg-ivory p-1 rounded-lg border border-navy/10 flex mb-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, contact_type: 'INDIVIDUAL' })}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${formData.contact_type === 'INDIVIDUAL' ? 'bg-navy text-white shadow-sm' : 'text-charcoal/50 hover:text-navy'}`}
                                >
                                    Individual
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, contact_type: 'BUSINESS' })}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${formData.contact_type === 'BUSINESS' ? 'bg-navy text-white shadow-sm' : 'text-charcoal/50 hover:text-navy'}`}
                                >
                                    Business
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Full Name</label>
                                    <input placeholder="e.g. John Smith" className="p-3 bg-ivory border border-navy/10 rounded w-full focus:border-gold focus:outline-none text-sm" value={formData.name || ''}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setFormData(prev => ({
                                                ...prev,
                                                name: val,
                                                first_name: val ? val.trim().split(' ')[0] : '',
                                                contact_type: val.trim().length > 0 ? 'INDIVIDUAL' : 'BUSINESS'
                                            }));
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Role or Title</label>
                                    <input placeholder="e.g. Partner / CEO" className="p-3 bg-ivory border border-navy/10 rounded w-full focus:border-gold focus:outline-none text-sm" value={formData.role || ''} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Company Name</label>
                                <input placeholder="e.g. Rothschild and Co" className="p-3 bg-ivory border border-navy/10 rounded w-full focus:border-gold focus:outline-none text-sm" value={formData.company_name || ''} onChange={e => setFormData({ ...formData, company_name: e.target.value })} />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Recent Deal or Milestone</label>
                                <input placeholder="e.g. Advised on Project Apex acquisition" className="p-3 bg-ivory border border-navy/10 rounded w-full focus:border-gold focus:outline-none text-sm" value={formData.recent_deal || ''} onChange={e => setFormData({ ...formData, recent_deal: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Email Address</label>
                                    <input placeholder="e.g. john@firm.com" className="p-3 bg-ivory border border-navy/10 rounded w-full focus:border-gold focus:outline-none text-sm" value={formData.contact_email || ''} onChange={e => setFormData({ ...formData, contact_email: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Phone Number</label>
                                    <input placeholder="e.g. 020 7946 0000" className="p-3 bg-ivory border border-navy/10 rounded w-full focus:border-gold focus:outline-none text-sm" value={formData.contact_number || ''} onChange={e => setFormData({ ...formData, contact_number: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Industry</label>
                                    <select className="w-full p-3 bg-ivory border border-navy/10 rounded focus:border-gold focus:outline-none text-sm" value={formData.industry || ''} onChange={e => setFormData({ ...formData, industry: e.target.value })}>
                                        <option value="">Select Industry</option>
                                        <option value="Mergers and Acquisitions">Mergers and Acquisitions</option>
                                        <option value="Commercial Real Estate">Commercial Real Estate</option>
                                        <option value="Executive Recruitment">Executive Recruitment</option>
                                        <option value="Wealth Management">Wealth Management</option>
                                        <option value="Interior Design">Interior Design</option>
                                        <option value="Corporate">Corporate</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Pipeline Status</label>
                                    <select className="w-full p-3 bg-ivory border border-navy/10 rounded focus:border-gold focus:outline-none text-sm font-bold text-navy" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as PipelineStatus })}>
                                        {pipelineStatuses.map(st => (
                                            <option key={st} value={st}>{st}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button onClick={handleSaveContact} className="w-full bg-navy text-white py-4 rounded font-bold hover:bg-navy/90 mt-4 transition-transform active:scale-[0.98]">Create Prospect Record</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Details and Editing Modal */}
            {selectedContact && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-navy/60 backdrop-blur-md p-4 pt-24 animate-in fade-in duration-200" onClick={() => setSelectedContact(null)}>
                    <div className="relative bg-ivory rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col md:flex-row overflow-hidden border border-white/10" onClick={(e) => e.stopPropagation()}>
                        <div className="w-full md:w-[380px] bg-white border-r border-navy/10 flex flex-col h-full z-10 shadow-lg overflow-y-auto">
                            <div className="p-6 border-b border-navy/5 bg-navy/5">
                                <div className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2">Corporate Lead Profile</div>
                                <input className="font-serif text-2xl text-navy bg-transparent border-none p-0 focus:ring-0 w-full font-bold placeholder:text-navy/30 placeholder:italic"
                                    value={selectedContact.name} placeholder="Click to add Name..."
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSelectedContact({
                                            ...selectedContact,
                                            name: val,
                                            first_name: val ? val.trim().split(' ')[0] : '',
                                            contact_type: val.trim().length > 0 ? 'INDIVIDUAL' : 'BUSINESS'
                                        });
                                    }}
                                />
                                <div className="mt-2 flex gap-2 items-center">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${selectedContact.contact_type === 'INDIVIDUAL' ? 'bg-navy' : 'bg-gold'}`}>{selectedContact.contact_type}</span>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusBadgeStyle(selectedContact.status)}`}>{selectedContact.status}</span>
                                </div>
                                <input className="text-sm font-medium text-charcoal/60 bg-transparent border-none p-0 focus:ring-0 w-full mt-2" value={selectedContact.role} placeholder="Role or Title" onChange={(e) => setSelectedContact({ ...selectedContact, role: e.target.value })} />
                            </div>

                            <div className="p-6 space-y-5 flex-1">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block mb-1">Company Name</label>
                                        <input className="w-full p-2 bg-ivory border border-navy/10 rounded text-sm font-semibold text-navy" value={selectedContact.company_name} onChange={(e) => setSelectedContact({ ...selectedContact, company_name: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block mb-1">Recent Deal or Milestone</label>
                                        <textarea className="w-full p-2 bg-ivory border border-navy/10 rounded text-sm h-16 resize-none" placeholder="e.g. Advised on Project Apex acquisition" value={selectedContact.recent_deal || ''} onChange={(e) => setSelectedContact({ ...selectedContact, recent_deal: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block mb-1">Pipeline Status</label>
                                        <select className="w-full p-2 bg-ivory border border-navy/10 rounded text-sm font-bold text-navy" value={selectedContact.status} onChange={(e) => setSelectedContact({ ...selectedContact, status: e.target.value as PipelineStatus })}>
                                            {pipelineStatuses.map(st => (
                                                <option key={st} value={st}>{st}</option>
                                            ))}
                                            <option value="COLD">COLD (Legacy)</option>
                                            <option value="WARM">WARM (Legacy)</option>
                                            <option value="HOT">HOT (Legacy)</option>
                                        </select>
                                    </div>

                                    {/* 24 Hour Dispatch & Inventory Tracking */}
                                    <div className="p-3 bg-stone/20 rounded-lg border border-navy/5 space-y-3">
                                        <div className="text-[10px] font-bold text-navy uppercase tracking-widest flex items-center gap-1">
                                            <Package className="w-3.5 h-3.5 text-gold" /> Stock Storage and 24 Hour Dispatch
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-charcoal/50 uppercase block mb-0.5">Pre Allocated Inventory Unit</label>
                                            <input className="w-full p-2 bg-white border border-navy/10 rounded text-xs" placeholder="e.g. Shirt #4 with deal plaque" value={selectedContact.allocated_inventory || ''} onChange={(e) => setSelectedContact({ ...selectedContact, allocated_inventory: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-charcoal/50 uppercase block mb-0.5">DPD Courier Tracking Label</label>
                                            <div className="flex gap-2">
                                                <input className="w-full p-2 bg-white border border-navy/10 rounded text-xs" placeholder="e.g. DPD-992019482" value={selectedContact.courier_tracking || ''} onChange={(e) => setSelectedContact({ ...selectedContact, courier_tracking: e.target.value })} />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const randomRef = `DPD-${Math.floor(10000000 + Math.random() * 90000000)}`;
                                                        setSelectedContact({ ...selectedContact, courier_tracking: randomRef });
                                                    }}
                                                    className="px-2 bg-navy text-white text-[10px] font-bold rounded"
                                                >
                                                    Gen
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block mb-1">Email Address</label>
                                        <input className="w-full p-2 bg-ivory border border-navy/10 rounded text-sm" value={selectedContact.contact_email} onChange={(e) => setSelectedContact({ ...selectedContact, contact_email: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block mb-1">Account Owner</label>
                                        <select className="w-full p-2 bg-ivory border border-navy/10 rounded text-sm font-bold text-navy" value={selectedContact.owner || 'Carl Spiller'}
                                            onChange={e => {
                                                const newOwner = e.target.value;
                                                if (handleOwnerChange(newOwner, selectedContact.owner)) {
                                                    setSelectedContact({ ...selectedContact, owner: newOwner });
                                                }
                                            }}
                                        >
                                            <option value="Carl Spiller">Carl Spiller</option>
                                            <option value="Rhys Barker">Rhys Barker</option>
                                            <option value="Unassigned">Unassigned</option>
                                        </select>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 space-y-2">
                                        <button
                                            onClick={() => openEmailModalForContact(selectedContact)}
                                            className="w-full bg-navy text-white p-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-navy/90 transition-colors shadow-sm"
                                        >
                                            <Mail className="w-4 h-4 text-gold" /> Compose Template Outreach
                                        </button>
                                        <button
                                            onClick={() => openInvoiceGeneratorForContact(selectedContact)}
                                            className="w-full bg-emerald-600 text-white p-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
                                        >
                                            <FileText className="w-4 h-4" /> Generate Pro Forma Invoice
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 border-t border-navy/5 flex gap-2">
                                <button onClick={handleUpdateContact} className="flex-1 bg-navy text-white text-sm font-bold py-3 rounded hover:bg-navy/90 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save Record</button>
                                <button onClick={() => handleDeleteContact(selectedContact.id)} className="bg-red-50 text-red-600 p-3 rounded hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className="flex-1 bg-ivory flex flex-col h-full overflow-hidden">
                            <div className="h-full flex flex-col">
                                <div className="p-6 border-b border-navy/5 flex justify-between items-center bg-white/50">
                                    <h3 className="font-serif text-xl text-navy">Activity and Notes</h3>
                                    <span className="text-xs font-mono text-charcoal/40">{selectedContact.notes?.length || 0} entries</span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {(!selectedContact.notes || selectedContact.notes.length === 0) && (
                                        <div className="text-center py-12 text-charcoal/30 italic">No notes logged yet.</div>
                                    )}
                                    {selectedContact.notes?.map((note, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-navy/5">
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
                                        <textarea placeholder="Type an update or note..." className="w-full p-4 pr-12 bg-ivory border border-navy/10 rounded-lg focus:outline-none focus:border-gold resize-none h-24 text-sm" value={newNote} onChange={(e) => setNewNote(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addNote(); } }} />
                                        <button onClick={addNote} disabled={!newNote.trim()} className="absolute right-3 bottom-3 p-2 bg-navy text-white rounded-md disabled:opacity-50 hover:bg-gold transition-colors"><Send className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setSelectedContact(null)} className="absolute top-4 right-4 z-50 bg-white shadow-md p-2 rounded-full text-navy hover:bg-red-50 hover:text-red-500 transition-colors pointer-events-auto"><X className="w-6 h-6" /></button>
                    </div>
                </div>
            )}

            {/* Email Blueprint Template Modal */}
            {isEmailModalOpen && emailModalContact && (
                <div
                    className="fixed inset-0 z-[2000] flex items-center justify-center bg-navy/60 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto"
                    onClick={() => setIsEmailModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-white/20 flex flex-col max-h-[85vh] my-auto relative shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-5 bg-navy text-white flex justify-between items-center shrink-0">
                            <div>
                                <div className="text-[10px] uppercase font-bold tracking-widest text-gold mb-1">Automated Merge Tag Outreach</div>
                                <h2 className="font-serif text-xl md:text-2xl">Cold Email Blueprints</h2>
                            </div>
                            <button
                                onClick={() => setIsEmailModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
                                title="Close Modal (Esc)"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-ivory">
                            {/* Blueprint Selector */}
                            <div>
                                <label className="text-[10px] font-bold text-navy uppercase tracking-widest block mb-2">Select Sector Blueprint</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {EMAIL_BLUEPRINTS.map(bp => (
                                        <button
                                            key={bp.id}
                                            type="button"
                                            onClick={() => setSelectedBlueprint(bp)}
                                            className={`p-3 rounded-lg border text-left transition-all ${selectedBlueprint.id === bp.id ? 'bg-navy text-white border-navy font-bold shadow-md' : 'bg-white text-charcoal border-navy/10 hover:border-gold'}`}
                                        >
                                            <div className="text-xs font-bold">{bp.name}</div>
                                            <div className="text-[10px] opacity-75 mt-1">{bp.sector}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Context */}
                            <div className="bg-white p-4 rounded-xl border border-navy/5 text-xs grid grid-cols-2 md:grid-cols-3 gap-3">
                                <div>
                                    <span className="text-charcoal/40 uppercase block text-[9px] font-bold">First Name</span>
                                    <span className="font-bold text-navy">{getFirstName(emailModalContact)}</span>
                                </div>
                                <div>
                                    <span className="text-charcoal/40 uppercase block text-[9px] font-bold">Company</span>
                                    <span className="font-bold text-navy">{emailModalContact.company_name || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-charcoal/40 uppercase block text-[9px] font-bold">Recent Deal / Milestone</span>
                                    <span className="font-bold text-navy">{emailModalContact.recent_deal || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Subject Field */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] font-bold text-navy uppercase tracking-widest">Merged Subject Line</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const subject = formatTemplateText(selectedBlueprint.subject, emailModalContact);
                                            navigator.clipboard.writeText(subject);
                                            setCopiedSubject(true);
                                            setTimeout(() => setCopiedSubject(false), 2000);
                                        }}
                                        className="text-xs font-bold text-gold hover:text-navy flex items-center gap-1"
                                    >
                                        {copiedSubject ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                        {copiedSubject ? 'Copied' : 'Copy Subject'}
                                    </button>
                                </div>
                                <input
                                    readOnly
                                    className="w-full p-3 bg-white border border-navy/10 rounded-lg text-sm font-semibold text-navy focus:outline-none"
                                    value={formatTemplateText(selectedBlueprint.subject, emailModalContact)}
                                />
                            </div>

                            {/* Body Field */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] font-bold text-navy uppercase tracking-widest">Merged Email Copy</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const body = formatTemplateText(selectedBlueprint.body, emailModalContact);
                                            navigator.clipboard.writeText(body);
                                            setCopiedBody(true);
                                            setTimeout(() => setCopiedBody(false), 2000);
                                        }}
                                        className="text-xs font-bold text-gold hover:text-navy flex items-center gap-1"
                                    >
                                        {copiedBody ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                        {copiedBody ? 'Copied' : 'Copy Body Text'}
                                    </button>
                                </div>
                                <textarea
                                    readOnly
                                    className="w-full p-4 bg-white border border-navy/10 rounded-lg text-sm font-sans text-charcoal leading-relaxed h-48 md:h-56 resize-none focus:outline-none"
                                    value={formatTemplateText(selectedBlueprint.body, emailModalContact)}
                                />
                            </div>
                        </div>

                        {/* Footer Action Bar */}
                        <div className="p-4 md:p-6 bg-white border-t border-navy/10 flex flex-col md:flex-row justify-between items-center gap-3 shrink-0">
                            <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                <button
                                    type="button"
                                    onClick={() => {
                                        updateContactStatus(emailModalContact.id, 'Cold Email Sent', `Sent ${selectedBlueprint.name} blueprint email.`);
                                        alert(`Status updated to 'Cold Email Sent' for ${emailModalContact.company_name}.`);
                                    }}
                                    className="px-3 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors"
                                >
                                    Mark Cold Email Sent
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        updateContactStatus(emailModalContact.id, 'Digital Mockup Sent', `Sent digital mockup for ${selectedBlueprint.name}.`);
                                        alert(`Status updated to 'Digital Mockup Sent' for ${emailModalContact.company_name}.`);
                                    }}
                                    className="px-3 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors"
                                >
                                    Mark Mockup Sent
                                </button>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsEmailModalOpen(false)}
                                    className="px-4 py-2.5 bg-gray-100 border border-gray-200 text-charcoal/70 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                                <a
                                    href={`mailto:${emailModalContact.contact_email || ''}?subject=${encodeURIComponent(formatTemplateText(selectedBlueprint.subject, emailModalContact))}&body=${encodeURIComponent(formatTemplateText(selectedBlueprint.body, emailModalContact))}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-navy text-white px-5 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-gold transition-all shadow-md"
                                >
                                    <ExternalLink className="w-4 h-4" /> Open Email Client
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/40 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setIsImportModalOpen(false)}>
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm relative border border-white/20" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setIsImportModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-charcoal/50" /></button>
                        <h2 className="font-serif text-xl text-navy mb-4">Import Corporate Prospects</h2>
                        <p className="text-sm text-charcoal/60 mb-6">Select account owner for imported rows.</p>

                        <div className="mb-6">
                            <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1 block">Assign To</label>
                            <select
                                className="w-full p-3 bg-ivory border border-navy/10 rounded focus:border-gold focus:outline-none font-medium text-navy"
                                value={importOwner}
                                onChange={(e) => setImportOwner(e.target.value)}
                            >
                                <option value="Carl Spiller">Carl Spiller</option>
                                <option value="Rhys Barker">Rhys Barker</option>
                                <option value="Unassigned">Unassigned</option>
                            </select>
                        </div>

                        <button onClick={() => fileInputRef.current?.click()} className="w-full bg-navy text-white py-3 rounded font-bold hover:bg-navy/90 transition-all flex items-center justify-center gap-2">
                            <Upload className="w-4 h-4" />
                            Select Excel or CSV File
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CRMPage;
