// updateDish.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/dishes', {
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

async function updateDish(dishId) {
  const dish = await Dish.findOne({ dishId });
  if (dish) {
    dish.isPublished = !dish.isPublished;
    await dish.save();
    console.log(`Dish ${dish.dishId} updated to ${dish.isPublished}`);
  } else {
    console.log('Dish not found');
  }
}

updateDish('1').then(() => mongoose.disconnect());
