module.exports = {
    "ecmaFeatures": {
      "blockBindings": true
    },
    "extends": [
        "airbnb",
        "plugin:react/recommended"
    ],
    "plugins": [
        "react"
    ],
    "env": {
      "browser": true,
      "node": true,
      "mocha": true,
      "es6": true,
      "commonjs": true
    },
    "rules": {
      "comma-dangle": [
        1,
        "only-multiline"
      ],
      "new-cap": [
        1,
        { "capIsNewExceptions": ["TEXT", "DECIMAL"] }
      ],
     "quotes": [
        1,
        "single"
      ],
      "spaced-comment": [
        1,
        "always"
      ],
      "space-before-function-paren": 1,
      "max-len": [
        1,
        80
      ],
      "no-unused-vars": 1,
      "no-unused-expressions": "warn",
      "no-param-reassign": "warn",
      "no-console": "warn",
      "import/no-extraneous-dependencies": [
        2,
        {"devDependencies": true}
      ]
    }
};