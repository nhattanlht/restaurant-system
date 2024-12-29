use [restaurantDB]

-- TÌm kím nhân viên theo tên: Noncluster Index trên Employee
CREATE NONCLUSTERED INDEX IX_Employee_Name
ON Employee (name);
DROP INDEX IX_Employee_Name ON Employee;
select e.employee_id, e.name from dbo.Employee e
where e.name = N'Denise Stiedemann'

--  Tìm kiếm user name hỗ trợ đăng nhập
Select* from dbo.[user] u
where u.user_name = 'employee16@example.com'
CREATE NONCLUSTERED INDEX  IX_user_name ON DBO.[USER] (USER_NAME)
drop  INDEX IX_user_name ON DBO.[USER]

--  Tìm kiếm customer
select c.customer_id, c.name from dbo.[Customer] c
where name = N'Lý Trường Namdsad'
CREATE NONCLUSTERED INDEX  IX_Customer_name on dbo.customer (name)
drop INDEX  IX_Customer_name on dbo.customer

-----
-- Đặt non cluster index lên order_id của Service_Review để kết với order_id cuar order để hỗ trợ xem nhân viên phục vụ
sp_help Service_review
CREATE NONCLUSTERED INDEX  IX_order_id on dbo.Service_review(order_id)
drop INDEX  IX_order_id on dbo.Service_review

sp_help [Order]
CREATE NONCLUSTERED INDEX  IX_employee_id on dbo.[Order](employee_id) -- thuộc tính kết để lấy nhân viên phục vụ
drop INDEX  IX_employee_id on  dbo.[Order]

-- Partiton trên order hỗ trợ thống kê
-- 1. Đặt non cluster index trên order date để tiến hành partition
CREATE NONCLUSTERED INDEX  IX_order_date on restaurantDB.dbo.[order] (order_date)


