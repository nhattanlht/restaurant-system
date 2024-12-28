CREATE OR ALTER TRIGGER TG_UpdateOrderTotal
ON [Order_Detail]
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @OrderId INT;

    -- Lấy Order_id từ bản ghi vừa thay đổi (INSERT hoặc UPDATE)
    IF EXISTS (SELECT * FROM inserted)
    BEGIN
        SELECT @OrderId = Order_id FROM inserted;
    END
    ELSE IF EXISTS (SELECT * FROM deleted)
    BEGIN
        SELECT @OrderId = Order_id FROM deleted;
    END

    -- Tính tổng giá trị của các chi tiết đơn hàng
    DECLARE @TotalPrice MONEY;
    SELECT @TotalPrice = SUM(Price)
    FROM [Order_Detail]
    WHERE Order_id = @OrderId;

    -- Cập nhật tổng giá trong bảng Order
    UPDATE [Order]
    SET total_amount = @TotalPrice
    WHERE Order_id = @OrderId;
END;

CREATE OR ALTER TRIGGER TG_DiscountTimeOrder
ON [Order]
AFTER INSERT, UPDATE
AS
BEGIN
    DECLARE @start_date DATE;
    DECLARE @end_date DATE;
    DECLARE @order_date DATE;

    -- Lặp qua từng bản ghi trong bảng inserted
    DECLARE cursor_order CURSOR FOR
    SELECT 
        i.orderdate,
        d.start_date,
        d.end_date
    FROM 
        inserted i
    JOIN 
        Discount d ON i.discount_id = d.discount_id;

    OPEN cursor_order;

    FETCH NEXT FROM cursor_order INTO @order_date, @start_date, @end_date;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF @order_date < @start_date OR @order_date > @end_date
        BEGIN
            RAISERROR('Discount date is not valid', 16, 1);
            CLOSE cursor_order;
            DEALLOCATE cursor_order;
            RETURN;
        END

        FETCH NEXT FROM cursor_order INTO @order_date, @start_date, @end_date;
    END

    CLOSE cursor_order;
    DEALLOCATE cursor_order;
END;

