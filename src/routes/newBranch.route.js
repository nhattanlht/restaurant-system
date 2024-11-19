const express = require('express');
const router = express.Router();

const { NewBranchController, getNewBranch } = require('../controllers/newBranch.controller');

// Create a new branch
router.get('/', getNewBranch);
router.post('/', NewBranchController.newBranch);

// Search users based on query parameters
router.get('/search', async (req, res) => {
    const { name, email, role } = req.query;

    // Prepare the SQL query
    let query = 'SELECT * FROM Users WHERE 1=1';
    const params = [];

    if (name) {
        query += ' AND name LIKE @name';
        params.push({ name: 'name', type: mssql.NVarChar, value: `%${name}%` });
    }

    if (email) {
        query += ' AND email LIKE @email';
        params.push({ name: 'email', type: mssql.NVarChar, value: `%${email}%` });
    }

    if (role) {
        query += ' AND role = @role';
        params.push({ name: 'role', type: mssql.NVarChar, value: role });
    }

    try {
        const mssql = require('../db/init.mssql');
        const result = await mssql.query({ query: query, parameters: params });
        res.render('searchResults', { users: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error occurred while searching for users.");
    }
});

module.exports = router;
