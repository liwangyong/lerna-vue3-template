module.exports = {
  // ATTENTION!!
  // Preset ordering is reversed, so `@babel/typescript` will called first
  // Do not put `@babel/typescript` before `@babel/env`, otherwise will cause a compile error
  // See https://github.com/babel/babel/issues/12066
  presets: [
    [
      "@babel/preset-env",
      {
        loose: true,
        modules: false
      }
    ],
    "@babel/typescript"
  ],
  plugins: [
    "@vue/babel-plugin-jsx",
    "@babel/proposal-class-properties",
    "@babel/transform-runtime",
  ],
  overrides: [
    {
      test: /\.vue$/,
      plugins: ["@babel/transform-typescript"]
    }
  ],
};
