CREATE TRIGGER trg_ValidateBranchData
ON [Branch]
AFTER INSERT, UPDATE
AS
BEGIN
    BEGIN TRANSACTION; -- Bắt đầu giao dịch
    BEGIN TRY
        -- Kiểm tra số điện thoại có đúng 10 chữ số hay không
        IF EXISTS (
            SELECT 1
            FROM inserted
            WHERE LEN(phone_number) <> 10 OR phone_number NOT LIKE '[0-9]%' -- Chỉ chứa số
        )
        BEGIN
            THROW 50001, 'Phone number must be exactly 10 digits.', 1;
        END;

        -- Kiểm tra thời gian đóng cửa không thể nhỏ hơn thời gian mở cửa
        IF EXISTS (
            SELECT 1
            FROM inserted
            WHERE closing_time <= opening_time
        )
        BEGIN
            THROW 50002, 'Closing time cannot be earlier than opening time.', 1;
        END;

        -- Kiểm tra nhân viên không thể quản lý nhiều chi nhánh
        IF EXISTS (
            SELECT 1
            FROM inserted i
            JOIN Branch b
            ON i.manager = b.manager
            WHERE i.manager IS NOT NULL
            AND b.branch_id <> i.branch_id
        )
        BEGIN
            THROW 50003, 'A single employee cannot manage multiple branches.', 1;
        END;

        -- Nếu không có lỗi, commit giao dịch
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback giao dịch khi có lỗi
        ROLLBACK TRANSACTION;

        -- Re-throw lỗi để controller nhận biết
        THROW;
    END CATCH
END;
GO

