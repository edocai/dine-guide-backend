import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { pool } from './db';


const app = express();

//middleware
app.use(morgan('dev'));
app.use(express.json());

app.use(cors());
//GET: Get All Restaurants
app.get('/api/v1/restaurants', async (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
  try {
    const restaurantRatingsData = await pool.query(
      'select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;',
    );

    res.status(200).json({
      status: 'success',
      results: restaurantRatingsData.rows.length,
      data: {
        restaurants: restaurantRatingsData.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

//GET: Get a Restaurant
app.get('/api/v1/restaurants/:id', async (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
  try {
    const restaurant = await pool.query(
      'SELECT * from restaurants WHERE id = $1',
      [req.params.id],
    );
    const reviews = await pool.query(
      'SELECT * from reviews WHERE restaurant_id = $1',
      [req.params.id],
    );
    res.status(200).json({
      status: 'success',
      data: {
        restaurant: restaurant.rows[0],
        reviews: reviews.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

//POST: Create a Restaurant
app.post('/api/v1/restaurants', async (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
  try {
    const results = await pool.query(
      'INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) returning *',
      [req.body.name, req.body.location, req.body.price_range],
    );
    res.status(201).json({
      status: 'created',
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

//PUT: Update Restaurants
app.put('/api/v1/restaurants/:id', async (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
  try {
    const results = await pool.query(
      'UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 returning *',
      [req.body.name, req.body.location, req.body.price_range, req.params.id],
    );
    res.status(200).json({
      status: 'updated',
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

//DELETE: Delete a Restaurant
app.delete('/api/v1/restaurants/:id', async (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
  try {
    const results = await pool.query('DELETE FROM restaurants WHERE id = $1', [
      req.params.id,
    ]);
    res.status(204).json({
      status: 'deleted',
      data: {
        restaurants: results.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

//POST: Add a Review
app.post('/api/v1/restaurants/:id/addReview', async (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
  try {
    const newReview = await pool.query('INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;', [req.params.id, req.body.name, req.body.review, req.body.rating]);
    res.status(201).json({
      status: 'success',
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

export default app;
