const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const employeeRoutes = require('./routes/employeeRoutes');
const roleRoutes = require('./routes/roleRoutes');
const projectRoutes = require('./routes/projectRoutes');
const accessRequestRoutes = require('./routes/accessRequestRoutes'); // Include access request routes
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/access-requests', accessRequestRoutes); // Use access request routes

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);
// MongoDB Connection
const uri = process.env.MONGODB_URI || 'mongodb+srv://navinvarghese04:Navin123@cluster0.ede5b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
