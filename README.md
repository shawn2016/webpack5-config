# webpack5-config

#### 介绍


#### 安装教程

### webpack安装顺序

```
1. `npm init -y`，初始化包管理文件 package.json
2. 新建src源代码目录
3. 新建index.html
4. `yarn add webpack webpack-cli`,安装webpack相关包
5. 在项目根目录中，创建webpack.config.js 的配置文件
6. `yarn add webpack-dev-server`,安装支持项目自动打包的工具，并配置
7. `yarn add html-webpack-plugin`,安装生成预览页面插件并配置
8. `yarn add style-loader css-loader`,安装处理css文件的loader
9. `yarn add less-loader less`,安装处理less文件的loader
10. `yarn add sass-loader node-sass`,安装处理scss文件的loader
11. `yarn add postcss postcss-loader postcss-preset-env autoprefixer`,配置postCSS自动添加css的兼容前缀（可选）
12. `yarn add url-loader file-loader`,安装处理css文件中的图片和字体文件
13. `yarn add html-loader`,安装处理html文件中的图片和字体文件
14. `yarn add @babel/core babel-loader @babel/preset-env 前面3个是必须的，后面的看需要 @babel/plugin-transform-runtime @babel/plugin-proposal-class-properties`,安装处理js高级语法（ES6以上）
15. 之后看下面的插件安装代码。
```

```
yarn add html-webpack-plugin
yarn add style-loader css-loader
yarn add less-loader less
yarn add sass-loader node-sass
yarn add url-loader file-loader
yarn add html-loader
yarn add @babel/core babel-loader @babel/preset-env 前面3个是必须的，后面的看需要 @babel/plugin-transform-runtime @babel/plugin-proposal-class-properties
yarn add postcss postcss-loader postcss-preset-env 前面3个是必须的，后面的看需要 postcss-cssnext
yarn add mini-css-extract-plugin
yarn add optimize-css-assets-webpack-plugin
yarn add eslint eslint-loader eslint-webpack-plugin
yarn add eslint-config-airbnb-base 或 eslint-config-airbnb 或 vue的eslint
yarn add clean-webpack-plugin
```

**使用`npx babel-upgrade`将所有关于babel的插件都升级都最新版本以适应兼容性**

### 在.babelrc 中配置，或者在package.json中直接添加

```
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties"
  ]
}
```

### webpack.config.js中配置插件

```javascript
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

```

### webpack.config.js中配置插件

```js
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

```

### postcss.config.js配置

```js
module.exports = {
  // You can specify any options from https://postcss.org/api/#processoptions here
  // parser: 'sugarss',
  plugins: [
    // Plugins for PostCSS
    // ["postcss-short", { prefix: "x" }],
    "postcss-preset-env",
  ],
};
```

### .eslintlrc.js配置

```js
module.exports = {
  root: true,
  env: {
    commonjs: true,
    es6: true,
    browser: true,
    node: true
  },
  extends: [
    "airbnb-base",
    // 'plugin:vue/essential',
    // '@vue/standard'
  ],
  parserOptions: {
    ecmaVersion: 7,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
    parser: 'babel-eslint',
    sourceType: "module"
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}

```

### .gitignore配置

```
node_modules/*
package-lock.json
dist/*
.idea/*
```

### package.json配置

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "serve": "webpack serve",
    "dev": "webpack --config webpack.config.js",
    "build": "webpack --config webpack.pub.config.js"
  },
  "browserslist": {
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ],
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ]
  }
}

```

### 遇到的问题

1.  开发环境，热部署devServer的重新配置，在webpack.config.js中添加热部署的部分代码，之后在package.json
    文件内scripts中配置相应的webpack
2.  生产环境在package.json中的配置`"build": "webpack --config webpack.pub.config.js"`
3.  生产环境图片资源打包之后，网页显示不出来，需要在图片资源的打包中添加`publicPath: "../images"`,这个
    则是生成的页面中对图片路径的引用时，加上publicPath,这样访问时姐可以放到文件的正确地址了。
4.  css代码的兼容性处理，使用postcss-loader的配置，可以直接在use里加载postcss-loader的配置文件，也可以直接
    使用postcss-loader,让后打包时自动在根目录中找postcss.confgi.js配置文件，来加载postcss配置，此项目使用的
    外部postcss.confgi.js配置文件的配置方式。注意：还需要在package.json中定义browserlist
5.  **另外：目前还有生产环境懒加载和eslint校验代码的功能未完成，eslint的校验遇到问题`class Person {
    static info = { name: 'zs' };
    }`，在生产环境的webpack.pub.config.js中引入来插件eslint-webpack-plugin，配置了new ESLintPlugin(),
    但是提示错误信息如下，Parsing error: Unexpected token =**




#### 参与贡献




#### 特技

