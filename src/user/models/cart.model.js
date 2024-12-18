const sql = require('mssql');
const config = require('../../configs/mssql.config');

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


class CartModel {
    // Hàm này sẽ lấy giỏ hàng từ session (hoặc cơ sở dữ liệu)
    static getCart(session) {
        return session.cart || [];  // Lấy giỏ hàng từ session
    }

    constructor(session) {
        this.session = session;
        this.items = this.session.cart ? this.session.cart : [];
    }

    // Add a new item or update the quantity if it exists
    addItem(item) {
        const existingItem = this.items.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...item, quantity: 1 });
        }
        this.updateSession();
    }

    // Get all cart items
    getItems() {
        return this.items;
    }

    // Update the session with the current cart state
    updateSession() {
        this.session.cart = this.items;
    }

    static async saveCartToDatabase(req, res) {
        try {
            const cart = req.body.cart;  // Get the cart data from the request body
            if (!cart || cart.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }

            await sql.connect(config);  // Establish connection to the database

            // Step 1: Get the next available order ID
            const maxIdQuery = `SELECT ISNULL(MAX(order_id), 0) + 1 AS new_order_id FROM [Order]`;
            const maxIdRequest = new sql.Request();
            const maxIdResult = await maxIdRequest.query(maxIdQuery);
            const newOrderId = maxIdResult.recordset[0].new_order_id;

            // Step 2: Insert the order into the [Order] table
            const orderInsertQuery = `
                INSERT INTO [Order] (order_id, order_date, customer_id)
                VALUES (@OrderId, @OrderDate, @CustomerId)
            `;
            const date = new Date();  // Get the current date and time
            const orderInsertRequest = new sql.Request();
            orderInsertRequest.input('OrderId', sql.Int, newOrderId);
            orderInsertRequest.input('OrderDate', sql.DateTime,date);
            orderInsertRequest.input('CustomerId', sql.BigInt, req.body.customer_id);  // Assuming customer_id is passed in the body

            await orderInsertRequest.query(orderInsertQuery);
            console.log('Order inserted successfully');

            // Step 3: Insert each item in the cart into the [Order_Detail] table
            for (let item of cart) {
                const { id, price, quantity } = item;
                const orderDetailInsertQuery = `
                    INSERT INTO [Order_Detail] (order_id, item_id, quantity, price)
                    VALUES (@OrderId, @ItemId, @Quantity, @Price)
                `;
                const orderDetailInsertRequest = new sql.Request();
                orderDetailInsertRequest.input('OrderId', sql.Int, newOrderId);
                orderDetailInsertRequest.input('ItemId', sql.Int, id);
                orderDetailInsertRequest.input('Quantity', sql.Int, quantity);
                orderDetailInsertRequest.input('Price', sql.Money, price);

                await orderDetailInsertRequest.query(orderDetailInsertQuery);
                console.log(`Item with ID ${id} inserted into Order_Detail`);
            }

            // Step 4: Respond to the client with the newly created order ID
            return res.status(200).json({ message: 'Cart saved to database successfully', orderId: newOrderId });
        } catch (error) {
            console.error('Error saving cart to database:', error);
            return res.status(500).json({ message: 'Error saving cart to database', error: error.message });
        } finally {
            await sql.close();  // Close the database connection
        }
    }
}


module.exports=CartModel;