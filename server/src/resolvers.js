import pubsub from './pubsub.js';

const regexStrings = [
{
	id:1,
	regexStr:'^(([^<>()\\[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
	errorMsg:'Please input a valid email'

},
{
	id:2,
	regexStr:'^\\d+(\\.\\d{1,2})?$',
	errorMsg:'Please check the input value'
},
{
	id:3,
	regexStr:'[-a-zA-Z0-9@:%_\\+.~#?&//=]{2,256}\\.[a-z]{2,4}\\b(\\/[-a-zA-Z0-9@:%_\\+.~#?&//=]*)?',
	errorMsg:'Please input a valid URL'
}
];

const components =[
{
	id:0,
	type:'text',
	label: 'Name',
	value: '',
	mask: '',
	placeholder: '',
	regex: [],
	description: 'Full Name',
	erroMsgs: '',
	min:1,
	max:100,
	options:[]
},
{
	id:1,
	type:'number',
	label: 'Age',
	value: '',
	mask: 'xxxx',
	placeholder: '0',
	regex: [],
	description: '',
	errorMsgs:'',
	min:1,
	max:100,
	options:[]
},
{
	id:2,
	type:'email',
	label: 'Email',
	value: '',
	mask: '',
	placeholder: 'xxxx@xxx.xxx',
	regex: [regexStrings[0]],
	description: 'Primary Email',
	errorMsgs:'',
	min:1,
	max:100,
	options:[]
},
{
	id:3,
	type:'number',
	label: 'Price',
	value: '',
	mask: '',
	placeholder: '00.00',
	regex: [regexStrings[1]],
	description: 'Currency',
	errorMsgs:'',
	min:1,
	max:100,
	options:[]
},
{
	id:4,
	type:'boolean',
	label: 'Agreed',
	value: 'false',
	mask: '',
	placeholder: '',
	regex: [],
	description: 'Do you agree to the terms and conditions?',
	errorMsgs:'',
	min:0,
	max:0,
	options:[]
},
{
	id:5,
	type:'address',
	label: 'Address',
	value: '',
	mask: '',
	placeholder: '',
	regex: [],
	description: '',
	errorMsgs:'',
	min:0,
	max:200,
	options:[]
},
{
	id:6,
	type:'select',
	label: 'Color',
	value: '',
	mask: '',
	placeholder: 'Select a color',
	regex: [],
	description: '',
	errorMsgs:'',
	min:0,
	max:200,
	options:['Blue','Red','Yellow','Green']
},
{
	id:7,
	type:'textarea',
	label: 'Description',
	value: '',
	mask: '',
	placeholder: '',
	regex: [],
	description: '',
	errorMsgs:'',
	min:0,
	max:1000,
	options:[]
},
{
	id:8,
	type:'text',
	label: 'Phone',
	value: '',
	mask: '00-000-000000',
	placeholder: 'xx-xxx-xxxxxx',
	regex: [],
	description: 'Mobile Phone Number',
	errorMsgs: '',
	min:1,
	max:100,
	options:[]
},
{
	id:9,
	type:'number',
	label: 'Weight',
	value: '',
	mask: '',
	placeholder: '0.0',
	regex: [],
	description: '',
	errorMsgs:'',
	min:1,
	max:100,
	options:[]
},
{
	id:10,
	type:'text',
	label: 'Website',
	value: '',
	mask: '',
	placeholder: 'www.google.com',
	regex: [regexStrings[2]],
	description: '',
	errorMsgs:'',
	min:0,
	max:1000,
	options:[]
}
];


export const resolvers = {
	Query: {		
		component: (root,args) => {
			let result = components.find((item) => { return item.id == args.id });
			console.log(result)
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

