import pubsub from './pubsub.js';


const components =[
{
	id:1,
	type:'text',
	value: 'text'
},
{
	id:2,
	type:'number',
	value: '0'
}
];


export const resolvers = {
	Query: {		
		component: (root,args) => {
			let result = components.find((item) => { return item.id == args.id });
			return result;
		}
	},
	Mutation: {		
		changeComponent: (root, args) => {
			let component = components.find((item)=>{
				return item.id == args.id;
			});			
			component.value = args.value;
			pubsub.publish('component', component);
			return component;
		}
	},
	Subscription: {		
		component: (args) => {
			let result = components.find((item) => { return item.id == args.id });
			return result;
		}
  }

};

