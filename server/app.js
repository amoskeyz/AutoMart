import express from 'express';
import bodyParser from 'body-parser';
import router from './router/userRoute';
import adsRouter from './router/adsRoute';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', router);
app.use('/api/v1', adsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app is listening on ${port}`);
});

export default app;
