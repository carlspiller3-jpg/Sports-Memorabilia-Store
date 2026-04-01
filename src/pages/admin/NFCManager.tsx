import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { ShieldCheck, Plus, Image as ImageIcon, Loader2, Save, Trash2, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface Certificate {
    id: string
    created_at: string
    tag_id: string
    title: string
    date_signed: string
    location: string
    image_url: string
}

export function NFCManager() {
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showForm, setShowForm] = useState(false)

    // Form State
    const [formData, setFormData] = useState<Partial<Certificate>>({
        tag_id: '',
        title: '',
        date_signed: '',
        location: '',
        image_url: ''
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)

    useEffect(() => {
        fetchCertificates()
    }, [])

    async function fetchCertificates() {
        setLoading(true)
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .order('tag_id', { ascending: true })

        if (error) {
            console.error('Error fetching certificates:', error)
            alert('Could not load certificates')
        } else {
            setCertificates(data || [])
        }
        setLoading(false)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.tag_id || !formData.title) {
            alert("Tag ID and Title are required!")
            return
        }

        setSaving(true)
        try {
            let finalImageUrl = formData.image_url

            // Upload image if selected
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${formData.tag_id}-${Date.now()}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('certificates')
                    .upload(filePath, imageFile)

                if (uploadError) throw uploadError

                const { data: publicUrlData } = supabase.storage
                    .from('certificates')
                    .getPublicUrl(filePath)

                finalImageUrl = publicUrlData.publicUrl
            }

            const payload = {
                tag_id: formData.tag_id.toUpperCase(),
                title: formData.title,
                date_signed: formData.date_signed,
                location: formData.location,
                image_url: finalImageUrl
            }

            if (editingId) {
                // Update
                const { error } = await supabase
                    .from('certificates')
                    .update(payload)
                    .eq('id', editingId)
                if (error) throw error
            } else {
                // Insert
                const { error } = await supabase
                    .from('certificates')
                    .insert([payload])
                if (error) throw error
            }

            // Reset and fetch
            resetForm()
            fetchCertificates()
        } catch (error: any) {
            console.error('Submission error:', error)
            alert(error.message || 'Error saving certificate')
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (cert: Certificate) => {
        setEditingId(cert.id)
        setFormData({
            tag_id: cert.tag_id,
            title: cert.title,
            date_signed: cert.date_signed,
            location: cert.location,
            image_url: cert.image_url
        })
        setImagePreview(cert.image_url)
        setShowForm(true)
    }

    const handleDelete = async (id: string, tagId: string) => {
        if (!window.confirm(`Are you sure you want to delete certificate ${tagId}? The NFC scan will no longer work.`)) return

        try {
            const { error } = await supabase.from('certificates').delete().eq('id', id)
            if (error) throw error
            fetchCertificates()
        } catch (error) {
            console.error('Delete error', error)
            alert('Failed to delete')
        }
    }

    const resetForm = () => {
        setEditingId(null)
        setFormData({ tag_id: '', title: '', date_signed: '', location: '', image_url: '' })
        setImageFile(null)
        setImagePreview(null)
        setShowForm(false)
    }

    return (
        <div className="min-h-screen bg-stone/5 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
                            <ShieldCheck className="text-gold w-8 h-8" />
                            NFC Tag Manager
                        </h1>
                        <p className="text-navy/60 mt-1">Manage the digital certificates linked to your physical tags.</p>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)} className="bg-navy">
                        {showForm ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> Add New Tag</>}
                    </Button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-stone/20 animate-in fade-in slide-in-from-top-4">
                        <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Tag' : 'Register New Tag'}</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Left Col - Details */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-navy/70 mb-1">Tag ID (e.g., AAA-001)</label>
                                        <input
                                            type="text"
                                            value={formData.tag_id}
                                            onChange={e => setFormData({ ...formData, tag_id: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-md uppercase font-mono"
                                            placeholder="AAA-001"
                                            required
                                        />
                                        <p className="text-xs text-stone/50 mt-1">This must exactly match the ?tag_id= parameter on the NFC tag.</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-navy/70 mb-1">Product Title</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-md"
                                            placeholder="Liverpool 2005 Steven Gerrard Signed Shirt"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-navy/70 mb-1">Date Signed (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.date_signed}
                                            onChange={e => setFormData({ ...formData, date_signed: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-md"
                                            placeholder="May 2023"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-navy/70 mb-1">Location of Signing (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-md"
                                            placeholder="Liverpool, UK"
                                        />
                                    </div>
                                </div>

                                {/* Right Col - Image */}
                                <div>
                                    <label className="block text-sm font-medium text-navy/70 mb-1">Product Image</label>
                                    <div className="border-2 border-dashed border-stone/20 rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px] bg-stone/5 relative overflow-hidden group">
                                        
                                        {imagePreview ? (
                                            <div className="relative w-full h-full min-h-[250px] flex items-center justify-center">
                                                <img src={imagePreview} alt="Preview" className="max-h-[250px] object-contain rounded-md shadow-sm" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                                    <p className="text-white font-medium flex items-center gap-2">
                                                        <ImageIcon className="w-5 h-5" /> Change Image
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center p-6 shrink-0">
                                                <ImageIcon className="w-12 h-12 text-stone/30 mx-auto mb-3" />
                                                <p className="text-sm font-medium text-navy/60">Click to upload image</p>
                                                <p className="text-xs text-stone/50 mt-1">PNG, JPG up to 5MB</p>
                                            </div>
                                        )}
                                        
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-stone/10">
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                <Button type="submit" className="bg-gold hover:bg-gold/90 text-navy min-w-[120px]" disabled={saving}>
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Tag</>}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Certificates List */}
                <div className="bg-white rounded-lg shadow-md border border-stone/20 overflow-hidden">
                    <div className="p-4 border-b border-stone/10 bg-stone/5">
                        <h3 className="font-bold text-navy">Active NFC Tags ({certificates.length})</h3>
                    </div>
                    
                    {loading ? (
                        <div className="p-12 text-center text-stone/50">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                            Loading certificates...
                        </div>
                    ) : certificates.length === 0 ? (
                        <div className="p-12 text-center text-stone/50">
                            <ShieldCheck className="w-12 h-12 text-stone/20 mx-auto mb-4" />
                            <p>No tags registered yet. Create one to link to your physical NFC chips.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-stone/5 text-navy/70 border-b border-stone/10">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Image</th>
                                        <th className="px-4 py-3 font-medium">Tag ID</th>
                                        <th className="px-4 py-3 font-medium">Product Title</th>
                                        <th className="px-4 py-3 font-medium">Details</th>
                                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {certificates.map(cert => (
                                        <tr key={cert.id} className="border-b border-stone/10 hover:bg-stone/5 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="w-12 h-12 rounded-md overflow-hidden bg-stone/10 flex items-center justify-center">
                                                    {cert.image_url ? (
                                                        <img src={cert.image_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="w-5 h-5 text-stone/40" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-mono bg-navy/5 text-navy px-2 py-1 rounded border border-navy/10 font-bold">
                                                    {cert.tag_id}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-navy max-w-[250px] truncate" title={cert.title}>
                                                {cert.title}
                                            </td>
                                            <td className="px-4 py-3 text-navy/60">
                                                <span className="block truncate">{cert.date_signed || '-'}</span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <a href={`/verify?tag_id=${cert.tag_id}`} target="_blank" rel="noreferrer" className="p-2 text-stone/50 hover:text-navy transition-colors" title="Test Link">
                                                        <LinkIcon className="w-4 h-4" />
                                                    </a>
                                                    <button onClick={() => handleEdit(cert)} className="p-2 text-stone/50 hover:text-gold transition-colors" title="Edit">
                                                        <Save className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(cert.id, cert.tag_id)} className="p-2 text-stone/50 hover:text-red-500 transition-colors" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
