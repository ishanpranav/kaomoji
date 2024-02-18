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

function match(kaomojis, emotion) {
    if (!emotion) {
        return kaomojis;
    }

    const results = [];

    for (const kaomoji of kaomojis) {
        if (kaomoji.isEmotion(emotion)) {
            results.push(kaomoji);
        }
    }

    return results;
}

readFile(kaomojiDataPath, (err, data) => {
    if (err) {
        throw err;
    }

    data = JSON.parse(data);

    const kaomojis = [];

    for (const datum of data) {
        kaomojis.push(new Kaomoji(datum.value, datum.emotions));
    }

    console.log(kaomojis);
    express()
        .use(express.static(publicPath))
        .use(express.urlencoded({ extended: false }))
        .use((request, _, next) => {
            console.log(request.method, request.path, request.query);
            next();
        })
        .set('view engine', 'hbs')
        .get('/', (_, response) => response.redirect('/editor'))
        .get('/dictionary', (request, response) => {
            response.render('dictionary', {
                kaomojis: match(kaomojis, request.query.emotion)
            });
        })
        .get('/editor', (_, response) => response.render('editor'))
        .post('/dictionary', (request, response) => {
            const emotions = request.body.emotions.split(',');

            for (let i = 0; i < emotions.length; i++) {
                emotions[i] = emotions[i].trim();
            }
            
            kaomojis.push(new Kaomoji(request.body.value, emotions));
            response.redirect('/dictionary');
        })
        .listen(3000);
});
