import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { FileSpreadsheet, Plus, Trash2, Download, RefreshCw, CheckCircle2 } from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export const InvoiceGeneratorTool: React.FC = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('$');

  const [fromCompany, setFromCompany] = useState('Acme Studio Inc.');
  const [fromAddress, setFromAddress] = useState('123 Innovation Way, Suite 400\nSan Francisco, CA 94107');

  const [toClient, setToClient] = useState('Client Corporation');
  const [toAddress, setToAddress] = useState('456 Market Street\nNew York, NY 10001');

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Web Application Development', quantity: 1, price: 2500 },
    { id: '2', description: 'UI/UX Design & Prototyping', quantity: 1, price: 1200 },
    { id: '3', description: 'Cloud Infrastructure Setup', quantity: 1, price: 650 },
  ]);

  const [taxPercent, setTaxPercent] = useState<number>(8.5);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [notes, setNotes] = useState('Payment is due within 30 days of invoice date. Thank you for your business!');

  const [isGenerating, setIsGenerating] = useState(false);

  const addItem = () => {
    setItems(prev => [
      ...prev,
      { id: `${Date.now()}`, description: 'New Service Item', quantity: 1, price: 100 }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, val: any) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const subtotal = items.reduce((acc, i) => acc + (i.quantity * i.price || 0), 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const total = Math.max(0, subtotal + taxAmount - discountAmount);

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4',
      });

      // Header
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(30, 41, 59);
      doc.text('INVOICE', 40, 50);

      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Invoice No: ${invoiceNumber}`, 40, 70);
      doc.text(`Date: ${invoiceDate}`, 40, 85);
      if (dueDate) doc.text(`Due Date: ${dueDate}`, 40, 100);

      // From & To
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text('From:', 40, 130);
      doc.text('Bill To:', 300, 130);

      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(fromCompany, 40, 145);
      const fromLines = fromAddress.split('\n');
      fromLines.forEach((line, idx) => doc.text(line, 40, 160 + idx * 14));

      doc.text(toClient, 300, 145);
      const toLines = toAddress.split('\n');
      toLines.forEach((line, idx) => doc.text(line, 300, 160 + idx * 14));

      // Table Header
      let y = 220;
      doc.setFillColor(241, 245, 249);
      doc.rect(40, y, 515, 24, 'F');

      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text('Description', 50, y + 16);
      doc.text('Qty', 350, y + 16);
      doc.text('Unit Price', 420, y + 16);
      doc.text('Amount', 490, y + 16);

      y += 30;
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(30, 41, 59);

      items.forEach(item => {
        doc.text(item.description, 50, y);
        doc.text(String(item.quantity), 350, y);
        doc.text(`${currency}${item.price.toFixed(2)}`, 420, y);
        doc.text(`${currency}${(item.quantity * item.price).toFixed(2)}`, 490, y);
        y += 22;
      });

      // Totals
      y += 20;
      doc.setDrawColor(226, 232, 240);
      doc.line(320, y, 555, y);
      y += 18;

      doc.text('Subtotal:', 350, y);
      doc.text(`${currency}${subtotal.toFixed(2)}`, 490, y);
      y += 16;

      if (taxPercent > 0) {
        doc.text(`Tax (${taxPercent}%):`, 350, y);
        doc.text(`${currency}${taxAmount.toFixed(2)}`, 490, y);
        y += 16;
      }

      if (discountAmount > 0) {
        doc.text('Discount:', 350, y);
        doc.text(`-${currency}${discountAmount.toFixed(2)}`, 490, y);
        y += 16;
      }

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Total Due:', 350, y + 4);
      doc.text(`${currency}${total.toFixed(2)}`, 490, y + 4);

      // Notes
      if (notes) {
        y += 50;
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text('Notes / Payment Instructions:', 40, y);
        doc.setFont('Helvetica', 'normal');
        doc.text(notes, 40, y + 15, { maxWidth: 515 });
      }

      doc.save(`${invoiceNumber.toLowerCase()}.pdf`);
    } catch (err: any) {
      console.error(err);
      alert('Failed to generate invoice PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
      {/* Top Invoice Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Invoice Number</label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={e => setInvoiceNumber(e.target.value)}
            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Invoice Date</label>
          <input
            type="date"
            value={invoiceDate}
            onChange={e => setInvoiceDate(e.target.value)}
            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Currency Symbol</label>
          <input
            type="text"
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-center"
          />
        </div>
      </div>

      {/* From & Bill To */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">Your Business / Sender</span>
          <input
            type="text"
            value={fromCompany}
            onChange={e => setFromCompany(e.target.value)}
            placeholder="Company Name"
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
          />
          <textarea
            value={fromAddress}
            onChange={e => setFromAddress(e.target.value)}
            rows={2}
            placeholder="Address, Phone, Tax ID"
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
          />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">Bill To / Client</span>
          <input
            type="text"
            value={toClient}
            onChange={e => setToClient(e.target.value)}
            placeholder="Client Name"
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
          />
          <textarea
            value={toAddress}
            onChange={e => setToAddress(e.target.value)}
            rows={2}
            placeholder="Client Address, Email"
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Line Items</span>
          <button
            onClick={addItem}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg hover:bg-blue-100 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <input
                type="text"
                value={item.description}
                onChange={e => updateItem(item.id, 'description', e.target.value)}
                placeholder="Item description"
                className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-xs"
              />
              <div className="w-20">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                  placeholder="Qty"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-center font-bold"
                />
              </div>
              <div className="w-28">
                <input
                  type="number"
                  min="0"
                  value={item.price}
                  onChange={e => updateItem(item.id, 'price', Number(e.target.value))}
                  placeholder="Rate"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-center font-bold"
                />
              </div>
              <div className="w-24 text-right font-bold text-xs text-slate-800 pr-2">
                {currency}{(item.quantity * item.price).toFixed(2)}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                disabled={items.length <= 1}
                className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-20 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Totals & Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start pt-4 border-t border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Terms</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
          />
        </div>

        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Subtotal:</span>
            <span className="font-bold text-slate-800">{currency}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Tax Rate (%):</span>
            <input
              type="number"
              value={taxPercent}
              onChange={e => setTaxPercent(Number(e.target.value))}
              className="w-16 p-1 text-center bg-white border border-slate-300 rounded font-bold"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Discount ({currency}):</span>
            <input
              type="number"
              value={discountAmount}
              onChange={e => setDiscountAmount(Number(e.target.value))}
              className="w-20 p-1 text-center bg-white border border-slate-300 rounded font-bold"
            />
          </div>
          <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
            <span>Total Due:</span>
            <span className="text-xl text-blue-600">{currency}{total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Invoice PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
