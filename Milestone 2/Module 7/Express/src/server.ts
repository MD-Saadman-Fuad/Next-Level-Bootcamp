import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import {Pool} from 'pg';
import dotenv from 'dotenv';


const app: Application = express();
const port = 5000;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING
});


app.get("/", (req: Request, res: Response) => {
  //   res.send('Hello World!')
  res.status(200).json({
    message: "Hello World!!! Express Server is running with TypeScript",
    "author": "PH Next Level",
  });
});

app.post('/', async (req: Request, res: Response) => { 
    // console.log(req.body)
    const {name, email, password} = req.body;
    res.status(200).json({
        message: "Data received successfully",
        data: {name, email}
    })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
