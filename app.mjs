// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import express from 'express';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const basePath = dirname(fileURLToPath(import.meta.url));
const publicPath = resolve(basePath, 'public');

app.use(express.static(publicPath));
app.set('view engine', 'hbs');
app.get('/', (_, response) => {
    response.redirect('/editor');
});
app.get('/dictionary', (_, response) => {
    response.render('dictionary', {});
});
app.get('/editor', (_, response) => {
    response.render('editor', {});
});
app.listen(3000);

console.log('Started server on port 3000');
