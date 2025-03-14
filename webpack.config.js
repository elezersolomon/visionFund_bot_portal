const path = require('path');

module.exports = {
    // Other configuration options...

    resolve: {
        fallback: {
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "path": require.resolve("path-browserify"),
            "util": require.resolve("util/"),
            "buffer": require.resolve("buffer/")
        },
        alias: {
            'buffer': require.resolve('buffer/'),
        }
    },

    // Other configuration options...
};
