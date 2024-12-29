INSERT INTO Branch (branch_name, address, opening_time, closing_time, status, phone_number, has_motorbike_parking, has_car_parking, area_id, manager)
VALUES
    ('Chi nhánh Bình Thạnh', '205 Đường Xô Viết Nghệ Tĩnh, Phường 17, Quận Bình Thạnh', '9:00:00', '23:00:00', 'Temporarily Closed', '902913562', '0', '0', '1', '241125001'),
    ('Chi nhánh Phú Nhuận', '7958 Đường Nguyễn Văn Trỗi, Phường 12, Quận Phú Nhuận', '9:00:00', '23:00:00', 'Open', '180251517', '0', '0', '1', '241125002'),
    ('Chi nhánh Gò Vấp', '4385 Đường Quang Trung, Phường 10, Quận Gò Vấp', '9:00:00', '23:00:00', 'Under Renovation', '614244015', '0', '1', '1', '241125003'),
    ('Chi nhánh Thủ Đức', '720 Đường Võ Văn Ngân, Phường Bình Thọ, TP Thủ Đức', '9:00:00', '23:00:00', 'Closed', '251334874', '0', '0', '3', '241125004'),
    ('Chi nhánh Tân Bình', '5282 Đường Hoàng Văn Thụ, Phường 4, Quận Tân Bình', '9:00:00', '23:00:00', 'Closed', '804572067', '1', '1', '1', '241125005'),
    ('Chi nhánh Quận 3', '7794 Đường Lê Văn Sỹ, Phường 14, Quận 3', '9:00:00', '23:00:00', 'Open', '356859637', '1', '1', '1', '241125006'),
    ('Chi nhánh Quận 7', '093 Đường Nguyễn Thị Thập, Phường Tân Hưng, Quận 7', '9:00:00', '23:00:00', 'Open', '162352770', '0', '0', '1', '241125007'),
    ('Chi nhánh Quận 5', '6925 Đường Trần Hưng Đạo, Phường 1, Quận 5', '9:00:00', '23:00:00', 'Open', '721796025', '1', '1', '5', '241125008'),
    ('Chi nhánh Quận 1', '473 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1', '9:00:00', '23:00:00', 'Open', '917998317', '0', '1', '1', '241125009'),
    ('Chi nhánh Quận 10', '580 Đường Sư Vạn Hạnh, Phường 12, Quận 10', '9:00:00', '23:00:00', 'Under Renovation', '677893452', '1', '0', '1', '241125010'),
    ('Chi nhánh Quận 4', '2313 Đường Hoàng Diệu, Phường 6, Quận 4', '9:00:00', '23:00:00', 'Open', '842637002', '1', '1', '1', '241125011'),
    ('Chi nhánh Quận 8', '4720 Đường Phạm Thế Hiển, Phường 5, Quận 8', '9:00:00', '23:00:00', 'Under Renovation', '131458472', '1', '1', '1', '241125012'),
    ('Chi nhánh Quận 6', '9380 Đường Hậu Giang, Phường 11, Quận 6', '9:00:00', '23:00:00', 'Open', '932322674', '0', '0', '1', '241125013'),
    ('Chi nhánh Quận 11', '9637 Đường Lạc Long Quân, Phường 5, Quận 11', '9:00:00', '23:00:00', 'Under Renovation', '452690339', '1', '0', '1', '241125014'),
    ('Chi nhánh Nhà Bè', '52313 Đường Nguyễn Văn Tạo, Xã Hiệp Phước, Huyện Nhà Bè', '9:00:00', '23:00:00', 'Under Renovation', '166150589', '1', '0', '1', '241125015');


INSERT INTO [dbo].[Employee] (employee_id, name, DOB, gender, dept_id, address, phone_number, user_id) VALUES
	('241125001', 'Orville Altenwerth', '1978-06-16T03:17:32.485', 'M', '81176', '1751 Jacobson Orchard', '141459437', '4'),
	('241125002', 'Mrs. Domingo Hammes III', '1965-12-18T02:40:50.731', 'M', '26489', '908 Liza Orchard', '700237247', '5'),
	('241125003', 'Kristy Abernathy', '1959-05-23T14:47:50.352', 'M', '47141', '2406 Lemke Highway', '844520505', '6'),
	('241125004', 'Tabitha Hammes', '1946-10-15T23:38:34.848', 'M', '93015', '015 Robel Parkways', '719550542', '7'),
	('241125005', 'Colleen Gibson IV', '1979-04-29T05:58:37.598', 'F', '31039', '6829 Jaskolski Ramp', '168450261', '8'),
	('241125006', 'Laurie Bernier', '1959-07-03T11:10:12.222', 'M', '18985', '669 Adams Lodge', '169998870', '9'),
	('241125007', 'Miss Josefina Franey', '1978-09-19T19:30:29.823', 'F', '62195', '3540 Steuber Flat', '277342283', '10'),
	('241125008', 'Barry Quigley', '2006-09-20T06:14:40.649', 'F', '46106', '19348 Demarcus Fields', '129865861', '11'),
	('241125009', 'Jake Harvey', '1995-08-17T19:59:29.074', 'F', '77046', '3582 Raegan Fall', '132066943', '12'),
	('241125010', 'Sarah Gottlieb', '1948-03-15T17:29:19.696', 'F', '73764', '083 Lebsack Knolls', '135484514', '13'),
	('241125011', 'Merle Bauch', '1999-10-12T16:10:10.851', 'M', '79947', '0315 Myah Green', '906675442', '14'),
	('241125012', 'Mike Friesen', '1961-12-23T19:52:04.382', 'F', '30892', '9035 Sylvester Corner', '994591723', '15'),
	('241125013', 'Miss Desiree King', '1952-05-30T03:09:22.947', 'F', '49022', '15210 Natasha Corner', '131358852', '16'),
	('241125014', 'Bradley Swaniawski', '1971-02-10T08:14:02.609', 'F', '31166', '1039 Jacynthe Course', '693445523', '17'),
	('241125015', 'Denise Stiedemann', '2006-12-23T18:09:08.049', 'F', '70418', '158 Beatty Mission', '274885868', '18');




