const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const core = require('@babel/core');
const path = require('path');
const _ = require('lodash')

const isAsyncFuncNode = node => isFunc(node, { async: true })

const isFunc = (node, params) =>
  t.isFunctionDeclaration(node, params)
  || t.isArrowFunctionExpression(node, params)
  || t.isFunctionExpression(node, params)
  || t.isObjectMethod(node, params);

function transform(source) {
  const ast = parser.parse(source)
  const baseName = path.basename(this.resourcePath)
  // console.log('transform -> ast', ast)
  console.log(this.context, this.rootContext, this.resource, this.resourcePath)
  const catchCode = parser.parse(`console.error(e)`).program.body
  traverse(ast, {
    AwaitExpression(path) {
      while(path && path.node) {
        console.log('AwaitExpression -> path.node', path.node.type)
        let parentPath = path.parentPath
        if (t.isBlockStatement(path.node) && isAsyncFuncNode(parentPath.node)) {
          const tryCatchAst = t.tryStatement(
            path.node,
            t.catchClause(
              t.identifier('e'),
              t.blockStatement(catchCode)
            )
          )
          path.replaceWithMultiple([tryCatchAst])
          return
        } else if (t.isBlockStatement(path.node) && t.isTryStatement(parentPath.node)) {
          return
        }
        path = parentPath
      }
    },
  })
  const nextCode = core.transformFromAstSync(ast).code
  console.log(nextCode)
  return nextCode
}

module.exports = transform