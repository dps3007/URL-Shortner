import 'dotenv/config'
import express from 'express';
import {autherizationMiddleware} from './middleware/auth.middleware.js'
import userRouter from './routes/user.routes.js'
import urlRouter from './routes/url.routes.js'

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());

//router
app.use(urlRouter);


app.use('/user',userRouter);



app.get('/', (req,res) => {
    return res.json({status: 'Server is up and running'});
});

app.listen(PORT, () => {
    console.log(`Server Running: ${PORT}`);
})