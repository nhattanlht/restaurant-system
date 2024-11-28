const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const foodFilterRoutes = require('./routes/search_filter.route.js'); // Import route filter

// Set the port to listen
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/filter', foodFilterRoutes);

// Home Route
app.get('/', (req, res) => {
    res.send('Welcome to Food Filter App! Visit /foods/filter to filter foods.');
});

// Handle 404
app.use((req, res) => {
    res.status(404).send('404: Page not found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
