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
app.listen(3000);

console.log('Started server on port 3000');
