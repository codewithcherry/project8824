const PDFDocument=require("pdfkit");

GenerateInvoice = (order, res) => {
    const doc = new PDFDocument({ margin: 50 });
  
    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="invoice.pdf"');
  
    // Pipe to response
    doc.pipe(res);
  
    // Add company information (top left)
    doc.fontSize(20).text('MyShop app', 50, 50);
    doc.fontSize(10).text('white hills, Bangalore, India', 50, 75);
    doc.text('zip code: 501244', 50, 90);
    doc.text('email: care@myshop.com', 50, 105);
  
    // Add "INVOICE" title (top right)
    doc.fontSize(30).text('INVOICE', 400, 50);
  
    const date = order.time;
    const orderdate = new Date(date);
  
    // Extract day, month, and year
    const day = String(orderdate.getDate()).padStart(2, '0');
    const month = String(orderdate.getMonth() + 1).padStart(2, '0');
    const year = orderdate.getFullYear();
  
    // Format the date as dd/mm/yyyy
    const formattedDate = `${day}/${month}/${year}`;
  
    // Invoice and Customer Details
    doc.fontSize(10).text('INVOICE #', 350, 120);
    doc.fontSize(8).text(order._id, 430, 120);
    doc.fontSize(10).text('DATE', 350, 140);
    doc.fontSize(10).text(formattedDate, 430, 140);
  
    doc.text('CUSTOMER ID', 350, 155);
    doc.fontSize(8).text(order.user.userId, 430, 155);
   
  
    // Bill to Section
    doc.fontSize(12).text('SHIP TO', 50, 150);
    doc.fontSize(10).text(order.user.name, 50, 170);
    doc.text(order.shipTo.area, 50, 185);
    doc.text(order.shipTo.city +","+ order.shipTo.country, 50, 200);
    doc.text("postal code:"+order.shipTo.postalCode, 50, 215);
    doc.text(order.shipTo.phone, 50, 230);
    doc.text(order.user.email, 50, 245);
  
    // Add a line to separate sections
    doc.moveTo(50, 270).lineTo(550, 270).stroke();
  
    // Table Header
    doc.fontSize(10).text('DESCRIPTION', 50, 285);
    doc.text('QTY', 300, 285);
    doc.text('UNIT PRICE', 350, 285);
    doc.text('AMOUNT', 450, 285);
  
    doc.moveTo(50, 295).lineTo(550, 295).stroke();
  
    // Example items
    let totalAmount = 0;  // Use 'let' here since the value is updated
  
    let y = 310;
    order.products.forEach(item => {
      totalAmount += (item.productId.price * item.quantity);
      doc.text(item.productId.title, 50, y);
      doc.text(item.quantity, 300, y);  // Fixed typo from 'quatity' to 'quantity'
      doc.text(`$${item.productId.price}`, 350, y);
      doc.text(`$${item.productId.price * item.quantity}`, 450, y);
      y += 15;
    });
  
    // Table Footer (Subtotal, Tax, Total)
    doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();
  
    y += 25;
    doc.fontSize(10).text('SUBTOTAL', 370, y);
    doc.text("$ "+order.payment.subtotal, 450, y);
  
    y += 15;
    doc.text('TAX', 370, y);
    doc.text("$ "+order.payment.tax, 450, y);

    y += 15;
    doc.text('DELIVERY', 370, y);
    doc.text("$ "+order.payment.delivery, 450, y);
  
    y += 15;
    doc.fontSize(12).text('TOTAL', 370, y);
    doc.text("$ "+order.payment.total , 450, y);
  
    // Add "Thank you" note
    doc.moveDown(2);
    doc.fontSize(10).text('Thank you for your business!', 50, y + 40);
  
    // Footer
    doc.text('If you have any questions about this invoice, please contact', 50, y + 60);
    doc.text('[www.myshop.com/help, , care@myshop.com]', 50, y + 75);
  
    // Finalize the PDF and end the stream
    doc.end();
  };

  
module.exports=GenerateInvoice