--update salary
CREATE PROCEDURE [dbo].[SP_UpdateDepartmentSalary]
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
GO