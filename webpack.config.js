const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const OptimizeCssAssetPlugin = require("optimize-css-assets-webpack-plugin")
const TerserWebpackPlugin = require("terser-webpack-plugin")
const autoprefixer = require('autoprefixer')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = ()=>{
  const config = {

  }

  if(isProd){
    config.minimizer = [
      new OptimizeCssAssetPlugin(),
      new TerserWebpackPlugin()
    ]
  }
  return config
} 

module.exports = {
  entry : "./src",
  output : {
    path : path.resolve(__dirname,'dist'),
    filename : "bundle.js"
  },
  optimization : optimization(),
  devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 8080,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename : "style.css",
        options : {
           hmr : isDev,
           reloadAll: true
        }
      }),
      new HtmlWebpackPlugin({
        template : "./src/index.html",
        minify: {
          collapseWhitespace: isProd
        }
      }),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename : "style.css"
      }),
      new CopyWebpackPlugin({
          patterns : [
            {
              from : path.resolve(__dirname, 'src/fonts'),
              to : path.resolve(__dirname, 'dist/fonts')
            },
            {
              from : path.resolve(__dirname, 'src/img'),
              to : path.resolve(__dirname, 'dist/img')
            }
          ]
        }),

    ],
    module: {
      rules: [
          {
            test : /\.css$/,
            use : [MiniCssExtractPlugin.loader, "css-loader"]
          },
          {
            test : /\.less$/,
            use : [
                    {
                      loader: MiniCssExtractPlugin.loader
                    },

                    {
                      loader: 'css-loader'
                    },
                    {
                      loader: 'postcss-loader',
                      options: {
                          plugins: [
                              autoprefixer()
                          ],
                          sourceMap: true
                      }
                    },
                    {
                      loader: 'less-loader'
                    },
                  ]
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/i,
            use: [
              {
                loader: 'file-loader',
                options:{
                  outputPath : "img/",
                  name: '[path][name].[ext]',
                }
              },
            ],
         },
         {
          test: /\.(woff(2)?|ttf|eot)/,
          use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  outputPath: 'fonts/'
                  }
              }
            ]
          },
      ]
    },
}