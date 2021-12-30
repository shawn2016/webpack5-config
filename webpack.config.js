const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, './src/main.js'),
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
  },
  // 插件
  plugins: [
    // html
    new htmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html'),
      filename: 'index.html',
    }),
    // 打包前清除dist
    new CleanWebpackPlugin(),
  ],
  // Loaders 部分
  module: {
    rules: [
      {
        // test设置需要匹配的文件类型，支持正则
        test: /\.css$/,
        // use表示该文件类型需要调用的loader
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|gif|bmp|jpg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8 * 1024,
            // 图片取10位hash和文件扩展名
            name: '[hash:10].[ext]',
            // 关闭es6模块化
            esModule: false,
            //  图片资源的输出路径
            outputPath: 'images',
          },
        },
      },
      // 处理html中img资源
      {
          test: /.\html$/,
          loader: "html-loader"
      },
      //  处理其他资源(一般指的就是字体资源等)
      // {
      //     exclude: /\.(html|js|css|less|scss|jpg|png|gif)/,
      //     loader: "file-loader",
      //     outputPath:'media'
      // },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
    ],
  },
  // 使用webpck-dev-server时配置
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, './dist'),
    open: true,
    hot: true,
    quiet: true,
    port: 3000,
  },
};
