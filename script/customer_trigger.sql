--Kiểm tra có tồn tại email và phone number của khách hàng chưa
create or alter trigger TG_Check_DupInfoCus on Customer 
for insert 
as
begin
    if exists(select * from Customer c join inserted i on c.email = i.email)
	begin
		ROLLBACK TRANSACTION;
		RAISERROR('Email already exists', 16, 1); -- 16 indicates a user error
        RETURN;
	end
	   if exists(select * from Customer c join inserted i on c.phone_number = i.phone_number)
	begin
	ROLLBACK TRANSACTION;
		RAISERROR('Phone number already exists', 16, 1); -- 16 indicates a user error
        RETURN;
	end
end