import {  makeExecutableSchema,  addMockFunctionsToSchema } from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = `

type regexString{
	id: ID!,
	regexStr: String,
	errorMsg: String
}

type Component{
  id: ID!,
  type: String,
  label: String,
  value: String,
  mask: String,
  placeholder: String,
  regex: [regexString],
  description: String,
  errorMsgs: String,
  min: Int,
  max: Int
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
