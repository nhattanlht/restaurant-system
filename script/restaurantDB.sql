CREATE TABLE [User] (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    user_name NVARCHAR(50),
    password VARCHAR(255),
    role NVARCHAR(50),
    status INT,
    private_key VARCHAR(MAX),
    public_key VARCHAR(MAX)
);
ALTER TABLE [User]
    ADD refresh_token_used NVARCHAR(MAX),
    refresh_token NVARCHAR(MAX);

-- set refresh_token_used is array
UPDATE [User]
SET refresh_token_used = '[]'

CREATE TABLE [ApiKey] (
    user_id INT PRIMARY KEY FOREIGN KEY REFERENCES [User](user_id),
    api_key NVARCHAR(MAX),
    status BIT,
    permissions VARCHAR(10)
    );
ALTER TABLE [ApiKey]
    ADD CONSTRAINT CONSTRAINT_ApiKey_permissions
    CHECK (permissions IN ('read', 'write', 'delete'));



CREATE TABLE [Employee] (
    employee_id INT PRIMARY KEY,
    name NVARCHAR(100),
    DOB DATE,
    gender CHAR(1),
    dept_id INT,
    address NVARCHAR(200),
    phone_number NVARCHAR(20),
    user_id INT FOREIGN KEY REFERENCES [User](user_id)  -- Chỉnh sửa thành INT
);


CREATE TABLE [Customer] (
    customer_id BIGINT PRIMARY KEY,  -- Chỉnh sửa thành BIGINT
    name NVARCHAR(100),
    phone_number NVARCHAR(20),
    email NVARCHAR(100),
    identity_card NVARCHAR(20),
    gender CHAR(1),
    member_card_number NVARCHAR(20),
    card_type NVARCHAR(50),
    accumulated_spending MONEY,
    created_at DATETIME,
    user_id INT FOREIGN KEY REFERENCES [User](user_id),
    support_employee_id INT FOREIGN KEY REFERENCES [Employee](employee_id)
);




CREATE TABLE [Area] (
    area_id INT PRIMARY KEY,
    area_name NVARCHAR(100)
);


CREATE TABLE [Branch] (
    branch_id INT IDENTITY(1,1) PRIMARY KEY,
    branch_name NVARCHAR(100),
    address NVARCHAR(200),
    opening_time TIME,
    closing_time TIME,
    status NVARCHAR(50),
    phone_number NVARCHAR(20),
    has_motorbike_parking BIT,
    has_car_parking BIT,
    area_id INT FOREIGN KEY REFERENCES [Area](area_id),
    manager INT
);
ALTER TABLE [Branch]
ADD CONSTRAINT FK_Branch_Employee FOREIGN KEY (employee_id)
REFERENCES [Employee](employee_id);


CREATE TABLE [Department] (
    department_id INT IDENTITY(1,1) PRIMARY KEY,
    department_name NVARCHAR(100),
    branch_id INT FOREIGN KEY REFERENCES [Branch](branch_id),
    salary MONEY
);


CREATE TABLE [Employee_History] (
    employee_id INT FOREIGN KEY REFERENCES [Employee](employee_id),
    start_date DATE,
    branch_id INT FOREIGN KEY REFERENCES [Branch](branch_id),
    end_date DATE
);


CREATE TABLE [Category] (
    category_id INT PRIMARY KEY,
    category_name NVARCHAR(100)
);


CREATE TABLE [Menu_Item] (
    item_id INT PRIMARY KEY,
    item_name NVARCHAR(100),
    price MONEY,
    status NVARCHAR(50),
    category_id INT FOREIGN KEY REFERENCES [Category](category_id)
);


CREATE TABLE [Discount] (
    discount_id INT PRIMARY KEY,
    discount_type NVARCHAR(50),
    discount_value DECIMAL(5, 2),
    quantity INT,
    start_date DATE,
    end_date DATE,
    gift_item NVARCHAR(100)
);


CREATE TABLE [Order] (
    order_id INT PRIMARY KEY,
    order_date DATETIME,
    amount MONEY,
    discount_id INT FOREIGN KEY REFERENCES [Discount](discount_id),
    total_amount MONEY,
    payment_method NVARCHAR(50),
    customer_id BIGINT FOREIGN KEY REFERENCES [Customer](customer_id),
    employee_id INT FOREIGN KEY REFERENCES [Employee](employee_id)
);


