'use strict'

const sql = require('mssql')
const TABLE_NAME = 'Customer'

//// bulk insert
const customerSchema = sql.Table(TABLE_NAME)
customerSchema.columns.add('customer_id', sql.Int, {nullable: false})
customerSchema.columns.add('name', sql.NVarchar(250), {nullable: false})
customerSchema.columns.add('date_of_birth', sql.Date, {nullable: true})
customerSchema.columns.add('phone_number', sql.NVarchar(15), {nullable: false})
customerSchema.columns.add('email', sql.NVarchar(50), {nullable: false})
customerSchema.columns.add('identity_card', sql.Int, {nullable: false})
customerSchema.columns.add('gender', sql.Int, {nullable: true})
customerSchema.columns.add('member_card_number', sql.Int, {nullable: false})
customerSchema.columns.add('card_type', sql.NVarchar(50), {nullable: false})
customerSchema.columns.add('accumulated_spending', sql.Int, {nullable: false})
customerSchema.columns.add('created_at', sql.DateTime, {nullable: false})


// data

// pool request to insert, delete, update