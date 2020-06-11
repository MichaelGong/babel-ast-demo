/**
 全部情况
 async function asyncFunc() {
  const val = await Promise.resolve(2)
  console.log(val)
}

asyncFunc()
const a = () => console.log('1')

const b = function() {
	console.log('22')
}
const obj = {
  a: function(){},
  b: () => {},
  v(){},
}
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const core = require('@babel/core');
const path = require('path');
const _ = require('lodash')


const isFunc = (node, params) =>
  t.isFunctionDeclaration(node, params)
  || t.isFunctionExpression(node, params)
  || t.isArrowFunctionExpression(node, params)
  || t.isObjectMethod(node, params);

function transform(source) {
  const ast = parser.parse(source)
  const baseName = path.basename(this.resourcePath)
  traverse(ast, {
    CallExpression(path) {
      if (t.isMemberExpression(path.node.callee) && path.node.callee.object.name === 'console') {
        const parentFn = path.findParent(path => isFunc(path.node))
        const parentFnName = parentFn ? _.get(parentFn, 'node.id.name', '') : ''
        const { line, column } = path.node.callee.object.loc.start
        path.node.arguments.unshift(t.stringLiteral(
          `${baseName ? `${baseName}:` : ''}${parentFnName ? `${parentFnName}` : ''} line: ${line}`,
        ))
      }
    }
  })
  const nextCode = core.transformFromAstSync(ast).code
  console.log('console:', nextCode)
  return nextCode
}

module.exports = transform