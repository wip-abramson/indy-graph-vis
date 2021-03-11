/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */
let path = require('path')
// You can delete this file if you're not using it

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  console.log("Creating pages")
  const didPageTemplate = path.resolve(`src/templates/did-page.js`)
  const result = await graphql(`
    query {
      indy {
        dids {
          edges {
            node {
              did
            }
          }
        }
      }
    }
  `)
  result.data.indy.dids.edges.forEach(edge => {
    createPage({
      path: `did/${edge.node.did}`,
      component: didPageTemplate,
      context: {
        did: edge.node.did,
      },
    })
  })

  const schemaPageTemplate = path.resolve(`src/templates/schema-page.js`)
  const schemaResult = await graphql(`
    query {
      indy {
        schemas {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `)
  schemaResult.data.indy.schemas.edges.forEach(edge => {
    createPage({
      path: `schema/${edge.node.id}`,
      component: schemaPageTemplate,
      context: {
        id: edge.node.id,
      },
    })
  })
}
