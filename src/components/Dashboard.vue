 <template>
	<div>
	</div>
</template>

<script>
import ProductService from '../service/ProductService';
import EventService from '../service/EventService';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default {
	data() {
		return {
			tasksCheckbox: [],
			dropdownCities: [
				{name: 'New York', code: 'NY'},
				{name: 'Rome', code: 'RM'},
				{name: 'London', code: 'LDN'},
				{name: 'Istanbul', code: 'IST'},
				{name: 'Paris', code: 'PRS'}
			],
			dropdownCity: null,
			options: {
				plugins:[dayGridPlugin, timeGridPlugin, interactionPlugin],
				defaultDate: '2019-01-01',
				header: {
					left: 'prev,next',
					center: 'title',
					right: 'dayGridMonth,timeGridWeek,timeGridDay'
				},
				editable: true
			},
			events: null,
			products: null,
			selectedProducts: null,
			lineData: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
				datasets: [
					{
						label: 'First Dataset',
						data: [65, 59, 80, 81, 56, 55, 40],
						fill: false,
						backgroundColor: '#2f4860',
						borderColor: '#2f4860'
					},
					{
						label: 'Second Dataset',
						data: [28, 48, 40, 19, 86, 27, 90],
						fill: false,
						backgroundColor: '#00bb7e',
						borderColor: '#00bb7e'
					}
				]
			},
		}
	},
	productService: null,
	eventService: null,
	created() {
		this.productService = new ProductService();
		this.eventService = new EventService();
	},
	mounted() {
		this.productService.getProductsSmall().then(data => this.products = data);
		this.eventService.getEvents().then(data => this.events = data);

		let afId = this.$route.query['af_id'];
        if (afId) {
            let today = new Date();
            let expire = new Date();
            expire.setTime(today.getTime() + 3600000*24*7);
            document.cookie = 'primeaffiliateid=' + afId + ';expires=' + expire.toUTCString() + ';path=/; domain:primefaces.org';
        }
	},
	methods: {
		formatCurrency(value) {
			return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
		}
	}
}
</script>

<style lang="scss" scoped>
	@media screen and (max-width: 960px) {
		::v-deep(.p-datatable) {
			&.p-datatable-customers {
				.p-datatable-thead > tr > th,
				.p-datatable-tfoot > tr > td {
					display: none !important;
				}

				.p-datatable-tbody > tr {
					border-bottom: 1px solid #dee2e6;
					> td {
						text-align: left;
						display: flex;
						align-items: center;
						justify-content: center;
						border: 0 none !important;
						width: 100% !important;
						float: left;
						clear: left;
						border: 0 none;

						.p-column-title {
							padding: .4rem;
							min-width: 30%;
							display: inline-block;
							margin: -.4rem 1rem -.4rem -.4rem;
							font-weight: bold;
						}

						.p-progressbar {
							margin-top: .5rem;
						}
					}
				}
			}
		}
	}
</style>
