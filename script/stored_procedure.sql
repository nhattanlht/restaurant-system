CREATE PROCEDURE SP_InsertNewUser
    @user_name NVARCHAR(50),
    @password VARCHAR(255),
    @role NVARCHAR(50),
    @status INT,
    @public_key VARCHAR(MAX),
    @private_key VARCHAR(MAX)
AS
BEGIN
    -- Bắt đầu transaction
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Thêm một user mới
        INSERT INTO [User] (user_name, password, role, status, public_key, private_key)
        VALUES (@user_name, @password, @role, @status, @public_key, @private_key);

        -- Lấy user_id của bản ghi vừa được thêm vào
        DECLARE @newUserId INT;
        SET @newUserId = SCOPE_IDENTITY();

        -- Commit transaction nếu không có lỗi
        COMMIT TRANSACTION;

        -- Trả về user_id
        SELECT @newUserId AS user_id;
    END TRY
    BEGIN CATCH
        -- Rollback transaction nếu xảy ra lỗi
        ROLLBACK TRANSACTION;

        -- Trả về lỗi
        THROW;
    END CATCH
END;

CREATE PROCEDURE SP_InsertNewCustomer
    @customer_id BIGINT,
    @name NVARCHAR(100),
    @phone_number NVARCHAR(20) = NULL,
    @email NVARCHAR(100),
    @identity_card NVARCHAR(20),
    @gender CHAR(1) = 'F',
    @card_type NVARCHAR(50) = 'Membership',
    @accumulated_spending MONEY = 0,
    @created_at DATETIME,
    @user_id INT,
    @support_employee_id INT
AS
BEGIN
    -- Thêm dữ liệu vào bảng Customer
INSERT INTO [dbo].[Customer]
(
    customer_id, name, phone_number, email,
    identity_card, gender, card_type,
    accumulated_spending, created_at, user_id, support_employee_id
)
VALUES
    (
    @customer_id, @name, @phone_number, @email,
    @identity_card, @gender, @card_type,
    @accumulated_spending, @created_at, @user_id, @support_employee_id
    );

-- Trả về thông tin vừa được thêm
SELECT *
FROM [dbo].[Customer]
WHERE customer_id = @customer_id;
END;



CREATE PROCEDURE SP_InsertNewEmployee
    @employee_id BIGINT,
    @name NVARCHAR(100),
    @dept_id INT = NULL,
    @user_id INT,
    @DOB DATE = NULL,
    @gender CHAR(1) = NULL,
    @address NVARCHAR(200) = NULL,
    @phone_number NVARCHAR(20) = NULL
AS
BEGIN
        -- Declare a table variable to hold the inserted employee record
        DECLARE @InsertedEmployee TABLE
        (
            employee_id BIGINT,
            name NVARCHAR(100),
            dept_id INT,
            user_id INT,
            DOB DATE,
            gender CHAR(1),
            address NVARCHAR(200),
            phone_number NVARCHAR(20)
        );

        -- Insert the employee record and capture the inserted data
INSERT INTO [dbo].[Employee]
(
    [employee_id],
    [name],
    [dept_id],
    [user_id],
    [DOB],
    [gender],
    [address],
[phone_number]
)
    OUTPUT
    inserted.employee_id,
    inserted.name,
    inserted.dept_id,
    inserted.user_id,
    inserted.DOB,
    inserted.gender,
    inserted.address,
    inserted.phone_number
    INTO @InsertedEmployee -- Store the output in the table variable
VALUES
    (
    @employee_id,
    @name,
    @dept_id,
    @user_id,
    @DOB,
    @gender,
    @address,
    @phone_number
    );


-- Return the inserted employee record
SELECT * FROM @InsertedEmployee;

END





CREATE PROCEDURE SP_FindUserByUsername
    @user_name NVARCHAR(100)
AS
BEGIN
SELECT *
FROM [User]
WHERE user_name = @user_name;
END;


CREATE PROCEDURE SP_DeleteUser
    @user_name NVARCHAR(100)
AS
BEGIN
    -- Xóa người dùng có tên tương ứng
DELETE FROM [User] WHERE user_name = @user_name;

-- 0: Thành công, 1: Lỗi
IF @@ROWCOUNT = 0
BEGIN
RETURN 1; -- Không tìm thấy người dùng để xóa
END
ELSE
BEGIN
RETURN 0; -- Xóa thành công
END
END;


CREATE PROCEDURE SP_UpdateKeyTokenUser
    @user_id INT,
@private_key NVARCHAR(MAX),
@public_key NVARCHAR(MAX),
@refresh_token NVARCHAR(MAX)
AS
BEGIN
UPDATE [User]
SET
    private_key = @private_key,
    public_key = @public_key,
    refresh_token = @refresh_token
WHERE user_id = @user_id
END


CREATE PROCEDURE SP_DeleteKeyUserById
    @user_id INT
AS
BEGIN
UPDATE [User]
SET
    private_key = NULL,
    public_key = NULL,
    refresh_token = NULL,
    refresh_token_used = NULL
WHERE user_id = @user_id

    IF @@ROWCOUNT = 0
BEGIN
RETURN 1; -- Không tìm thấy người dùng để xóa
END
ELSE
BEGIN
RETURN 0; -- Xóa thành công
END
END



CREATE PROCEDURE SP_FindUserByRefreshTokenUsed
    @refreshToken NVARCHAR(MAX)
AS
BEGIN
SELECT *
FROM [User]
WHERE @refreshToken IN (SELECT value FROM STRING_SPLIT(refresh_token_used, ','))
END

CREATE PROCEDURE SP_FindUserByRefreshToken
    @refreshToken NVARCHAR(MAX)
AS
BEGIN
SELECT
    *
FROM
    [User]
WHERE
    refresh_token = @refreshToken;
END


CREATE PROCEDURE SP_UpdateRefreshToken
    @user_id INT,
    @newRefreshToken NVARCHAR(MAX),
    @refreshToken NVARCHAR(MAX)
AS
BEGIN
UPDATE [User]
SET
    refresh_token_used = CONCAT(refresh_token_used, ',', @newRefreshToken),
    refresh_token = @refreshToken
WHERE user_id = @user_id;
IF @@ROWCOUNT = 0
BEGIN
RETURN 1; -- Không tìm thấy người dùng để xóa
END
ELSE
BEGIN
RETURN 0; -- Xóa thành công
END
END


CREATE PROCEDURE SP_FindEmployeeId
    @employee_id INT
as BEGIN
SELECT * FROM [Employee] where employee_id = @employee_id
end

CREATE PROCEDURE SP_UpdateCustomer
    @user_id INT,
    @name NVARCHAR(250),
    @phone NVARCHAR(15),
    @gender CHAR(1),
    @avatar VARCHAR(250)
AS
BEGIN
UPDATE [Customer]
SET
    name = @name,
    phone_number = @phone,
    gender = @gender,
    avatar = @avatar
WHERE user_id = @user_id;

IF @@ROWCOUNT = 0
BEGIN
RETURN 1;
END
ELSE
BEGIN
RETURN 0; -- thành công
END
END

CREATE PROCEDURE SP_UpdateDepartmentSalary
    @departmentName NVARCHAR(100),
    @newSalary MONEY
AS
BEGIN
    -- Validate input
    IF @newSalary <= 0
    BEGIN
        RAISERROR ('Salary must be greater than 0.', 16, 1);
        RETURN;
    END

    -- Update salary
    UPDATE Department
    SET salary = @newSalary
    WHERE department_name = @departmentName;

    -- Check if update occurred
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR ('Department not found.', 16, 1);
        RETURN;
    END
END;

