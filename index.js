const schema = require('schema-utils')
const jsdom = require('jsdom')

class HtmlInsertTagWebpackPlugin {
  options = []
  constructor (options) {
    const rule = {
      type: 'object',
      required: ['tagName'],
      properties: {
        tagName: {
          type: 'string'
        },
        inject: {
          type: 'object',
          properties: {
            tagName: {
              type: 'string',
              enum: ['head', 'body'],
              default: 'head'
            },
            location: {
              type: 'string',
              enum: ['after', 'before', 'scriptBefore'],
              default: 'after'
            }
          }
        },
        attributes: {
          type: 'object'
        },
        innerHTML: {
          type: 'string'
        }
      },
      additionalProperties: true
    }
    schema(rule, options , {name: 'html-insert-tag-webpack-plugin'})
    this.initOptions(options)
  }
  initOptions (options) {
    const defaultOptions = {
      inject: {
        tagName: 'head',
        location: 'after'
      },
      attributes: {},
      innerHTML: ''
    }
    this.options = Array.isArray(options)
    ? options.map((data) => Object.assign({}, defaultOptions, data))
    : [Object.assign({}, defaultOptions, options)]
  }
  apply (compiler) {
    compiler.hooks.compilation.tap('HtmlInsertTag', (compilation) => {
      const plugins = compilation.options.plugins
      const htmlWebpackPlugin = plugins.find(plugin => {
        return plugin.constructor.name === 'HtmlWebpackPlugin'
      })
      if (!htmlWebpackPlugin) return
      htmlWebpackPlugin.constructor.getHooks(compilation).beforeEmit.tapAsync(
        'HtmlInsertTag',
        (data, cb) => {
          const dom = new jsdom.JSDOM(data.html),
            doc = dom.window.document
          this.options.forEach(({tagName, inject, attributes, innerHTML}) => {
            const tag = doc.createElement(tagName),
              parentTag = doc.querySelector(inject.tagName)
            tag.innerHTML = innerHTML
            this.setAttrs(tag, attributes)
            this.insertToParent(tag, parentTag, inject)
          })
          data.html = dom.serialize()
          cb(null, data)
        }
      )
    })
  }
  setAttrs (tag, attributes) {
    Object.keys(attributes).forEach(attr => tag.setAttribute(attr, attributes[attr]))
  }
  insertToParent(tag, parentTag, { location }) {
    if (location === 'after') return parentTag.appendChild(tag)
    const dom = location === 'before' ? parentTag.firstElementChild : parentTag.querySelector('script')
    dom ? parentTag.insertBefore(tag, dom) : parentTag.appendChild(tag)
  }
  // 暂时不用这个方案
  __spare (htmlWebpackPlugin, compilation) {
      htmlWebpackPlugin.constructor.getHooks(compilation).alterAssetTagGroups.tapAsync(
        'WebpackPlugin',
        (data, cb) => {
          ({ headTags: this.headTags, bodyTags: this.bodyTags } = data)
          this.options.forEach(({tagName, inject: { tagName: injectTagName, location }, attributes}) => {
            this[`${injectTagName}Tags`][location === 'after' ? 'push' : 'unshift']({
              tagName,
              attributes
            })
          })
          cb(null, data)
        }
      )
  }
}

module.exports = HtmlInsertTagWebpackPlugin