const crypto = require('crypto');

// sap xep dictionary theo thu tu tu dien (alphabetical sort)
const sortObject = (obj) => {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
    }
  }
  return sorted;
};

// ham ky HMAC-SHA512 cho VNPay URL va Checksum Webhook
const generateVnPayHash = (params, secretKey) => {
  const sortedParams = sortObject(params);
  const querystring = Object.keys(sortedParams)
    .map((key) => `${key}=${sortedParams[key]}`)
    .join('&');

  const hmac = crypto.createHmac('sha512', secretKey);
  const vnpSecureHash = hmac.update(Buffer.from(querystring, 'utf-8')).digest('hex');
  
  return {
    querystring,
    vnpSecureHash,
  };
};

// ham kiem tra tinh toan vẹn chu ky Checksum khi nhan Webhook IPN
const verifyVnPayChecksum = (vnpParams, secretKey) => {
  const paramsCopy = { ...vnpParams };
  const secureHash = paramsCopy['vnp_SecureHash'];
  
  delete paramsCopy['vnp_SecureHash'];
  delete paramsCopy['vnp_SecureHashType'];

  const { vnpSecureHash: calculatedHash } = generateVnPayHash(paramsCopy, secretKey);
  return calculatedHash.toLowerCase() === (secureHash || '').toLowerCase();
};

// dinh dang ngay YYYYMMDDHHmmss
const formatVnPayDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

module.exports = {
  sortObject,
  generateVnPayHash,
  verifyVnPayChecksum,
  formatVnPayDate,
};
