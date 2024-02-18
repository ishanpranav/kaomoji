// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import express from 'express';
import { readFile } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { Kaomoji } from './kaomoji.mjs';

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const publicPath = resolve(rootDirectory, 'public');
const kaomojiDataPath = join(rootDirectory, 'code-samples', 'kaomojiData.json');

readFile(kaomojiDataPath, (err, data) => {
    if (err) {
        throw err;
    }

    data = JSON.parse(data);

    const kaomojiData = [];

    for (const datum of data) {
        kaomojiData.push(new Kaomoji(datum.value, datum.emotions));
    }

    console.log(kaomojiData);
    express()
        .use(express.static(publicPath))
        .use(express.urlencoded({ extended: false }))
        .use((request, _, next) => {
            console.log(request.method, request.path, request.query);
            next();
        })
        .set('view engine', 'hbs')
        .get('/', (_, response) => response.redirect('/editor'))
        .get('/dictionary', (_, response) => response.render('dictionary', {}))
        .get('/editor', (_, response) => response.render('editor', {}))
        .listen(3000);
});
