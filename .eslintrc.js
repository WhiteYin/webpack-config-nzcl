module.exports = {
    "extends": ["eslint:recommended","plugin:react/recommended","nzcl"],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ]
};