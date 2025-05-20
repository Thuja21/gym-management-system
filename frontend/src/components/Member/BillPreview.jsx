import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Path to the uploaded logo
import logo from '../../assets/images/logo.png';

const GYM_INFO = {
    name: 'JK FITNESS',
    tagline: 'Where Passion Sparks Progress',
    address: 'Sarayadi,PointPedro',
    contact: '077 529 8455',
    email: 'jkfitnessppt@gmail.com'
};

const TABLE_HEAD = [
    'Date Of Service',
    'Description',
    'Hours',
    'Rate',
    'Amount'
];

const Bill = ({ memberDetails, planDetails, paymentDetails }) => {
    const [showToast, setShowToast] = useState(false);
    const downloadTimeout = useRef();

    const paymentDate = new Date(paymentDetails?.date || Date.now());

    const formatDate = d => {
        const date = new Date(d);
        return date.toLocaleDateString('en-GB');
    };

    const generatePDF = () => {
        try {
            // Initialize jsPDF with smaller page size (A5 instead of A4)
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a5',  // Changed from A4 to A5 for smaller page size
                hotfixes: ['px_scaling'],
                compress: true
            });

            // Get page dimensions for better spacing calculations
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 30;
            let y = margin + 5; // Start a bit lower from the top

            // Set default font
            doc.setFont('helvetica');
            doc.setFontSize(9);

            // Calculate content height to better distribute space
            const estimatedContentHeight = 330; // Reduced estimate to create more spacing between elements
            const availableHeight = pageHeight - 2 * margin;

            // Spacing factor to distribute content more evenly (higher = more space between elements)
            const spacingFactor = Math.min(1.4, availableHeight / estimatedContentHeight); // Increased spacing factor

            // Logo on top right (slightly smaller)
            if (logo) {
                doc.addImage(logo, 'PNG', pageWidth - margin - 38, y, 38, 38);
            }

            // Invoice title (top left)
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text('INVOICE', margin, y + 15);

            // Invoice details (below title with more space)
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(`Invoice #: ${paymentDetails.payment_id}`, margin, y + 34);
            doc.text(`Date: ${formatDate(paymentDate)}`, margin, y + 48);

            // Gym info (below logo, right-aligned)
            doc.setTextColor(100, 100, 100);
            doc.text(GYM_INFO.name, pageWidth - margin - 42, y + 52, { align: 'right' });

            // Format address more compactly
            const addressParts = GYM_INFO.address.split(',');
            const formattedAddress = addressParts.length > 1
                ? addressParts[0].trim() + ', ' + addressParts[1].trim()
                : addressParts[0].trim();

            doc.text(formattedAddress, pageWidth - margin - 42, y + 67, { align: 'right' });
            doc.text(`${GYM_INFO.contact} | ${GYM_INFO.email}`, pageWidth - margin - 42, y + 82, { align: 'right' });

            // Add more space after header
            y += 95;

            // Divider line
            doc.setDrawColor(200, 200, 200);
            doc.line(margin, y, pageWidth - margin, y);
            y += 18; // More space after divider

            // Bill To section (with more spacing)
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            doc.text('Bill To:', margin, y);
            doc.setFont('helvetica', 'normal');
            doc.text(memberDetails.fullname, margin + 45, y);
            doc.text(memberDetails.email, margin + 45, y + 16);
            doc.text(memberDetails.contactNo, margin + 45, y + 32);
            y += 45; // More space before table

            // Table with more generous styling
            autoTable(doc, {
                startY: y,
                margin: { left: margin, right: margin },
                head: [['Date', 'Plan Name', 'Duration', 'Amount']], // Changed table headers to be more suitable for plan purchase
                body: [[
                    formatDate(paymentDate),
                    planDetails.plan_name,
                    planDetails.plan_duration || '-', // Use plan duration instead of hours
                    `Rs.${Number(planDetails.plan_price).toFixed(2)}`
                ]],
                theme: 'grid',
                headStyles: {
                    fillColor: [245, 245, 245],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                    fontSize: 8,
                    cellPadding: 5  // More padding for better readability
                },
                bodyStyles: {
                    fontSize: 8,
                    cellPadding: 5,  // More padding
                    lineWidth: 0.1
                },
                columnStyles: {
                    0: { cellWidth: 80, halign: 'left' },
                    1: { cellWidth: 'auto', halign: 'left' },
                    2: { cellWidth: 70, halign: 'center' },
                    3: { cellWidth: 70, halign: 'right' }
                },
                styles: {
                    lineColor: [200, 200, 200],
                    lineWidth: 0.2
                }
            });

            let afterTableY = doc.lastAutoTable?.finalY || y + 40;
            afterTableY += 15;  // More space after table

            // Totals section (increased spacing)
            const totalsRight = pageWidth - margin;
            const totalsLeft = totalsRight - 100;

            doc.setFontSize(8);
            doc.text('Subtotal:', totalsLeft, afterTableY);
            doc.text(`Rs.${Number(planDetails.plan_price).toFixed(2)}`, totalsRight, afterTableY, { align: 'right' });

            doc.text('Tax:', totalsLeft, afterTableY + 15); // Increased spacing
            doc.text('Rs.0.00', totalsRight, afterTableY + 15, { align: 'right' });

            doc.setFont('helvetica', 'bold');
            doc.text('Total:', totalsLeft, afterTableY + 32); // Increased spacing
            doc.text(`Rs.${Number(planDetails.plan_price).toFixed(2)}`, totalsRight, afterTableY + 32, { align: 'right' });

            // Calculate remaining space and place terms at bottom of page
            const footerSectionY = pageHeight - margin - 45; // Position for the footer text
            const termsY = pageHeight - margin - 230; // Position terms closer to bottom

            // Terms and conditions at bottom of page
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.text('Terms and Conditions:', margin, termsY);
            doc.setFont('helvetica', 'normal');
            doc.text('Payment is due immediately. No refunds after activation.', margin + 90, termsY);

            doc.setFont('helvetica', 'bold');
            doc.text('Payment Method:', margin, termsY + 15); // Increased spacing
            doc.setFont('helvetica', 'normal');
            doc.text(`ID: ${paymentDetails.payment_id}`, margin + 90, termsY + 15);

            // Footer (centered at the bottom)
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(8);
            doc.text('Thank You For Your Business', pageWidth / 2, footerSectionY, { align: 'center' });

            // // Signature line (right-aligned, at bottom)
            // doc.setFont('helvetica', 'normal');
            // doc.line(totalsRight - 70, footerSectionY - 15, totalsRight, footerSectionY - 15);
            // doc.text('Authorized Signature', totalsRight - 35, footerSectionY - 5, { align: 'center' });

            // Save PDF with optimized filename
            doc.save(`Invoice_${memberDetails.username}_${paymentDetails.payment_id.slice(-6)}.pdf`);
            setShowToast(true);
            if (downloadTimeout.current) clearTimeout(downloadTimeout.current);
            downloadTimeout.current = setTimeout(() => setShowToast(false), 2200);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    return (
        <div className="bg-white  rounded-xl shadow-sm max-w-2xl mx-auto mt-10 px-8 py-10 border border-gray-200 relative overflow-visible">
            <div className="flex flex-row justify-between">
                <div>
                    <div className="font-bold text-3xl text-gray-900 mb-2 tracking-tight text-left">INVOICE</div>
                    <div className="mb-1 flex items-center ">
                        <span className="font-medium ">Invoice #&nbsp;</span>
                        <span className="border px-2 ml-2 text-gray-700">{paymentDetails.payment_id}</span>
                    </div>
                    <div className="mb-4 flex items-center">
                        <span className="font-medium">Invoice Date&nbsp;</span>
                        <span className="border px-2 ml-2 text-gray-700">{formatDate(paymentDate)}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <img src={logo} alt="Gym Logo" className="w-16 h-16 rounded-full border border-gray-400 mb-1" />
                    <div className="font-bold">{GYM_INFO.name}</div>
                    <div className="text-sm text-gray-500">{GYM_INFO.address}</div>
                    <div className="text-sm text-gray-500">{GYM_INFO.contact}</div>
                </div>
            </div>
            <hr className="my-6" />
            <div className="mb-6">
                <div className="flex">
                    <div className="text-sm font-bold w-12">Bill To:</div>
                    <div className="ml-8 text-left">
                        <div className="text-[15px]">{memberDetails.fullname}</div>
                        <div className="text-[15px] mt-1">{memberDetails.email}</div>
                        <div className="text-[15px] mt-1">{memberDetails.contactNo}</div>
                    </div>
                </div>
            </div>
            <table className="w-full text-left border border-gray-300 mb-7">
                <thead>
                <tr className="bg-gray-100 text-black text-sm">
                    <th className="py-1 px-2 text-left font-bold border-b border-gray-200 w-20">Date</th>
                    <th className="py-1 px-2 text-left font-bold border-b border-gray-200">Plan Name</th>
                    <th className="py-1 px-2 text-center font-bold border-b border-gray-200 w-16">Duration</th>
                    <th className="py-1 px-2 text-right font-bold border-b border-gray-200 w-20">Amount</th>
                </tr>
                </thead>
                <tbody className="text-gray-800 text-sm ">
                <tr>
                    <td className="py-1 px-2 border-b border-gray-200">{formatDate(paymentDate)}</td>
                    <td className="py-1 px-2 border-b border-gray-200">{planDetails.plan_name}</td>
                    <td className="py-1 px-2 text-center border-b border-gray-200">{planDetails.plan_duration}</td>
                    <td className="py-2 px-2 text-right">Rs.{planDetails.plan_price}</td>
                </tr>
                </tbody>
            </table>
            <div className="flex justify-end pr-2 text-sm text-gray-700 mb-4">
                <table>
                    <tbody>
                    <tr>
                        <td className="pr-4 py-1">Subtotal</td>
                        <td className="text-right py-1">Rs.{planDetails.plan_price}</td>
                    </tr>
                    <tr>
                        <td className="pr-4 py-1">Tax</td>
                        <td className="text-right py-1">Rs.0</td>
                    </tr>
                    <tr className="bg-red-600 text-white">
                        <td className="pr-4 py-1 font-semibold">Total</td>
                        <td className="text-right py-1 font-bold">Rs.{planDetails.plan_price}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="mb-2 mt-6">
                <div className="text-red-700 font-semibold">Terms and Conditions</div>
                <div className="text-gray-700 text-sm">Payment is due immediately. No refunds after activation.</div>
            </div>
            <div className="mb-7 mt-2">
                <div className="text-red-700 font-semibold">Payment Method</div>
                <div className="text-gray-700 text-sm">Payment ID: {paymentDetails.payment_id}</div>
            </div>
            <div >
                {/*<div className="text-gray-500 text-xs italic pb-6">Thank You For Your Business</div>*/}
                {/*<div className="pb-2 text-center">*/}
                {/*    <div className="border-b border-gray-600 w-36 mx-auto"></div>*/}
                {/*    <span className="text-xs text-gray-700">Signature</span>*/}
                {/*</div>*/}
                <div className="flex justify-center gap-4 mt-7">
                    <button
                        onClick={generatePDF}
                        className="bg-red-600 text-white px-8 py-2 rounded-md hover:bg-red-700 shadow font-semibold inline-flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Download Invoice
                    </button>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="bg-gray-900 text-white px-8 py-2 rounded-md hover:bg-red-700 shadow font-semibold inline-flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        Continue to Login
                    </button>
                </div>
                {showToast && (
                    <div className="fixed bottom-8 right-8 bg-green-500 text-white px-4 py-2 rounded shadow-xl animate-bounce z-50">
                        Invoice downloaded!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bill;