const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://Mujeeb:Mujeeb****@dishdashboard.8fjtrnj.mongodb.net/?retryWrites=true&w=majority&appName=DishDashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const dishSchema = new mongoose.Schema({
  dishId: String,
  dishName: String,
  imageUrl: String,
  isPublished: Boolean
});

const Dish = mongoose.model('Dish', dishSchema);

// Fetch all dishes
app.get('/api/dishes', async (req, res) => {
  const dishes = await Dish.find();
  res.json(dishes);
});

// Toggle isPublished status
app.put('/api/dishes/:id/toggle', async (req, res) => {
  const dish = await Dish.findById(req.params.id);
  dish.isPublished = !dish.isPublished;
  await dish.save();
  io.emit('dishUpdated');
  res.json(dish);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
