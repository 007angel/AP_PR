const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { config } = require('./config/config');
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const routerApi = require('./routes');
routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server activo en localhost:${config.port}`);
});
