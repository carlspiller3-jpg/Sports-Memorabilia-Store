import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Download, Plus, Trash2, FileText, DollarSign, Calendar, User, Hash } from 'lucide-react';


interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
}

interface InvoiceData {
    invoiceNumber: string;
    date: string;
    dueDate: string;
    clientName: string;
    clientCompany: string;
    clientAddress: string;
    clientEmail: string;
    items: InvoiceItem[];
    notes: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankSortCode: string;
    currency: string;
}

export function InvoiceGenerator() {
    const [data, setData] = useState<InvoiceData>({
        invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        clientName: '',
        clientCompany: '',
        clientAddress: '',
        clientEmail: '',
        items: [{ id: '1', description: 'Consulting Services', quantity: 1, rate: 0 }],
        notes: 'Thank you for your business.',
        bankAccountName: 'Sports Memorabilia Ltd',
        bankAccountNumber: '',
        bankSortCode: '',
        currency: 'GBP'
    });

    const addItem = () => {
        setData({
            ...data,
            items: [...data.items, { id: crypto.randomUUID(), description: '', quantity: 1, rate: 0 }]
        });
    };

    const removeItem = (id: string) => {
        setData({
            ...data,
            items: data.items.filter(item => item.id !== id)
        });
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
        setData({
            ...data,
            items: data.items.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        });
    };

    const calculateSubtotal = () => {
        return data.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: data.currency }).format(amount);
    };

    const downloadWordDoc = () => {
        const subtotal = calculateSubtotal();
        const total = subtotal; // Add tax logic if needed

        const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>Invoice ${data.invoiceNumber}</title>
            <style>
                body { font-family: 'Arial', sans-serif; font-size: 11pt; color: #333; line-height: 1.5; }
                table { border-collapse: collapse; width: 100%; }
                td, th { padding: 8px; text-align: left; vertical-align: top; }
                .header-container { margin-bottom: 40px; border-bottom: 2px solid #1c273a; padding-bottom: 20px; }
                .invoice-title { font-size: 28pt; font-weight: bold; color: #1c273a; text-transform: uppercase; float: right; }
                .company-name { font-size: 18pt; font-weight: bold; color: #c6a664; margin-bottom: 10px; }
                .info-label { font-weight: bold; color: #666; font-size: 9pt; text-transform: uppercase; }
                .items-table th { background-color: #1c273a; color: white; font-weight: bold; padding: 10px; }
                .items-table td { border-bottom: 1px solid #eee; padding: 10px; }
                .total-section { float: right; width: 300px; margin-top: 20px; }
                .total-row td { border-top: 2px solid #1c273a; font-weight: bold; font-size: 14pt; color: #1c273a; }
                .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; font-size: 9pt; color: #888; text-align: center; }
            </style>
        </head>
        <body>
            <div class="header-container">
                <span class="invoice-title">INVOICE</span>
                <div class="company-name">Sports Memorabilia Store</div>
                <div>London, UK</div>
                <div>contact@sportssigned.com</div>
            </div>

            <table style="margin-bottom: 40px;">
                <tr>
                    <td width="50%">
                        <div class="info-label">Current To</div>
                        <div style="font-size: 12pt; font-weight: bold; margin-top: 5px;">${data.clientName || 'Valued Client'}</div>
                        <div>${data.clientCompany}</div>
                        <div>${data.clientAddress.replace(/\n/g, '<br>')}</div>
                        <div>${data.clientEmail}</div>
                    </td>
                    <td width="50%" style="text-align: right;">
                        <table style="width: auto; float: right;">
                            <tr>
                                <td class="info-label" style="text-align: right;">Invoice #</td>
                                <td style="font-weight: bold; text-align: right;">${data.invoiceNumber}</td>
                            </tr>
                            <tr>
                                <td class="info-label" style="text-align: right;">Date</td>
                                <td style="text-align: right;">${data.date}</td>
                            </tr>
                            <tr>
                                <td class="info-label" style="text-align: right;">Due Date</td>
                                <td style="text-align: right;">${data.dueDate}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table class="items-table">
                <thead>
                    <tr>
                        <th width="50%">Description</th>
                        <th width="15%" style="text-align: center;">Quantity</th>
                        <th width="15%" style="text-align: right;">Price</th>
                        <th width="20%" style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.items.map(item => `
                        <tr>
                            <td>${item.description}</td>
                            <td style="text-align: center;">${item.quantity}</td>
                            <td style="text-align: right;">${formatCurrency(item.rate)}</td>
                            <td style="text-align: right;">${formatCurrency(item.quantity * item.rate)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="total-section">
                <table>
                    <tr>
                        <td style="text-align: right; padding-right: 20px;">Subtotal</td>
                        <td style="text-align: right;">${formatCurrency(subtotal)}</td>
                    </tr>
                    <tr class="total-row">
                        <td style="text-align: right; padding-right: 20px;">Total</td>
                        <td style="text-align: right;">${formatCurrency(total)}</td>
                    </tr>
                </table>
            </div>
            
            <div style="clear: both; margin-top: 60px;">
                <div class="info-label">Payment Methods</div>
                <div style="margin-top: 10px; padding: 15px; background-color: #f9f7f3; border: 1px solid #eee;">
                    <strong>Bank Transfer</strong><br>
                    Account Name: ${data.bankAccountName}<br>
                    Sort Code: ${data.bankSortCode}<br>
                    Account No: ${data.bankAccountNumber}
                </div>
            </div>

            <div style="margin-top: 30px;">
                <div class="info-label">Notes</div>
                <div style="margin-top: 5px;">${data.notes}</div>
            </div>

            <div class="footer">
                Thank you for your business.
            </div>
        </body>
        </html>
        `;

        const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoice-${data.invoiceNumber}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-ivory text-charcoal pt-24 pb-12 px-4 md:px-12">
            <Helmet>
                <title>Invoice Generator | Admin</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="font-serif text-3xl text-navy">Invoice Generator</h1>
                        <p className="text-charcoal/60">Manage and export professional invoices.</p>
                    </div>
                    <button
                        onClick={downloadWordDoc}
                        className="bg-navy text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-navy/90 transition-all shadow-lg shadow-navy/20"
                    >
                        <Download className="w-5 h-5" />
                        Download Word Doc
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-navy/5">
                            <h2 className="font-serif text-lg text-navy mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gold" /> Invoice Details
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block mb-1">Invoice #</label>
                                    <div className="flex items-center gap-2 bg-ivory border border-navy/10 rounded-lg p-2">
                                        <Hash className="w-4 h-4 text-charcoal/30" />
                                        <input
                                            value={data.invoiceNumber}
                                            onChange={(e) => setData({ ...data, invoiceNumber: e.target.value })}
                                            className="bg-transparent w-full text-sm focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block mb-1">Date</label>
                                    <div className="flex items-center gap-2 bg-ivory border border-navy/10 rounded-lg p-2">
                                        <Calendar className="w-4 h-4 text-charcoal/30" />
                                        <input
                                            type="date"
                                            value={data.date}
                                            onChange={(e) => setData({ ...data, date: e.target.value })}
                                            className="bg-transparent w-full text-sm focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Client Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-navy/5">
                            <h2 className="font-serif text-lg text-navy mb-4 flex items-center gap-2">
                                <User className="w-4 h-4 text-gold" /> Client Information
                            </h2>
                            <div className="space-y-4">
                                <input
                                    placeholder="Client Name"
                                    value={data.clientName}
                                    onChange={(e) => setData({ ...data, clientName: e.target.value })}
                                    className="w-full p-2 bg-ivory border border-navy/10 rounded text-sm"
                                />
                                <input
                                    placeholder="Company Name"
                                    value={data.clientCompany}
                                    onChange={(e) => setData({ ...data, clientCompany: e.target.value })}
                                    className="w-full p-2 bg-ivory border border-navy/10 rounded text-sm"
                                />
                                <textarea
                                    placeholder="Address"
                                    value={data.clientAddress}
                                    onChange={(e) => setData({ ...data, clientAddress: e.target.value })}
                                    className="w-full p-2 bg-ivory border border-navy/10 rounded text-sm h-20 resize-none"
                                />
                                <input
                                    placeholder="Email Address"
                                    value={data.clientEmail}
                                    onChange={(e) => setData({ ...data, clientEmail: e.target.value })}
                                    className="w-full p-2 bg-ivory border border-navy/10 rounded text-sm"
                                />
                            </div>
                        </div>

                        {/* Bank Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-navy/5">
                            <h2 className="font-serif text-lg text-navy mb-4 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-gold" /> Banking Details
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Bank Name"
                                    value={data.bankAccountName}
                                    onChange={(e) => setData({ ...data, bankAccountName: e.target.value })}
                                    className="w-full p-2 bg-ivory border border-navy/10 rounded text-sm col-span-2"
                                />
                                <input
                                    placeholder="Sort Code"
                                    value={data.bankSortCode}
                                    onChange={(e) => setData({ ...data, bankSortCode: e.target.value })}
                                    className="w-full p-2 bg-ivory border border-navy/10 rounded text-sm"
                                />
                                <input
                                    placeholder="Account Number"
                                    value={data.bankAccountNumber}
                                    onChange={(e) => setData({ ...data, bankAccountNumber: e.target.value })}
                                    className="w-full p-2 bg-ivory border border-navy/10 rounded text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items & Preview */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-navy/5">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-serif text-lg text-navy">Line Items</h2>
                                <button onClick={addItem} className="text-gold text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:text-navy transition-colors">
                                    <Plus className="w-3 h-3" /> Add Item
                                </button>
                            </div>

                            <div className="space-y-3">
                                {data.items.map((item) => (
                                    <div key={item.id} className="flex gap-2 items-start bg-ivory p-3 rounded-lg border border-navy/5 group">
                                        <div className="flex-1 space-y-2">
                                            <input
                                                placeholder="Description of service or product"
                                                value={item.description}
                                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                className="w-full bg-transparent font-medium text-sm focus:outline-none placeholder:text-charcoal/30"
                                            />
                                            <div className="flex gap-4">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[10px] font-bold text-charcoal/40 uppercase">Qty</span>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                                                        className="w-16 bg-white border border-navy/10 rounded px-2 py-1 text-xs"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[10px] font-bold text-charcoal/40 uppercase">Price</span>
                                                    <input
                                                        type="number"
                                                        value={item.rate}
                                                        onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                                                        className="w-24 bg-white border border-navy/10 rounded px-2 py-1 text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono font-bold text-navy text-sm">
                                                {formatCurrency(item.quantity * item.rate)}
                                            </div>
                                            <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 mt-2">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-navy/5 flex justify-end">
                                <div className="text-right">
                                    <div className="text-sm text-charcoal/60 mb-1">Total Amount</div>
                                    <div className="font-serif text-3xl text-navy">{formatCurrency(calculateSubtotal())}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-navy/5 rounded-xl p-6 border border-navy/10 text-center">
                            <p className="text-charcoal/60 text-sm mb-4">
                                Ready to generate? This will create a <strong>.doc</strong> file compatible with Microsoft Word.
                            </p>
                            <button
                                onClick={downloadWordDoc}
                                className="w-full bg-white border border-navy/10 text-navy font-bold py-3 rounded-lg shadow-sm hover:bg-gold hover:text-white hover:border-gold transition-all"
                            >
                                Download Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvoiceGenerator;
