import React, { Component } from 'react';
import { ApolloClient,  ApolloProvider,  createNetworkInterface} from 'react-apollo';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import TextBox from './components/TextBox';
import './App.css';

const client = new ApolloClient();

const store = createStore(
  combineReducers({
     apollo: client.reducer(),
  }),
  {}, // initial state
  compose(
      applyMiddleware(client.middleware()),
      // If you are using the devToolsExtension, you can add it here also
      (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
  )
);



const wsClient = new SubscriptionClient('ws://localhost:4000/subscriptions', {
  reconnect: true
});

// Create a normal network interface:
const networkInterface = createNetworkInterface({
  uri: 'http://localhost:4000/graphql',
  dataIdFromObject: o => o.id,
  opts: {
    credentials: 'same-origin',
  },
});

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

// Finally, create your ApolloClient instance with the modified network interface
const apolloClient = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
});

class App extends Component {
  render() {
    return (
      <ApolloProvider store={store} client={apolloClient}> 
        <div className="App">
            <TextBox id={1}/>
            <TextBox id={2}/>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