INSERT INTO [Category] (category_id, category_name) VALUES
    (1, N'Sushi Truyền Thống'),
    (2, N'Sushi Đặc Biệt'),
    (3, N'Salad và Khai Vị'),
    (4, N'Món Nướng và Chiên'),
    (5, N'Cơm và Mì'),
    (6, N'Món Ăn Phụ'),
    (7, N'Đồ Uống');
GO
-- Section 1: Sushi Truyền Thống
INSERT INTO [Menu_Item] (item_id, item_name, price, status, category_id) VALUES
(1, N'Tôm Ebi', 199000, N'Available', 1),
(2, N'Cá Ngừ Maguro', 299000, N'Available', 1),
(3, N'Cá Thu Saba', 250000, N'Available', 1),
(4, N'Sashimi Cá Hồi', 350000, N'Available', 1),
(5, N'Sushi Nigiri', 179000, N'Available', 1),
(6, N'Trứng Tamago', 130000, N'Available', 1);

-- Section 2: Sushi Đặc Biệt
INSERT INTO [Menu_Item] (item_id, item_name, price, status, category_id) VALUES
    (7, N'Cuộn Cá Hồi Philadelphia', 299000, N'Available', 2),
    (8, N'Cuộn Cầu Vồng', 349000, N'Available', 2),
    (9, N'Cuộn Cá Ngừ Cay', 315000, N'Available', 2),
    (10, N'Cuộn Nhện (Spider Roll)', 350000, N'Available', 2),
    (11, N'Cuộn Tôm Tempura', 319000, N'Available', 2),
    (12, N'Cuộn Núi Lửa (Volcano Roll)', 375000, N'Available', 2);

-- Section 3: Salad và Khai Vị
INSERT INTO [Menu_Item] (item_id, item_name, price, status, category_id) VALUES
    (13, N'Đậu Nành Luộc (Edamame)', 50000, N'Available', 3),
    (14, N'Há Cảo Chiên (Gyoza)', 60000, N'Available', 3),
    (15, N'Kimchi Nhật Bản', 45000, N'Available', 3),
    (16, N'Cá Hồi Tempura', 120000, N'Available', 3),
    (17, N'Súp Miso', 35000, N'Available', 3),
    (18, N'Salad Rong Biển (Wakame)', 70000, N'Available', 3);

-- Section 4: Món Nướng và Chiên
INSERT INTO [Menu_Item] (item_id, item_name, price, status, category_id) VALUES
    (19, N'Cá Hồi Nướng Sốt Teriyaki', 349000, N'Available', 4),
    (20, N'Gà Chiên Karaage', 249000, N'Available', 4),
    (21, N'Gà Xiên Nướng Yakitori', 299000, N'Available', 4),
    (22, N'Mực Nướng Muối', 289000, N'Available', 4),
    (23, N'Cá Thu Nướng Muối Saba Shioyaki', 230000, N'Available', 4),
    (24, N'Tôm Chiên Tempura', 279000, N'Available', 4);


-- Section 5: Cơm và Mì
INSERT INTO [Menu_Item] (item_id, item_name, price, status, category_id) VALUES
    (25, N'Cơm Chiên Hải Sản', 250000, N'Available', 5),
    (26, N'Mì Ramen Tonkotsu', 299000, N'Available', 5),
    (27, N'Mì Soba Lạnh', 199000, N'Available', 5),
    (28, N'Mì Udon Hải Sản', 229000, N'Available', 5),
    (29, N'Cơm Cá Ngừ Cay', 315000, N'Available', 5),
    (30, N'Cơm Lươn Nướng Unagi', 359000, N'Available', 5);

-- Section 6: Món Ăn Phụ
INSERT INTO [Menu_Item] (item_id, item_name, price, status, category_id) VALUES
    (31, N'Bánh Gạo Mochi', 49000, N'Available', 6),
    (32, N'Dưa Chuột Muối', 35000, N'Available', 6),
    (33, N'Đậu Nành Luộc (Edamame)', 50000, N'Available', 6),
    (34, N'Kimchi Nhật Bản', 45000, N'Available', 6),
    (35, N'Khoai Tây Nghiền', 49000, N'Available', 6),
    (36, N'Cơm Trắng', 25000, N'Available', 6);

-- Section 7: Đồ Uống
INSERT INTO [Menu_Item] (item_id, item_name, price, status, category_id) VALUES
    (37, N'Coca-Cola', 20000, N'Available', 7),
    (38, N'Nước Ép Cam Tươi', 45000, N'Available', 7),
    (39, N'Nước Ép Lựu', 55000, N'Available', 7),
    (40, N'Nước Ép Táo', 50000, N'Available', 7),
    (41, N'Nước Suối', 10000, N'Available', 7),
    (42, N'Rượu Sake', 150000, N'Available', 7),
    (43, N'Trà Sữa Trân Châu', 40000, N'Available', 7),
    (44, N'Trà Xanh Nhật Bản (Matcha)', 55000, N'Available', 7);
GO