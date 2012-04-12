module.exports = {
    "paths": [
        "test/**/*.js",
        "lib/**/*.js"
    ],
    "linterOptions": {
        "node": true,
        "vars": true,
        "nomen": true,
        "sloppy": true,
        "plusplus": true,
        "predef": [
            "assert",
            "refute",
            "buster",
            "cull",
            "document"
        ]
    },
    "excludes": [
        "underscore"
    ]
};
