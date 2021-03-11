import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import SchemaVisualisation from "../components/SchemaVisualisation"

const SchemaPage = ({data}) => (
  <Layout>
    {/*<SEO title="Page two" />*/}

    <h1>Name: {data.indy.schema.name}</h1>
    <h2>ID: {data.indy.schema.id}</h2>
    <h2>Attributes</h2>
    <div>
      <ul>
        {data.indy.schema.attrNames.map(name => {
          console.log(name)
          return (<li key={name}>{name}</li>)
        })}
      </ul>
    </div>
    {/*<h2>Authored DIDs: {data.indy.did.createdDids.count}</h2>*/}
    {/*<h2>Authored Schemas: {data.indy.did.createdSchema.count}</h2>*/}
    <h2>Definitions: {data.indy.schema.definitions.count}</h2>
    <Link to="/">Go back to the homepage</Link>
    <SchemaVisualisation schema={data.indy.schema}/>
  </Layout>
)


export const SchemaTemplaterQuery = graphql`
  query SchemaQuery($id: String!) {
    indy {
      schema(id: $id) {
        id
        name
        version
        attrNames
        txnType
        author {
          did
          role
          txnType
          author {
            did
            role
            txnType
          }
        }
        definitions {
          count

          edges {
            node {
              id
              txnType
              author {
                did
                role
                txnType
                createdDefinitions {
                  count
                }
                createdDids {
                  count
                }
#                endorser {
#                  did
#                }
                author {
                  did
                  role
                  txnType
                }
              }
            }
          }
        }
      }
    }
     
  }
`;

export default SchemaPage
