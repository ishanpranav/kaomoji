// kaomoji.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

/** Represents a Kaomoji. */
export class Kaomoji {
    /**
     * Initializes a new instance of the `Kaomoji` class.
     * 
     * @param {String} value    a string representation of the kaomoji.
     * @param {Array}  emotions an array of keywords describing the kaomoji.
     */
    constructor(value, emotions) {
        this.value = value;
        this.emotions = emotions;
    }

    /**
     * Determines if a given keyword describes the kaomoji. This method uses a
     * case insensitive, linear-time algorithm.
     * 
     * @param {String} value the keyword to test.
     * @return {Boolean} `true` if the given value describes the kaomoji;
     *                   otherwise, `false`.
     */
    isEmotion(value) {
        value = value.toLowerCase();

        for (const emotion of this.emotions) {
            if (emotion.toLowerCase() === value) {
                return true;
            }
        }

        return false;
    }
}
