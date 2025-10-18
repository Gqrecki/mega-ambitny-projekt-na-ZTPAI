import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

const drinks = [
  { id: 1, name: 'Mojito', type: 'alkoholowy' },
  { id: 2, name: 'Virgin Mary', type: 'bezalkoholowy' },
  { id: 3, name: 'Whisky Sour', type: 'alkoholowy' }
];

// GET /api/drinks - lista trunków
app.get('/api/drinks', (req, res) => {
  res.status(200).json(drinks);
});

// GET /api/drinks/:id - szczegóły trunku
app.get('/api/drinks/:id', (req, res) => {
  const { id } = req.params;
  const numId = Number(id);

  if (isNaN(numId)) {
    return res.status(400).json({ error: 'Nieprawidłowy format ID' });
  }

  const drink = drinks.find(d => d.id === numId);
  if (!drink) {
    return res.status(404).json({ error: 'Trunek nie znaleziony' });
  }

  res.status(200).json(drink);
});

const PORT = process.env.PORT || 2115;
app.listen(PORT, () => {
  console.log(`Backend działa na porcie ${PORT}`);
});
