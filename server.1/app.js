import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import cors from 'cors';
import router from './router/userRoute';
import adsRouter from './router/adsRoute';
import adminRouter from './router/adminRoute';
import utilities from './helper/utilities';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerdoc = yaml.load(`${__dirname}/../swagger.yaml`);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerdoc));

app.use('/api/v1', router);
app.use('/api/v1', adsRouter);
app.use('/api/v1', adminRouter);

app.use('*', (req, res) => utilities.errorstatus(res, 404, 'This Route is Not On This Server'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app is listening on ${port}`);
});

export default app;
