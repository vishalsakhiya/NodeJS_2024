import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';

import db from './connections/db.js';
import { response } from './common/response.js';
import { PUBLIC_FOLDER } from './common/common.js';

// Routes
import user from './routes/user.js';
import userExperience from './routes/userExperience.js';
import userEducation from './routes/userEducation.js';
import auth from './routes/auth.js';

import { checkAuth } from './middlewares/authorization.js';

const app = express();
const router = express.Router();

// Midleware
app.use(
    express.json({}),
    express.urlencoded({ extended: true }),
    fileUpload({createParentPath: true}),
    cors({ origin: '*' }),
    express.static(PUBLIC_FOLDER),
);

db.connect((err) => {
    if (err) {
        console.log('DB Connection Error: ', err.stack)
    } else {
        console.log('DB Connected. Connection ID: ', db.threadId);
    };
});

app.use('/auth', auth);
app.use('/user', user);
app.use('/user-experience',checkAuth, userExperience);
app.use('/user-education', checkAuth, userEducation);

app.use('/', router);

router.get('/', (req, res) => response(res, {
    message: 'Welcome to LMS API',
}));

router.all('*', (req, res) => response(res, {
    message: 'The route does not exist',
    error: `${req.url} not found`,
    status: 404,
}))

export default app;