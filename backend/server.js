import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import salaryRoutes from './routes/income.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import bucketRoutes from './routes/bucket.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/finance-tracker')
.then(() => {
    console.log('Connected to MongoDB successfully');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

app.use('/api/salary', salaryRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/bucket', bucketRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Finance Tracker API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});