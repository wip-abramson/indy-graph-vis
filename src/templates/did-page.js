import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const DIDPage = ({data}) => (
  <Layout>
    {/*<SEO title="Page two" />*/}
    <h1>DID: {data.indy.did.did}</h1>
    <h2>Authored DIDs: {data.indy.did.createdDids.count}</h2>
    <h2>Authored Schemas: {data.indy.did.createdSchema.count}</h2>
    <h2>Authored Definitions: {data.indy.did.createdDefinitions.count}</h2>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)


export const DIDTemplaterQuery = graphql`
  query DIDQuery($did: String!) {
      indy {
        did(did: $did) {
            did
          createdDids {
            count
#            edges {
#              node {
#                createdDids {
#                  count
#                }
#                createdSchema {
#                  count
#                }
#                createdDefinitions {
#                  count
#                }
#              }
#            }
          }
          createdSchema {
            count
          }
          createdDefinitions {
            count
          }
        }
      }
    }
`;

export default DIDPage
