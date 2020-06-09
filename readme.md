## html-insert-tag-webpack-plugin
Insert tags into html  

## Install
```bash
  npm i html-insert-tag-webpack-plugin -D
```
## webpack.config.js
```js
    const HtmlWebpackPlugin = require('html-webpack-plugin'),
    HtmlInsertTagWebpackPlugin = require('html-insert-tag-webpack-plugin')
    module.exports = {
      plugins: [
        new HtmlWebpackPlugin(),
        new HtmlInsertTagWebpackPlugin([{
            tagName: 'link',
            inject: {
              tagName: 'head',
              location: 'before'
            },
            attributes: {
              href: 'http://www.example.com/css/common.css'
            }
          }, {
            tagName: 'script',
            inject: {
              tagName: 'body',
              location: 'after'  
            },
            attributes: {
              src: 'http://www.example.com/js/utils.js'
            }
          }, {
            tagName: 'div',
            inject: {
              tagName: 'body',
              location: 'scriptBefore'
            },
            attributes: {
              style: 'font-size: 18px'
            },
            innerHTML: 'html-insert-tag-webpack-plugin'
        }])
      ]
    }
    
```

### { Array\<object\> | object } options
| Name | Type | Description | Accepted Values | Default |
| ----- | :----: | ----- | :------: | :------: |
| tagName | string | Inserted tag name | - | - |
| inject | object | Inject the given tag configuration | - | - |
| inject.tagName | string | Inject the given tag name | head/body | head |
| inject.location | string | Injection location | after/before/scriptBefore | after |
| attributes | object | Tag attributes | - | - |
| innerHTML | string | The Element property innerHTML gets or sets the HTML or XML markup contained within the element. | - | - |
