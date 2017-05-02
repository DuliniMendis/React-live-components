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
  max: Int,
  options:[String]
}

type DnDItem{
  id: ID!,
  label: String
}

type DnDPanel{
  id: ID!,
  label: String,
  items: [DnDItem]
}

type DnDComponent{
  id: ID!,
  panels: [DnDPanel]
}


type Query { 
  component(id: ID!): Component,
  dnDComponent(id: ID!): DnDComponent
}

type Mutation { 
  changeComponent(id: ID!, value: String!): Component,
  changeDnDComponent(id: ID!, panelID: ID!, itemID: ID!): DnDComponent
}

type Subscription { 
  component(id:ID!): Component,
  dnDComponent(id: ID!): DnDComponent
}

`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
