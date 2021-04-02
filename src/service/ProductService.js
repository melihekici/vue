import axios from 'axios';

//'assets/layout/data/products-small.json'



export default class ProductService {

		getProductsSmall() {

			return axios.get("https://reqres.in/api/users?delay=0").then(res => res.data.data);
		}
	
		getProducts() {
			return axios.get("https://reqres.in/api/users?delay=3&per_page=199919991").then(res => res.data.data);
		}
	
		getProductsWithOrdersSmall() {
			return axios.get("https://reqres.in/api/users?delay=0").then(res => res.data.data);
		}
}
