const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('./models/Student');
const Staff = require('./models/Staff');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.warn('MONGO_URI is not set in .env. Please configure it to use MongoDB.');
}

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err.message);
});

// GET /api/students?batch=2022-2026
// Here, each batch is its own collection (e.g. '2022-2026')
app.get('/api/students', async (req, res) => {
    try {
        const { batch } = req.query;

        if (!batch) {
            return res.status(400).json({ message: 'batch query parameter is required' });
        }

        const db = mongoose.connection.db;
        const collection = db.collection(batch);
        const docs = await collection.find({}).toArray();

        const mapped = docs.map((s) => ({
            // Simplified fields used by the UI
            id: (s._id || s.registerNo)?.toString(),
            name: s.name,
            reg: s.registerNo,
            cgpa: s.cgpa,
            ten: s.xPercentage,
            twelve: s.xiiPercentage,
            dip: s.diplomaPercentage,
            currentArr: s.standingArrears,
            histArr: s.historyOfArrears,
            dept: s.department,
            college: s.college,
            email: s.primaryEmail,
            phone: s.mobile1,

            // Original DB fields for column selection/export
            registerNo: s.registerNo,
            gender: s.gender,
            dob_ddMmmYyyy: s.dob_ddMmmYyyy,
            dob_ddMmYyyy: s.dob_ddMmYyyy,
            motherTongue: s.motherTongue,
            yearOfGraduation: s.yearOfGraduation,
            xPercentage: s.xPercentage,
            xiiPercentage: s.xiiPercentage,
            diplomaPercentage: s.diplomaPercentage,
            standingArrears: s.standingArrears,
            historyOfArrears: s.historyOfArrears,
            primaryEmail: s.primaryEmail,
            alternateEmail: s.alternateEmail,
            mobile1: s.mobile1,
            mobile2: s.mobile2,
        }));

        res.json(mapped);
    } catch (err) {
        console.error('Error fetching students:', err.message);
        res.status(500).json({ message: 'Failed to fetch students' });
    }
});

// GET /api/batches -> list collection names used as batch years
app.get('/api/batches', async (_req, res) => {
    try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        const batches = collections
            .map((c) => c.name)
            // Exclude Staff, students, and system collections
            .filter((name) => name !== 'students' && !name.startsWith('system.'));

        batches.sort();
        res.json(batches);
    } catch (err) {
        console.error('Error fetching batches:', err.message);
        res.status(500).json({ message: 'Failed to fetch batches' });
    }
});

// GET /api/staffs -> list of staff for dropdown
app.get('/api/staffs', async (_req, res) => {
    try {
        const docs = await Staff.find({}).select('name').lean();
        res.json(docs);
    } catch (err) {
        console.error('Error fetching staffs:', err.message);
        res.status(500).json({ message: 'Failed to fetch staffs' });
    }
});

app.post('/api/verify', async (req, res) => {
    const { staffName, code } = req.body;

    try {
        if (!staffName) {
            return res.status(400).json({ success: false, message: 'Staff name is required' });
        }

        const staff = await Staff.findOne({ name: staffName }).lean();
        if (!staff) {
            return res.status(401).json({ success: false, message: 'Staff not found' });
        }

        // Compare provided code with stored password field
        if (!code || code !== staff.password) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        return res.json({ success: true, message: 'Verified' });
    } catch (err) {
        console.error('Error verifying staff:', err.message);
        res.status(500).json({ success: false, message: 'Verification failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
