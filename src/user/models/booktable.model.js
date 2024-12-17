const sql = require('mssql');
const config = require('../../configs/mssql.config');

const formatDateTime = (dateTimeString) => {
    // Tạo đối tượng Date từ chuỗi đầu vào
    const date = new Date(dateTimeString);

    if (isNaN(date.getTime())) {
        throw new Error(`Invalid datetime format: ${dateTimeString}`);
    }

    // Lấy các phần của ngày và thời gian
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, cần +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Trả về chuỗi theo định dạng 'YYYY-MM-DD HH:mm:ss'
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const extractTimeFromDateTime = (dateTimeString) => {
    // Tạo đối tượng Date từ chuỗi datetime
    const date = new Date(dateTimeString);

    // Kiểm tra xem chuỗi datetime có hợp lệ không
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid datetime format: ${dateTimeString}`);
    }

    // Lấy giờ, phút, giây từ đối tượng Date
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Trả về chuỗi thời gian theo định dạng HH:mm:ss
    return `${hours}:${minutes}:${seconds}`;
};

// Chuyển đổi chuỗi thành thời gian (giả sử định dạng là HH:mm:ss)
const parseTime = (timeString) => {
    // Kiểm tra xem chuỗi có đúng định dạng không (HH:mm:ss)
    const timeParts = timeString.split(':');
    if (timeParts.length !== 3) {
        throw new Error('Invalid time format for: ${timeString}');
    }
    // Đảm bảo rằng các phần của thời gian là số hợp lệ
    const [hours, minutes, seconds] = timeParts.map(part => parseInt(part, 10));
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) {
        throw new Error('Invalid time value for: ${timeString}');
    }
    // Trả về đối tượng Date với thời gian xác định
    const now = new Date();
    now.setHours(hours, minutes, seconds, 0);
    return now;
};

const parseDateTime = (dateTimeString) => {
    // Kiểm tra định dạng (giả sử định dạng là 'YYYY-MM-DD HH:mm:ss')
    const [datePart, timePart] = dateTimeString.split(' ');
    if (!datePart || !timePart) {
        throw new Error('Invalid datetime format for: ${ dateTimeString }');
    }

    // Tách và kiểm tra phần ngày
    const dateParts = datePart.split('-').map(part => parseInt(part, 10));
    if (dateParts.length !== 3) {
        throw new Error('Invalid date format for: ${ datePart }');
    }
    const [year, month, day] = dateParts;

    // Tách và kiểm tra phần thời gian
    const timeParts = timePart.split(':').map(part => parseInt(part, 10));
    if (timeParts.length !== 3) {
        throw new Error('Invalid time format for: ${ timePart }');
    }
    const [hours, minutes, seconds] = timeParts;

    // Kiểm tra các giá trị có hợp lệ hay không
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes) || isNaN(seconds) ||
        month < 1 || month > 12 || day < 1 || day > 31 ||
        hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) {
        throw new Error('Invalid datetime value for: ${ dateTimeString }');
    }

    // Trả về đối tượng Date
    return new Date(year, month - 1, day, hours, minutes, seconds);
};

class BooktableModel {
    static async NewOrderforBooking(infotable = {}) {
        try {
            const { customer_id, table, arrival_time } = infotable;
            await sql.connect(config);

            // Lấy id order
            const maxIdQuery = `SELECT ISNULL(MAX(order_id), 0) + 1 AS new_order_id FROM [Order]`;
            const maxIdRequest = new sql.Request();
            const maxIdResult = await maxIdRequest.query(maxIdQuery);
            const newOrderId = maxIdResult.recordset[0].new_order_id;

            // Thêm thông tin đơn hàng mới với customer_id
            const OrderinsertQuery = `
            INSERT INTO [Order] (order_id, order_date, customer_id)
            VALUES (@OrderId, @OrderDate, @CustomerId)
            `;

            let date = formatDateTime(new Date());
            const OrderinsertRequest = new sql.Request();
            OrderinsertRequest.input('OrderId', sql.Int, newOrderId);
            OrderinsertRequest.input('OrderDate', sql.DateTime, parseDateTime(date));
            OrderinsertRequest.input('CustomerId', sql.BigInt, customer_id);

            await OrderinsertRequest.query(OrderinsertQuery);

            console.log('Order inserted successfully');

            // Thêm thông tin đơn hàng ăn tại chỗ mới với order_id
            const TableNumber = Math.floor(Math.random() * 50) + 1; // Tạo số bàn ngẫu nhiên từ 1 đến 50

            const Dine_In_OrderinsertQuery = `
            INSERT INTO [Dine_In_Ordering] (order_id, table_number, arrival_time, guest_count)
            VALUES (@OrderId, @TableNumber, @ArrivalTime, @GuestCount)
            `;

            const Dine_In_OrderinsertRequest = new sql.Request();
            Dine_In_OrderinsertRequest.input('OrderId', sql.Int, newOrderId);
            Dine_In_OrderinsertRequest.input('TableNumber', sql.Int, TableNumber);
            Dine_In_OrderinsertRequest.input('ArrivalTime', sql.Time, parseTime(extractTimeFromDateTime(arrival_time)));  // Make sure arrival_time is in the right format
            Dine_In_OrderinsertRequest.input('GuestCount', sql.Int, table);

            await Dine_In_OrderinsertRequest.query(Dine_In_OrderinsertQuery);

            console.log('Dine_In_Ordering inserted successfully');

            return newOrderId;
        } catch (error) {
            console.error('Error in NewOrderforBooking:', error);
            throw error;
        } finally {
            await sql.close();
        }
    }

    static async checkOrCreateCustomer(infocustomer = {}) {
        try {
            const { name, phone, email, identity, gender } = infocustomer;

            await sql.connect(config);

            // Kiểm tra email trong bảng Customer
            const emailCheckQuery = `SELECT customer_id FROM Customer WHERE email = @Email`;
            const emailRequest = new sql.Request();
            emailRequest.input('Email', sql.NVarChar, email);
            const result = await emailRequest.query(emailCheckQuery);

            if (result.recordset && result.recordset.length > 0) {
                // Email đã tồn tại, trả về customer_id
                return result.recordset[0].customer_id;
            } else {
                // Email chưa tồn tại, tạo customer_id mới
                const maxIdQuery = `SELECT ISNULL(MAX(customer_id), 0) + 1 AS new_customer_id FROM Customer`;
                const maxIdRequest = new sql.Request();
                const maxIdResult = await maxIdRequest.query(maxIdQuery);
                const newCustomerId = maxIdResult.recordset[0].new_customer_id;

                // Thêm thông tin khách hàng mới với customer_id
                const insertQuery = `
                    INSERT INTO Customer (customer_id, name, phone_number, email, identity_card, gender)
                    VALUES (@CustomerId, @Name, @Phone, @Email, @Identity, @Gender)
                `;

                const insertRequest = new sql.Request();
                insertRequest.input('CustomerId', sql.BigInt, newCustomerId);
                insertRequest.input('Name', sql.NVarChar, name || null);
                insertRequest.input('Phone', sql.NVarChar, phone || null);
                insertRequest.input('Email', sql.NVarChar, email);
                insertRequest.input('Identity', sql.NVarChar, identity || null);
                insertRequest.input('Gender', sql.Char, gender || null);

                await insertRequest.query(insertQuery);

                console.log('User inserted successfully');

                return newCustomerId; // Trả về customer_id vừa tạo
            }
        } catch (error) {
            console.error('Error in checkOrCreateCustomer:', error);
            throw error;
        } finally {
            await sql.close();
        }
    }
}

module.exports = BooktableModel;