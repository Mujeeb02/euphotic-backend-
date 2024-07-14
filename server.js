const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_CONNECTION_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);  
  });

const dishSchema = new mongoose.Schema({
  dishId: String,
  dishName: String,
  imageUrl: String,
  isPublished: Boolean,
});

const Dish = mongoose.model('Dish', dishSchema);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Fetch all dishes
app.get('/api/dishes', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Toggle isPublished status
app.put('/api/dishes/:id/toggle', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    dish.isPublished = !dish.isPublished;
    await dish.save();
    io.emit('dishUpdated');
    res.json(dish);
  } catch (error) {
    console.error('Error toggling dish status:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
