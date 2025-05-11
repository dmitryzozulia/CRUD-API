import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
export default {
  mode: 'development',
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    port: process.env.PORT || 4000,
  },
};
