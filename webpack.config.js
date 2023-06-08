module.exports = {
    entry: "./src/index.tsx",
    module: {
        rules: [
          {
            test: /\.(png|jpe?g|gif|svg)$/i,
            use: [
              {
                loader: "file-loader",
              },
            ],
          },
        ],
      },
}