const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
// 导入每次删除文件夹的插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// 复用loader加载器
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  // css兼容性处理
  // 还需要在package.json中定义browserlist
  'postcss-loader'
  // 下面是根据路径找配置文件
  // {
  //   loader: 'postcss-loader',
  //   options: {
  //     postcssOptions:{
  //       config:'./postcss.config.js'
  //     }
  //   }
  // }
];

// 定义node.js到环境变量，决定使用browserslist的哪个环境
process.env.NODE_ENV = 'production';

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'js/bundle.js',
    path: resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          ...commonCssLoader,
        ]
      },
      {
        test: /\.less$/,
        use: [
          ...commonCssLoader,
          'less-loader'
        ]
      },

      // {
      //   // eslint语法检查，在package.json中eslintConfig --> airbnb的校验规则
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   // 优先执行，先执行eslint在执行babel
      //   enforce: 'pre',
      //   loader: 'eslint-loader',
      //   options: {
      //     fix: true
      //   }
      // },
      {
        // js代码兼容性处理
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', //基础预设
              {
                useBuiltIns: 'usage', // 按需加载
                corejs: {
                  version: 3
                },
                targets: {
                  // 兼容到什么版本到浏览器
                  chrome: '60',
                  firefox: '50',
                  ie: '9',
                  safari: '10',
                  edge: '17'
                }
              }
            ]],
          plugins: ['@babel/transform-runtime','@babel/plugin-proposal-class-properties'],
        }
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
            // publicPath :  这个则是生成的页面中对图片路径的引用时，加上publicPath。
            publicPath: "../images"
          }
        }
      },
      // 处理html中img资源
      {
        test: /.\html$/,
        loader: 'html-loader'
      },
      // 处理其他⽂件
      {
        exclude: /\.(js|css|less|html|jpg|png|gif)/,
        loader: 'file-loader',
        options: { outputPath: 'media', },
      },
    ]
  },
  plugins: [
    // css代码单独抽离
    new MiniCssExtractPlugin({
      filename: 'css/bundle.css'
    }),
    // css代码压缩
    new OptimizeCssAssetsWebpackPlugin(),
    // html文件压缩
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true
      }
    }),
    // new ESLintPlugin({
    //   exclude:'node_modules',
    //   fix:true
    // }),
    new CleanWebpackPlugin(),
  ]
  ,
  mode: 'production'
};
