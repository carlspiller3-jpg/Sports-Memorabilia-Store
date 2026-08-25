import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Download, Plus, Trash2, FileText, DollarSign, Calendar, User, Hash, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
}

export type InvoiceType = 'PRO_FORMA' | 'STANDARD';

interface InvoiceData {
    invoiceNumber: string;
    invoiceType: InvoiceType;
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
    vatRate: number;
}

export function InvoiceGenerator() {
    const [data, setData] = useState<InvoiceData>({
        invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        invoiceType: 'PRO_FORMA',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        clientName: '',
        clientCompany: '',
        clientAddress: '',
        clientEmail: '',
        items: [{ id: '1', description: 'Corporate Sports Memorabilia Package with Custom Plaque', quantity: 1, rate: 10000 }],
        notes: 'Pro forma invoice issued for corporate order allocation. Payment due prior to 24 hour courier dispatch.',
        bankAccountName: 'Sports Memorabilia Store Limited',
        bankAccountNumber: '57113499',
        bankSortCode: '23-05-80',
        currency: 'GBP',
        vatRate: 0
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const clientName = params.get('clientName');
        const clientCompany = params.get('clientCompany');
        const clientEmail = params.get('clientEmail');
        const invoiceType = params.get('invoiceType') as InvoiceType | null;

        if (clientName || clientCompany || clientEmail || invoiceType) {
            setData(prev => ({
                ...prev,
                clientName: clientName || prev.clientName,
                clientCompany: clientCompany || prev.clientCompany,
                clientEmail: clientEmail || prev.clientEmail,
                invoiceType: invoiceType || prev.invoiceType,
                items: prev.items.length === 1 && prev.items[0].rate === 10000 ? [
                    { id: '1', description: `Corporate Memorabilia Package (${clientCompany || 'Corporate Client'})`, quantity: 1, rate: 10000 }
                ] : prev.items
            }));
        }
    }, []);

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

    const calculateVAT = () => {
        return calculateSubtotal() * (data.vatRate / 100);
    };

    const calculateGrandTotal = () => {
        return calculateSubtotal() + calculateVAT();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: data.currency }).format(amount);
    };

    const getInvoiceTitle = () => {
        if (data.invoiceType === 'PRO_FORMA') return 'PRO FORMA INVOICE';
        return 'INVOICE';
    };

    const downloadWordDoc = () => {
        const subtotal = calculateSubtotal();
        const vat = calculateVAT();
        const grandTotal = calculateGrandTotal();
        const invoiceTitle = getInvoiceTitle();

        const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>${invoiceTitle} ${data.invoiceNumber}</title>
            <style>
                body { font-family: 'Arial', sans-serif; font-size: 11pt; color: #333; line-height: 1.5; }
                table { border-collapse: collapse; width: 100%; }
                td, th { padding: 8px; text-align: left; vertical-align: top; }
                .header-container { margin-bottom: 40px; border-bottom: 2px solid #1c273a; padding-bottom: 20px; }
                .invoice-title { font-size: 22pt; font-weight: bold; color: #1c273a; text-transform: uppercase; float: right; text-align: right; }
                .company-name { font-size: 18pt; font-weight: bold; color: #c6a664; margin-bottom: 5px; }
                .company-details { color: #555; font-size: 10pt; line-height: 1.4; }
                .info-label { font-weight: bold; color: #666; font-size: 9pt; text-transform: uppercase; }
                .items-table th { background-color: #1c273a; color: white; font-weight: bold; padding: 10px; }
                .items-table td { border-bottom: 1px solid #eee; padding: 10px; }
                .total-section { float: right; width: 340px; margin-top: 20px; }
                .total-row td { border-top: 2px solid #1c273a; font-weight: bold; font-size: 14pt; color: #1c273a; }
                .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; font-size: 9pt; color: #888; text-align: center; }
                .logo-img { max-height: 80px; margin-bottom: 15px; }
            </style>
        </head>
        <body>
            <div class="header-container">
                <table style="width: 100%;">
                    <tr>
                        <td style="width: 55%;">
                             <img src="https://sportssigned.com/logo.jpg" class="logo-img" width="150" alt="Sports Memorabilia Store" />
                             <div class="company-name">Sports Memorabilia Store Limited</div>
                             <div class="company-details">
                                189 Greenwood, Walters Ash<br>
                                Buckinghamshire, HP14 4XF<br>
                                UK<br>
                                Email: info@sportssigned.com
                             </div>
                        </td>
                        <td style="width: 45%; text-align: right; vertical-align: top;">
                            <div class="invoice-title">${invoiceTitle}</div>
                        </td>
                    </tr>
                </table>
            </div>

            <table style="margin-bottom: 40px;">
                <tr>
                    <td width="50%">
                        <div class="info-label">Issued To</div>
                        <div style="font-size: 12pt; font-weight: bold; margin-top: 5px;">${data.clientName || 'Valued Corporate Client'}</div>
                        <div>${data.clientCompany}</div>
                        <div>${data.clientAddress.replace(/\n/g, '<br>')}</div>
                        <div>${data.clientEmail}</div>
                    </td>
                    <td width="50%" style="text-align: right;">
                        <table style="width: auto; float: right;">
                            <tr>
                                <td class="info-label" style="text-align: right;">Reference #</td>
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
                    ${vat > 0 ? `
                    <tr>
                        <td style="text-align: right; padding-right: 20px;">VAT (${data.vatRate}%)</td>
                        <td style="text-align: right;">${formatCurrency(vat)}</td>
                    </tr>
                    ` : ''}
                    <tr class="total-row">
                        <td style="text-align: right; padding-right: 20px;">Total Payable</td>
                        <td style="text-align: right;">${formatCurrency(grandTotal)}</td>
                    </tr>
                </table>
            </div>

            <div style="clear: both; margin-top: 50px;">
                <div class="info-label">Payment Methods and Bank Transfer</div>
                <div style="margin-top: 10px; padding: 15px; background-color: #f9f7f3; border: 1px solid #eee;">
                    <strong>Direct Bank Transfer</strong><br>
                    Account Name: ${data.bankAccountName}<br>
                    Sort Code: ${data.bankSortCode}<br>
                    Account No: ${data.bankAccountNumber}<br>
                    Reference: ${data.invoiceNumber} (${data.clientCompany || 'Corporate Order'})
                </div>
            </div>

            <div style="margin-top: 25px;">
                <div class="info-label">Terms and Order Notes</div>
                <div style="margin-top: 5px; font-size: 10pt; color: #444;">${data.notes}</div>
            </div>

            <div class="footer">
                Sports Memorabilia Store Limited. Thank you for your business.
            </div>
        </body>
        </html>
        `;

        const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.invoiceType === 'PRO_FORMA' ? 'Pro-Forma-Invoice' : 'Invoice'}-${data.invoiceNumber}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-ivory text-charcoal pt-36 pb-12 px-4 md:px-12">
            <Helmet>
                <title>Invoice Generator | Admin</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-navy/10 pb-6">
                    <div className="flex items-center gap-4">
                        <Link to="/admin" className="p-2 hover:bg-stone/20 rounded-full text-navy/60 transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="font-serif text-3xl text-navy">Invoice Generator</h1>
                            <p className="text-charcoal/60 mt-1 text-sm">Issue pro forma invoices and custom order documentation.</p>
                        </div>
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
                        {/* Invoice Type Selector */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-navy/5">
                            <h2 className="font-serif text-lg text-navy mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gold" /> Invoice Format
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                                <button
                                    type="button"
                                    onClick={() => setData({ ...data, invoiceType: 'PRO_FORMA' })}
                                    className={`p-3 rounded-lg border text-left transition-all ${data.invoiceType === 'PRO_FORMA' ? 'bg-navy text-white border-navy font-bold shadow' : 'bg-ivory text-charcoal border-navy/10 hover:border-gold'}`}
                                >
                                    <div className="text-xs uppercase tracking-wider font-bold">Pro Forma Invoice</div>
                                    <div className="text-[11px] opacity-80 mt-1">Pre order pro forma billing</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData({ ...data, invoiceType: 'STANDARD' })}
                                    className={`p-3 rounded-lg border text-left transition-all ${data.invoiceType === 'STANDARD' ? 'bg-navy text-white border-navy font-bold shadow' : 'bg-ivory text-charcoal border-navy/10 hover:border-gold'}`}
                                >
                                    <div className="text-xs uppercase tracking-wider font-bold">Standard Invoice</div>
                                    <div className="text-[11px] opacity-80 mt-1">Final tax invoice</div>
                                </button>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-navy/5">
                            <h2 className="font-serif text-lg text-navy mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gold" /> Invoice Details
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block mb-1">Reference #</label>
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

                    {/* Items and Preview */}
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

                            <div className="mt-6 pt-6 border-t border-navy/5 space-y-2">
                                <div className="flex justify-between items-center text-sm text-charcoal/70">
                                    <span>Total Amount:</span>
                                    <span className="font-bold text-navy text-lg">{formatCurrency(calculateGrandTotal())}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-navy/5">
                            <h2 className="font-serif text-lg text-navy mb-3">Order Terms and Notes</h2>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData({ ...data, notes: e.target.value })}
                                className="w-full p-3 bg-ivory border border-navy/10 rounded-lg text-sm h-28 resize-none focus:outline-none focus:border-gold"
                                placeholder="Add payment instructions, delivery lead times, or courier dispatch terms..."
                            />
                        </div>

                        <div className="bg-navy/5 rounded-xl p-6 border border-navy/10 text-center">
                            <p className="text-charcoal/60 text-sm mb-4">
                                Ready to generate? This will create a <strong>.doc</strong> file formatted as a corporate pro forma invoice.
                            </p>
                            <button
                                onClick={downloadWordDoc}
                                className="w-full bg-navy text-white font-bold py-4 rounded-lg shadow-md hover:bg-gold transition-all"
                            >
                                Download Pro Forma Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvoiceGenerator;
