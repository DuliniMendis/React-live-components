import {  makeExecutableSchema,  addMockFunctionsToSchema } from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = `

type Component{
  id: ID!,
  type: String,
  value: String,
  mask: String,
  placeholder: String,
  regex: String
}

type Query { 
  component(id: ID!): Component
}

type Mutation { 
  changeComponent(id: ID!, value: String!): Component
}

type Subscription { 
  component(id:ID!): Component
}

`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