CREATE TABLE [Order_Detail] (
    order_id INT FOREIGN KEY REFERENCES [Order](order_id),
    item_id INT FOREIGN KEY REFERENCES [Menu_Item](item_id),
    quantity INT,
    price MONEY,
    PRIMARY KEY (order_id, item_id)
);


CREATE TABLE [Service_Review] (
    review_id INT PRIMARY KEY,
    order_id INT FOREIGN KEY REFERENCES [Order](order_id),
    service_rating INT,
    location_rating INT,
    food_quality_rating INT,
    price_rating INT,
    ambiance_rating INT,
    comments NVARCHAR(MAX)
);


CREATE TABLE [Online_Ordering] (
    order_id INT PRIMARY KEY FOREIGN KEY REFERENCES [Order](order_id),
    access_time DATETIME,
    access_duration INT
);


CREATE TABLE [Dine_In_Ordering] (
    order_id INT PRIMARY KEY FOREIGN KEY REFERENCES [Order](order_id),
    table_number INT,
    arrival_time TIME,
    guest_count INT
);


CREATE TABLE [Pre_Order] (
    order_id INT FOREIGN KEY REFERENCES [Dine_In_Ordering](order_id),
    item_id INT FOREIGN KEY REFERENCES [Menu_Item](item_id),
    quantity INT,
    PRIMARY KEY (order_id, item_id)
);


CREATE TABLE [Delivery_Ordering] (
    order_id INT PRIMARY KEY FOREIGN KEY REFERENCES [Online_Ordering](order_id),
    shipping_status NVARCHAR(50)
);


CREATE TABLE [Shipment] (
    shipment_id INT PRIMARY KEY,
    order_id INT FOREIGN KEY REFERENCES [Delivery_Ordering](order_id),
    shipping_fee MONEY,
    delivery_time DATETIME,
    pickup_time DATETIME
);



--Check

ALTER TABLE Customer
ADD CONSTRAINT CK_Gender_Customer
CHECK (Gender IN ('F', 'M'));

ALTER TABLE Customer
ADD CONSTRAINT CK_card_type_Customer
CHECK (card_type IN ('Membership', 'Sliver','Gold'));

ALTER TABLE Employee
ADD CONSTRAINT CK_Gender_Employee
CHECK (Gender IN ('F', 'M'));

ALTER TABLE Employee
ADD CONSTRAINT CK_DOB_Employee
CHECK (DOB < GETDATE());

ALTER TABLE Discount
ADD CONSTRAINT CK_Time_Discount
CHECK (start_date < end_date);

ALTER TABLE [Order]
ADD CONSTRAINT CK_payment_method_Order
CHECK (payment_method IN ('Cash','Credit Card','E-Wallet'));

ALTER TABLE [Delivery_Ordering]
ADD CONSTRAINT CK_shipping_status_Delivery_Ordering
CHECK (shipping_status IN ('Pending', 'Shipped', 'In Transit', 'Delivered', 'Returned'));

ALTER TABLE Service_Review
ADD CONSTRAINT CK_Service_Review_ServiceRating
CHECK (service_rating BETWEEN 1 AND 5);

ALTER TABLE Service_Review
ADD CONSTRAINT CK_Service_Review_LocationRating
CHECK (location_rating BETWEEN 1 AND 5);

ALTER TABLE Service_Review
ADD CONSTRAINT CK_Service_Review_FoodQualityRating
CHECK (food_quality_rating BETWEEN 1 AND 5);

ALTER TABLE Service_Review
ADD CONSTRAINT CK_Service_Review_PriceRating
CHECK (price_rating BETWEEN 1 AND 5);

ALTER TABLE Service_Review
ADD CONSTRAINT CK_Service_Review_AmbianceRating
CHECK (ambiance_rating BETWEEN 1 AND 5);

ALTER TABLE Branch
ADD CONSTRAINT CK_HasMotorbikeParking_Branch
CHECK (has_motorbike_parking IN (0, 1));

ALTER TABLE Branch
ADD CONSTRAINT CK_HasCarParking_Branch
CHECK (has_car_parking IN (0, 1));

