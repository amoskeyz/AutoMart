import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import router from './router/userRoute';
import carRouter from './router/carRoute';
import orderRouter from './router/orderRoute';
import adminRouter from './router/adminRoute';
import uploadRouter from './router/uploadRoute';
import utilities from './helper/utilities';


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));

const swaggerdoc = yaml.load(`${__dirname}/../swagger.yaml`);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerdoc));

app.use('/api/v1', router);
app.use('/api/v1', carRouter);
app.use('/api/v1', orderRouter);
app.use('/api/v1', adminRouter);
app.use('/api/v1', uploadRouter);


app.use('*', (req, res) => utilities.errorstatus(res, 404, 'This Route is Not On This Server'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app is listening on ${port}`);
});

export default app;