CREATE DATABASE PARTITION
ON
PRIMARY
(
    NAME = 'PARTITION_1_2019',
    FILENAME = '/var/opt/mssql/data/DBPartition_FG1_2019.ndf',
    SIZE = 2MB,
    MAXSIZE = UNLIMITED,
    FILEGROWTH = 1MB
),
FILEGROUP FG2_2019
(
    NAME = 'PARTITION_2_2019',
    FILENAME = '/var/opt/mssql/data/DBPartition_FG2_2019.ndf',
    SIZE = 2MB,
    MAXSIZE = UNLIMITED,
    FILEGROWTH = 1MB
),
FILEGROUP FG3_2019
(
    NAME = 'PARTITION_3_2019',
    FILENAME = '/var/opt/mssql/data/DBPartition_FG3_2019.ndf',
    SIZE = 2MB,
    MAXSIZE = UNLIMITED,
    FILEGROWTH = 1MB
),
FILEGROUP FG4_2019
(NAME = 'PARTITION_4_2019',
FILENAME = '/var/opt/mssql/data/DBPartition_FG4_2019.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG5_2019
(NAME = 'PARTITION_5_2019',
FILENAME = '/var/opt/mssql/data/DBPartition_FG5_2019.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG6_2019
(NAME = 'PARTITION_6_2019',
FILENAME = '/var/opt/mssql/data/DBPartition_FG6_2019.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG7_2019
(NAME = 'PARTITION_7_2019',
FILENAME = '/var/opt/mssql/data/DBPartition_FG7_2019.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG8_2019
(NAME = 'PARTITION_8_2019',
FILENAME = '/var/opt/mssql/data/DBPartition_FG8_2019.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG9_2019
(NAME = 'PARTITION_9_2019',
FILENAME = '/var/opt/mssql/data/DBPartition_FG9_2019.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG10_2019
(NAME = 'PARTITION_10_2019',
FILENAME = '/var/opt/mssql/data/DBPartition_FG10_2019.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG11_2019
(NAME = 'PARTITION_11_2019',
FILENAME = '/var/opt/mssql/data/DBPartition_FG11_2019.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG12_2019
(NAME = 'PARTITION_12_2019',
FILENAME = '/var/opt/mssql/data/DBPartition_FG12_2019.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG1_2020
(NAME = 'PARTITION_1_2020',
FILENAME = '/var/opt/mssql/data/DBPartition_FG1_2020.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG2_2020
(NAME = 'PARTITION_2_2020',
FILENAME = '/var/opt/mssql/data/DBPartition_FG2_2020.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG3_2020
(NAME = 'PARTITION_3_2020',
FILENAME = '/var/opt/mssql/data/DBPartition_FG3_2020.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG4_2020
(NAME = 'PARTITION_4_2020',
FILENAME = '/var/opt/mssql/data/DBPartition_FG4_2020.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG5_2020
(NAME = 'PARTITION_5_2020',
FILENAME = '/var/opt/mssql/data/DBPartition_FG5_2020.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG6_2020
(NAME = 'PARTITION_6_2020',
FILENAME = '/var/opt/mssql/data/DBPartition_FG6_2020.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG7_2020
(NAME = 'PARTITION_7_2020',
FILENAME = '/var/opt/mssql/data/DBPartition_FG7_2020.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG8_2020
(NAME = 'PARTITION_8_2020',
FILENAME = '/var/opt/mssql/data/DBPartition_FG8_2020.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG9_2020
(NAME = 'PARTITION_9_2020',
FILENAME = '/var/opt/mssql/data/DBPartition_FG9_2020.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG10_2020
(NAME = 'PARTITION_10_2020',
FILENAME = '/var/opt/mssql/data/DBPartition_FG10_2020.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG11_2020
(NAME = 'PARTITION_11_2020',
FILENAME = '/var/opt/mssql/data/DBPartition_FG11_2020.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG12_2020
(NAME = 'PARTITION_12_2020',
FILENAME = '/var/opt/mssql/data/DBPartition_FG12_2020.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG1_2021
(NAME = 'PARTITION_1_2021',
FILENAME = '/var/opt/mssql/data/DBPartition_FG1_2021.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG2_2021
(NAME = 'PARTITION_2_2021',
FILENAME = '/var/opt/mssql/data/DBPartition_FG2_2021.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG3_2021
(NAME = 'PARTITION_3_2021',
FILENAME = '/var/opt/mssql/data/DBPartition_FG3_2021.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG4_2021
(NAME = 'PARTITION_4_2021',
FILENAME = '/var/opt/mssql/data/DBPartition_FG4_2021.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG5_2021
(NAME = 'PARTITION_5_2021',
FILENAME = '/var/opt/mssql/data/DBPartition_FG5_2021.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG6_2021
(NAME = 'PARTITION_6_2021',
FILENAME = '/var/opt/mssql/data/DBPartition_FG6_2021.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG7_2021
(NAME = 'PARTITION_7_2021',
FILENAME = '/var/opt/mssql/data/DBPartition_FG7_2021.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG8_2021
(NAME = 'PARTITION_8_2021',
FILENAME = '/var/opt/mssql/data/DBPartition_FG8_2021.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG9_2021
(NAME = 'PARTITION_9_2021',
FILENAME = '/var/opt/mssql/data/DBPartition_FG9_2021.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG10_2021
(NAME = 'PARTITION_10_2021',
FILENAME = '/var/opt/mssql/data/DBPartition_FG10_2021.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG11_2021
(NAME = 'PARTITION_11_2021',
FILENAME = '/var/opt/mssql/data/DBPartition_FG11_2021.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG12_2021
(NAME = 'PARTITION_12_2021',
FILENAME = '/var/opt/mssql/data/DBPartition_FG12_2021.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG1_2022
(NAME = 'PARTITION_1_2022',
FILENAME = '/var/opt/mssql/data/DBPartition_FG1_2022.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG2_2022
(NAME = 'PARTITION_2_2022',
FILENAME = '/var/opt/mssql/data/DBPartition_FG2_2022.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG3_2022
(NAME = 'PARTITION_3_2022',
FILENAME = '/var/opt/mssql/data/DBPartition_FG3_2022.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG4_2022
(NAME = 'PARTITION_4_2022',
FILENAME = '/var/opt/mssql/data/DBPartition_FG4_2022.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG5_2022
(NAME = 'PARTITION_5_2022',
FILENAME = '/var/opt/mssql/data/DBPartition_FG5_2022.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG6_2022
(NAME = 'PARTITION_6_2022',
FILENAME = '/var/opt/mssql/data/DBPartition_FG6_2022.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG7_2022
(NAME = 'PARTITION_7_2022',
FILENAME = '/var/opt/mssql/data/DBPartition_FG7_2022.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG8_2022
(NAME = 'PARTITION_8_2022',
FILENAME = '/var/opt/mssql/data/DBPartition_FG8_2022.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG9_2022
(NAME = 'PARTITION_9_2022',
FILENAME = '/var/opt/mssql/data/DBPartition_FG9_2022.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG10_2022
(NAME = 'PARTITION_10_2022',
FILENAME = '/var/opt/mssql/data/DBPartition_FG10_2022.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG11_2022
(NAME = 'PARTITION_11_2022',
FILENAME = '/var/opt/mssql/data/DBPartition_FG11_2022.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG12_2022
(NAME = 'PARTITION_12_2022',
FILENAME = '/var/opt/mssql/data/DBPartition_FG12_2022.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG1_2023
(NAME = 'PARTITION_1_2023',
FILENAME = '/var/opt/mssql/data/DBPartition_FG1_2023.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG2_2023
(NAME = 'PARTITION_2_2023',
FILENAME = '/var/opt/mssql/data/DBPartition_FG2_2023.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG3_2023
(NAME = 'PARTITION_3_2023',
FILENAME = '/var/opt/mssql/data/DBPartition_FG3_2023.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG4_2023
(NAME = 'PARTITION_4_2023',
FILENAME = '/var/opt/mssql/data/DBPartition_FG4_2023.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG5_2023
(NAME = 'PARTITION_5_2023',
FILENAME = '/var/opt/mssql/data/DBPartition_FG5_2023.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG6_2023
(NAME = 'PARTITION_6_2023',
FILENAME = '/var/opt/mssql/data/DBPartition_FG6_2023.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG7_2023
(NAME = 'PARTITION_7_2023',
FILENAME = '/var/opt/mssql/data/DBPartition_FG7_2023.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG8_2023
(NAME = 'PARTITION_8_2023',
FILENAME = '/var/opt/mssql/data/DBPartition_FG8_2023.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG9_2023
(NAME = 'PARTITION_9_2023',
FILENAME = '/var/opt/mssql/data/DBPartition_FG9_2023.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG10_2023
(NAME = 'PARTITION_10_2023',
FILENAME = '/var/opt/mssql/data/DBPartition_FG10_2023.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG11_2023
(NAME = 'PARTITION_11_2023',
FILENAME = '/var/opt/mssql/data/DBPartition_FG11_2023.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG12_2023
(NAME = 'PARTITION_12_2023',
FILENAME = '/var/opt/mssql/data/DBPartition_FG12_2023.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG1_2024
(NAME = 'PARTITION_1_2024',
FILENAME = '/var/opt/mssql/data/DBPartition_FG1_2024.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG2_2024
(NAME = 'PARTITION_2_2024',
FILENAME = '/var/opt/mssql/data/DBPartition_FG2_2024.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG3_2024
(NAME = 'PARTITION_3_2024',
FILENAME = '/var/opt/mssql/data/DBPartition_FG3_2024.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG4_2024
(NAME = 'PARTITION_4_2024',
FILENAME = '/var/opt/mssql/data/DBPartition_FG4_2024.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG5_2024
(NAME = 'PARTITION_5_2024',
FILENAME = '/var/opt/mssql/data/DBPartition_FG5_2024.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG6_2024
(NAME = 'PARTITION_6_2024',
FILENAME = '/var/opt/mssql/data/DBPartition_FG6_2024.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG7_2024
(NAME = 'PARTITION_7_2024',
FILENAME = '/var/opt/mssql/data/DBPartition_FG7_2024.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG8_2024
(NAME = 'PARTITION_8_2024',
FILENAME = '/var/opt/mssql/data/DBPartition_FG8_2024.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG9_2024
(NAME = 'PARTITION_9_2024',
FILENAME = '/var/opt/mssql/data/DBPartition_FG9_2024.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG10_2024
(NAME = 'PARTITION_10_2024',
FILENAME = '/var/opt/mssql/data/DBPartition_FG10_2024.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG11_2024
(NAME = 'PARTITION_11_2024',
FILENAME = '/var/opt/mssql/data/DBPartition_FG11_2024.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
,
FILEGROUP FG12_2024
(NAME = 'PARTITION_12_2024',
FILENAME = '/var/opt/mssql/data/DBPartition_FG12_2024.ndf',
SIZE = 2MB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 1MB )
GO

use [PARTITION]
-- Define the partition function with the correct range
create PARTITION FUNCTION OrderDatePartitionFunction (DATETIME) 
AS RANGE RIGHT FOR VALUES 
    ('2019-02-01 00:00:00.000', '2019-03-01 00:00:00.000',
     '2019-04-01 00:00:00.000', '2019-05-01 00:00:00.000', '2019-06-01 00:00:00.000',
     '2019-07-01 00:00:00.000', '2019-08-01 00:00:00.000', '2019-09-01 00:00:00.000',
     '2019-10-01 00:00:00.000', '2019-11-01 00:00:00.000', '2019-12-01 00:00:00.000',
     '2020-01-01 00:00:00.000', '2020-02-01 00:00:00.000', '2020-03-01 00:00:00.000',
     '2020-04-01 00:00:00.000', '2020-05-01 00:00:00.000', '2020-06-01 00:00:00.000',
     '2020-07-01 00:00:00.000', '2020-08-01 00:00:00.000', '2020-09-01 00:00:00.000',
     '2020-10-01 00:00:00.000', '2020-11-01 00:00:00.000', '2020-12-01 00:00:00.000',
     '2021-01-01 00:00:00.000', '2021-02-01 00:00:00.000', '2021-03-01 00:00:00.000',
     '2021-04-01 00:00:00.000', '2021-05-01 00:00:00.000', '2021-06-01 00:00:00.000',
     '2021-07-01 00:00:00.000', '2021-08-01 00:00:00.000', '2021-09-01 00:00:00.000',
     '2021-10-01 00:00:00.000', '2021-11-01 00:00:00.000', '2021-12-01 00:00:00.000',
     '2022-01-01 00:00:00.000', '2022-02-01 00:00:00.000', '2022-03-01 00:00:00.000',
     '2022-04-01 00:00:00.000', '2022-05-01 00:00:00.000', '2022-06-01 00:00:00.000',
     '2022-07-01 00:00:00.000', '2022-08-01 00:00:00.000', '2022-09-01 00:00:00.000',
     '2022-10-01 00:00:00.000', '2022-11-01 00:00:00.000', '2022-12-01 00:00:00.000',
     '2023-01-01 00:00:00.000', '2023-02-01 00:00:00.000', '2023-03-01 00:00:00.000',
     '2023-04-01 00:00:00.000', '2023-05-01 00:00:00.000', '2023-06-01 00:00:00.000',
     '2023-07-01 00:00:00.000', '2023-08-01 00:00:00.000', '2023-09-01 00:00:00.000',
     '2023-10-01 00:00:00.000', '2023-11-01 00:00:00.000', '2023-12-01 00:00:00.000',
     '2024-01-01 00:00:00.000', '2024-02-01 00:00:00.000', '2024-03-01 00:00:00.000',
     '2024-04-01 00:00:00.000', '2024-05-01 00:00:00.000', '2024-06-01 00:00:00.000',
     '2024-07-01 00:00:00.000', '2024-08-01 00:00:00.000', '2024-09-01 00:00:00.000',
     '2024-10-01 00:00:00.000', '2024-11-01 00:00:00.000', '2024-12-01 00:00:00.000');
GO

-- Define the partition scheme with 60 filegroups (1 per partition)
CREATE PARTITION SCHEME OrderDatePartitionScheme AS PARTITION OrderDatePartitionFunction 
TO 
    ([PRIMARY], [FG2_2019], [FG3_2019], [FG4_2019], [FG5_2019], [FG6_2019], 
     [FG7_2019], [FG8_2019], [FG9_2019], [FG10_2019], [FG11_2019], [FG12_2019], 
     [FG1_2020], [FG2_2020], [FG3_2020], [FG4_2020], [FG5_2020], [FG6_2020], 
     [FG7_2020], [FG8_2020], [FG9_2020], [FG10_2020], [FG11_2020], [FG12_2020], 
     [FG1_2021], [FG2_2021], [FG3_2021], [FG4_2021], [FG5_2021], [FG6_2021], 
     [FG7_2021], [FG8_2021], [FG9_2021], [FG10_2021], [FG11_2021], [FG12_2021], 
     [FG1_2022], [FG2_2022], [FG3_2022], [FG4_2022], [FG5_2022], [FG6_2022], 
     [FG7_2022], [FG8_2022], [FG9_2022], [FG10_2022], [FG11_2022], [FG12_2022], 
     [FG1_2023], [FG2_2023], [FG3_2023], [FG4_2023], [FG5_2023], [FG6_2023], 
     [FG7_2023], [FG8_2023], [FG9_2023], [FG10_2023], [FG11_2023], [FG12_2023], 
     [FG1_2024], [FG2_2024], [FG3_2024], [FG4_2024], [FG5_2024], [FG6_2024], 
     [FG7_2024], [FG8_2024], [FG9_2024], [FG10_2024], [FG11_2024], [FG12_2024]);
GO

-- Tạo bảng mới `order` với Partition Scheme

CREATE TABLE [order_new]
(
    order_id INT NOT NULL,
    order_date DATETIME NOT NULL,
    amount MONEY,
    discount_id INT,
    total_amount MONEY,
    payment_method NVARCHAR(100),
    customer_id BIGINT,
    employee_id INT,
    CONSTRAINT PK_order_new PRIMARY KEY (order_id, order_date)
)
ON OrderDatePartitionScheme (order_date);

SELECT 
    p.partition_number AS partition_number,
    f.name AS file_group,
    p.rows AS row_count
FROM 
    sys.partitions p
JOIN 
    sys.destination_data_spaces dds ON p.partition_number = dds.destination_id
JOIN 
    sys.filegroups f ON dds.data_space_id = f.data_space_id
WHERE 
    OBJECT_NAME(p.object_id) = 'order_new'
ORDER BY 
    partition_number;

--- Proc tự mở rộng cho năm tới
CREATE PROCEDURE AutoExpandPartition
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CurrentYear INT = YEAR(GETDATE());
    DECLARE @CurrentMonth INT = MONTH(GETDATE());
    DECLARE @PartitionFunctionName NVARCHAR(128) = 'PF_Monthly'; -- Tên hàm phân vùng
    DECLARE @PartitionSchemeName NVARCHAR(128) = 'PS_Monthly'; -- Tên sơ đồ phân vùng
    DECLARE @FileGroupPrefix NVARCHAR(128) = 'FG'; -- Tiền tố của FileGroup
    DECLARE @DatabaseName NVARCHAR(128) = DB_NAME();
    
    -- Kiểm tra và tạo filegroup mới nếu chưa tồn tại
    DECLARE @NextMonthStart DATE = DATEADD(MONTH, 1, DATEFROMPARTS(@CurrentYear, @CurrentMonth, 1));
    DECLARE @NextMonthYear INT = YEAR(@NextMonthStart);
    DECLARE @NextMonth INT = MONTH(@NextMonthStart);
    DECLARE @FileGroupName NVARCHAR(128) = @FileGroupPrefix + RIGHT('0' + CAST(@NextMonthYear AS NVARCHAR), 4) + '_' + RIGHT('0' + CAST(@NextMonth AS NVARCHAR), 2);

    IF NOT EXISTS (
        SELECT 1 FROM sys.filegroups WHERE name = @FileGroupName
    )
    BEGIN
        DECLARE @FileName NVARCHAR(MAX) = '/var/opt/mssql/data/DBPartition_' + @FileGroupName + '.ndf';

        DECLARE @SQL_FileGroup NVARCHAR(MAX) = 
        'ALTER DATABASE [' + @DatabaseName + '] ADD FILEGROUP [' + @FileGroupName + '];' + CHAR(13) +
        'ALTER DATABASE [' + @DatabaseName + '] ADD FILE ( NAME = ''PARTITION_' + @FileGroupName + ''', FILENAME = ''' + @FileName + ''', SIZE = 2MB, MAXSIZE = UNLIMITED, FILEGROWTH = 1MB ) TO FILEGROUP [' + @FileGroupName + '];';

        EXEC sp_executesql @SQL_FileGroup;
    END

    -- Kiểm tra và mở rộng phân vùng (Partition Function và Scheme)
    DECLARE @MaxRangeValue DATE;
    SELECT @MaxRangeValue = MAX(CONVERT(DATE, value)) FROM sys.partition_range_values
    WHERE function_id = OBJECT_ID(@PartitionFunctionName);

    IF @MaxRangeValue < @NextMonthStart
    BEGIN
        DECLARE @SQL_Partition NVARCHAR(MAX) = 
        'ALTER PARTITION FUNCTION ' + @PartitionFunctionName + '() SPLIT RANGE (''' + CAST(@NextMonthStart AS NVARCHAR) + ''');';

        EXEC sp_executesql @SQL_Partition;
    END
END
