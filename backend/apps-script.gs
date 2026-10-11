// ============================================
// LUMORA STORE — Google Apps Script Backend
// Deploy as Web App: Execute as "Me", Access "Anyone"
// ============================================

const TELEGRAM_BOT_TOKEN = '8544045055:AAEohLIInF8YuBRPlU7ePlvVBa5QFr1m9O4';
const TELEGRAM_CHAT_ID = '8956891290';
const SHEET_NAME = 'Orders';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const order = data.order;
    
    const sheet = getOrCreateSheet();
    sheet.appendRow([
      order.id,
      order.timestamp || new Date().toISOString(),
      order.customer.name,
      order.customer.phone,
      order.customer.email || '',
      order.customer.address,
      order.customer.city,
      order.customer.state,
      order.customer.pincode,
      order.customer.landmark || '',
      order.items.map(function(i) { return i.name + ' x' + i.quantity + ' (₹' + (i.price * i.quantity) + ')'; }).join('\n'),
      order.subtotal,
      order.shipping,
      order.total,
      order.status,
      order.paymentInfo.method,
      order.paymentInfo.upiId,
      order.paymentInfo.txnRef || '',
      order.marketplace,
      order.trackingId || ''
    ]);
    
    sendTelegramNotification(order);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, orderId: order.id }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, orders: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var headers = data[0];
    var orders = [];
    for (var i = 1; i < data.length; i++) {
      var order = {};
      for (var j = 0; j < headers.length; j++) {
        order[headers[j]] = data[i][j];
      }
      orders.push(order);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, orders: orders }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Order ID', 'Timestamp', 'Name', 'Phone', 'Email', 'Address',
      'City', 'State', 'Pincode', 'Landmark', 'Items',
      'Subtotal', 'Shipping', 'Total', 'Status',
      'Payment Method', 'UPI ID', 'Txn Ref', 'Marketplace', 'Tracking ID'
    ]);
    sheet.getRange(1, 1, 1, 20).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sendTelegramNotification(order) {
  var c = order.customer;
  var message = '🛒 NEW ORDER RECEIVED!\n\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '📋 ORDER: ' + order.id + '\n' +
    '💰 Total: ₹' + order.total.toFixed(2) + '\n' +
    '💳 Payment: ' + order.paymentInfo.method.toUpperCase() + ' — ' + order.paymentInfo.upiId + '\n' +
    '📦 Source: ' + order.marketplace + '\n\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '👤 CUSTOMER\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    'Name: ' + c.name + '\n' +
    'Phone: ' + c.phone + '\n' +
    'Address: ' + c.address + '\n' +
    'City: ' + c.city + ', ' + c.state + ' - ' + c.pincode + '\n\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '🛍️ ITEMS\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    order.items.map(function(i) { return '• ' + i.name + ' × ' + i.quantity + ' — ₹' + (i.price * i.quantity).toFixed(2); }).join('\n') + '\n\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '✅ Action: Verify payment in Fampay → Open admin → Confirm';
  
  var url = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage';
  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    })
  });
}

function updateOrderStatus(orderId, status) {
  var sheet = getOrCreateSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === orderId) {
      sheet.getRange(i + 1, 15).setValue(status);
      return;
    }
  }
}
