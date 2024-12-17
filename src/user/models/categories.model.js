const sql = require('mssql');
const config = require('../../configs/mssql.config'); // Import your database config

class CategoryModel {
    // Method to get all categories from the database
    static async getAllCategories() {
        try {
            // Connect to the database
            await sql.connect(config);

            // Query to fetch all categories
            const result = await sql.query('SELECT category_id, category_name FROM Category');
            
            // Return the categories data
            return result.recordset;  // This will return an array of categories
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Unable to fetch categories');
        } finally {
            await sql.close();  // Close the database connection
        }
    }
}

module.exports = CategoryModel;
