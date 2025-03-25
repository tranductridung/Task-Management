const moment = require('moment');
require('dotenv').config();

const calculateExpirationTime = () => {
    const expiredTime = process.env.EXPIRED_REFRESH_TOKEN;

    if (!expiredTime) {
        throw new Error('EXPIRED_REFRESH_TOKEN is not defined in .env');
    }

    const currentTime = moment();

    // Tách giá trị số và đơn vị (ví dụ '7d' => 7 và 'd')
    const match = expiredTime.match(/^(\d+)([a-zA-Z]+)$/);

    if (!match) {
        throw new Error('Invalid EXPIRED_REFRESH_TOKEN format in .env');
    }

    const value = parseInt(match[1], 10);  // Số (7)
    const unit = match[2];  // Đơn vị ('d' cho days, 'h' cho hours, v.v.)

    // Kiểm tra nếu đơn vị không hợp lệ
    if (!['d', 'h', 'm', 's'].includes(unit)) {
        throw new Error('Invalid time unit in EXPIRED_REFRESH_TOKEN');
    }

    const expirationTime = currentTime.add(value, unit); // Cộng thêm thời gian vào
    return expirationTime;
}

module.exports = calculateExpirationTime
