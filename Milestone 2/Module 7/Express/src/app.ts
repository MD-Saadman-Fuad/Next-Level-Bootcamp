import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import {Pool} from 'pg';
import config from "./config";
import {pool} from "./db";


const app: Application = express();
// const port = config.port;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req: Request, res: Response) => {
  //   res.send('Hello World!')
  res.status(200).json({
    message: "Hello World!!! Express Server is running with TypeScript",
    "author": "PH Next Level",
  });
});
//post users
app.post('/api/users', async (req: Request, res: Response) => { 
    // console.log(req.body)
    const {name, email, password, age, } = req.body;
    try {
        const result = await pool.query(
        `INSERT INTO users (name, email, password, age) 
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, email, password, age]
    );
    // console.log(result.rows[0]);
    res.status(200).json({
        message: "Data received successfully",
        data: result.rows[0]
    })
    }
    catch (error : any) {
        // console.error('Error inserting data:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            error: error
        });
    }
});
//get all users
app.get('/api/users', async (req: Request, res: Response) => { 
    try {
        const result = await pool.query (`
            SELECT * FROM users
        `)
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows
        })
    }
    catch (error : any) {
        // console.error('Error retrieving users:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            error: error
        });
    }
 });
//get single user
app.get('/api/users/:id', async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const result = await pool.query(`
            SELECT * FROM users WHERE id = $1
        `, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: result.rows[0]
        });
    }
    catch (error : any) {
        // console.error('Error retrieving user:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            error: error
        });
    }
});

//update user

app.put('/api/users/:id', async (req: Request, res: Response) => {
    const userId = req.params.id;
    const {name, password, age, is_active} = req.body;

    // console.log(userId, name, password, age, is_active);

    try {
        const result = await pool.query(`
        UPDATE users 
        SET name = COALESCE($1, name), 
        password = COALESCE($2, password), 
        age = COALESCE($3, age), 
        is_active = COALESCE($4, is_active), 
        updated_at = NOW()

        WHERE id = $5
        RETURNING *
    `, [name, password, age, is_active, userId]);
    if (result.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0]
    });
    }
    catch (error : any) {
        // console.error('Error updating user:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            error: error
        });
    }

});
//Deleting users

app.delete('/api/users/:id', async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const result = await pool.query(`
            DELETE FROM users WHERE id = $1 RETURNING *
        `, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: result.rows[0]
        });
    }
    catch (error : any) {
        // console.error('Error deleting user:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            error: error
        });
    }
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });


export default app;