const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/Tododbase')
  .then(() => console.log('Connected to MongoDB'))
  .catch(() => console.log('MongoDB connection error'));

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const TodoModel = mongoose.model('task1', todoSchema);

app.get('/', (req, res) => {
  res.send('Hello, Raveeeeee!');
});

app.get('/todo', async (req, res) => {
  try {
    const todos = await TodoModel.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error });
  }
});

app.post('/todo', async (req, res) => {
  const { title, description } = req.body;
  try {
    const todo = new TodoModel({ title, description });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).send('Failed to create todo');
  }
});

app.put('/todo/:id', async (req, res) => {
  const { title, description } = req.body;
  try {
    const updated = await TodoModel.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo', error });
  }
});

app.delete('/todo/:id', async (req, res) => {
  try {
    const deleted = await TodoModel.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.json({ message: 'Todo deleted successfully' });
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});