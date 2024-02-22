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
    const kaomojiMap = new Map();

    for (const datum of data) {
        const kaomoji = new Kaomoji(datum.value, datum.emotions);

        kaomojis.push(kaomoji);
        
        for (const emotion of datum.emotions) {
            kaomojiMap.set(emotion.toLowerCase(), kaomoji);
        }
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
            response.render('list', {
                kaomojis: match(kaomojis, request.query.emotion)
            });
        })
        .get('/editor', (_, response) => response.render('editor'))
        .post('/dictionary', (request, response) => {
            const emotions = request.body.emotions.split(",");
            const added = new Kaomoji(request.body.value, emotions);

            for (let i = 0; i < emotions.length; i++) {
                emotions[i] = emotions[i].trim();

                kaomojiMap.set(emotions[i], added);
            }

            kaomojis.push(added);
            response.redirect('/dictionary');
        })
        .post('/editor', (request, response) => {
            const matches = request.body.message.matchAll(/\w+/g);
            const tokens = [];

            for (const match of matches) {
                const [word] = match;
                const token = kaomojiMap.get(word.toLowerCase());

                if (token) {
                    tokens.push(token.value, ' ');

                    continue;
                }

                tokens.push(word, ' ');
            }

            response.render('editor', {
                response: tokens.join("")
            });
        })
        .listen(3000);
});
