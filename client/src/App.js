import React, { Component } from 'react';
import { ApolloClient,  ApolloProvider,  createNetworkInterface} from 'react-apollo';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import InputBox from './components/InputBox';
import EmailInputBox from './components/EmailInputBox';
import IntegerInputBox from './components/IntegerInputBox';
import CurrencyInputBox from './components/CurrencyInputBox';
import CheckBox from './components/CheckBox';
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
            <InputBox id={1}/>
            <InputBox id={2}/>
            <InputBox id={3}/>
            <IntegerInputBox id={4}/>
            <EmailInputBox id={5}/>
            <CurrencyInputBox id={6}/>
            <CheckBox id={7}/>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
