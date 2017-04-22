
import express from 'express';
import { graphqlExpress, graphiqlExpress} from 'graphql-server-express';
import bodyParser from 'body-parser';
import { schema } from './src/schema';
import cors from 'cors';
import { createServer } from 'http';
import { SubscriptionManager } from 'graphql-subscriptions';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import pubsub from './src/pubsub.js';

const PORT = 4000; //change as required

const app = express();

app.use('*', cors({ origin: 'http://localhost:3000' })); //only needed if client and server are both on localhost

app.use('/graphql', bodyParser.json(), graphqlExpress({ 
	schema: schema 
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: 'ws://localhost:'+PORT+'/subscriptions',
}));


const subscriptionManager = new SubscriptionManager({
  schema: schema,
  pubsub: pubsub
});

const server = createServer(app);

server.listen(PORT, () => {
    new SubscriptionServer({
      subscriptionManager: subscriptionManager
    }, {
      server: server,
      path: '/subscriptions'
    });
});