const crypto = require('crypto');

// sinh ma otp 6 so ngau nhien bao mat bang crypto.randomInt
const generateSecureOtp = () => {
  //khong su dung math.random do hacker co the xam nhap luot nho toan hoc
  const otpNumber = crypto.randomInt(100000, 1000000);
  return otpNumber.toString();
};

// bam ma otp bang sha256 de luu vao redis an toan
const hashOtp = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

// kiem tra ma otp nhap vao so voi chuoi hash, neu do === thi do tung ki tu,neu ki tu dau tien sai thi co the cham hon 
//nano giay hacker co the check. Chuyen opt thanh ma nhi phan buffer xong so sánh 
const verifyOtpHash = (otp, hashedOtp) => {
  const inputHash = hashOtp(otp);
  return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(hashedOtp));
};

module.exports = {
  generateSecureOtp,
  hashOtp,
  verifyOtpHash,
};
