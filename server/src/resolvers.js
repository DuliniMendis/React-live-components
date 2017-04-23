import pubsub from './pubsub.js';


const components =[
{
	id:1,
	type:'text',
	value: '',
	mask: '',
	placeholder: 'xxx@xxx.com',
	regex: '^(([^<>()\\[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
},
{
	id:2,
	type:'text',
	value: '',
	mask: '00-000-000000',
	placeholder: 'xx-xxx-xxxxxx',
	regex: ''
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

