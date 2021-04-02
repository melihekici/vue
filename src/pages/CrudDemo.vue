<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template v-slot:left>
						<Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
						<Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
					</template>

					<template v-slot:right>
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="products" v-model:selection="selectedProducts" dataKey="id" :paginator="true" :rows="10" v-model:filters="filters" filterDisplay="menu" :loading="loading"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="stack" breakpoint="1080px"
							:globalFilterFields="['first_name','email']"
							:reorderableColumns="true" @column-reorder="onColReorder" :reorderableRows="true" @row-reorder="onRowReorder"
							:resizableColumns="true" columnResizeMode="fit">
					<template #header>
						<div class="table-header p-d-flex p-flex-column p-flex-md-row p-jc-md-between">
							<h5 class="p-m-0">User Table</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search" />
                            </span>
						</div>
					</template>
					<template #loading>
						Loading users, please wait.
					</template>

					<Column field="selection" selectionMode="single" headerStyle="width: 3rem"></Column>
					<Column field="id" header="ID" :sortable="true" headerStyle="width: 5rem">
						<template #body="slotProps">
							{{slotProps.data.id}}
						</template>
						<template #filter="{filterModel}">
							<InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by ID"/>
						</template>
					</Column>
					<Column field="avatar" header="Avatar">
						<template #body="slotProps">
							<img :src="slotProps.data.avatar" :alt="'Avatar not Available'" class="product-image" />
						</template>
					</Column>
					<Column field="first_name" header="First Name" :sortable="true">
						<template #body="slotProps">
							<!--
							<InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search by name - ${filterModel.matchMode}`"/>
							-->
							{{slotProps.data.first_name}}
						</template>
						<template #filter="{filterModel}">
							<InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by Name"/>
						</template>
					</Column>
					<Column field="last_name" header="Last Name" :sortable="true">
						<template #body="slotProps">
							{{slotProps.data.last_name}}
						</template>
						<template #filter="{filterModel}">
							<InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by Last Name"/>
						</template>
					</Column>
					<Column field="email" header="E-mail" :sortable="true">
						<template #body="slotProps">
							{{slotProps.data.email}}
						</template>
						<template #filter="{filterModel}">
							<InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by E-mail"/>
						</template>
					</Column>
					<!-- <Column field="rating" header="Reviews" :sortable="true">
						<template #body="slotProps">
							<span class="p-column-title">Rating</span>
							<Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" />
						</template>
					</Column> -->
					<!-- <Column field="inventoryStatus" header="Status" :sortable="true">
						<template #body="slotProps">
							<span class="p-column-title">Status</span>
							<span :class="'product-badge status-' + (slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : '')">{{slotProps.data.inventoryStatus}}</span>
						</template>
					</Column> -->
					<Column>
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editProduct(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="productDialog" :style="{width: '450px'}" header="Product Details" :modal="true" class="p-fluid">
					<img :src="'assets/demo/images/product/' + product.image" :alt="product.image" class="product-image" v-if="product.image" />
					<div class="p-field">
						<label for="first_name">First Name</label>
						<InputText id="first_name" v-model.trim="product.first_name" required="true" autofocus :class="{'p-invalid': submitted && !product.first_name}" />
						<small class="p-invalid" v-if="submitted && !product.first_name">Name is required.</small>
					</div>

					<div class="p-field">
						<label for="last_name">Last Name</label>
						<InputText id="last_name" v-model="product.last_name" required="true" autofocus :class="{'p-invalid': submitted && !product.last_name}" />
						<small class="p-invalid" v-if="submitted && !product.last_name">Last Name is required.</small>
					</div>

					<div class="p-field">
						<label for="email">Email</label>
						<InputText id="last_name" v-model="product.email" required="false"/>
					</div>

					<div class="p-field">
						<label for="Avatar_Url">Avatar URL</label>
						<InputText id="Avatar_Url" v-model="product.avatar" required="false"/>
					</div>

					<!-- <div class="p-field">
						<label for="inventoryStatus" class="p-mb-3">Inventory Status</label>
						<Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
							<template #value="slotProps">
								<div v-if="slotProps.value && slotProps.value.value">
									<span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
								</div>
								<div v-else-if="slotProps.value && !slotProps.value.value">
									<span :class="'product-badge status-' +slotProps.value.toLowerCase()">{{slotProps.value}}</span>
								</div>
								<span v-else>
									{{slotProps.placeholder}}
								</span>
							</template>
						</Dropdown>
					</div> -->

					<!-- <div class="p-field">
						<label class="p-mb-3">Category</label>
						<div class="p-formgrid p-grid">
							<div class="p-field-radiobutton p-col-6">
								<RadioButton id="category1" name="category" value="Accessories" v-model="product.category" />
								<label for="category1">Accessories</label>
							</div>
							<div class="p-field-radiobutton p-col-6">
								<RadioButton id="category2" name="category" value="Clothing" v-model="product.category" />
								<label for="category2">Clothing</label>
							</div>
							<div class="p-field-radiobutton p-col-6">
								<RadioButton id="category3" name="category" value="Electronics" v-model="product.category" />
								<label for="category3">Electronics</label>
							</div>
							<div class="p-field-radiobutton p-col-6">
								<RadioButton id="category4" name="category" value="Fitness" v-model="product.category" />
								<label for="category4">Fitness</label>
							</div>
						</div>
					</div> -->

					<!-- <div class="p-formgrid p-grid">
						<div class="p-field p-col">
							<label for="price">Price</label>
							<InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US" />
						</div>
						<div class="p-field p-col">
							<label for="quantity">Quantity</label>
							<InputNumber id="quantity" v-model="product.quantity" integeronly />
						</div>
					</div> -->
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteProductDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="product">Are you sure you want to delete <b>{{product.name}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteProductsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="product">Are you sure you want to delete the selected products?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import { FilterOperator } from 'primevue/api';
import { FilterMatchMode } from 'primevue/api';
import ProductService from '../service/ProductService';

export default {
	data() {
		return {
			loading: false,
			products: null,
			productDialog: false,
			deleteProductDialog: false,
			deleteProductsDialog: false,
			product: {},
			selectedProducts: null,
			filters: {
				'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
				'id': {operator: FilterOperator.AND, constraints: [{value:null, matchMode: FilterMatchMode.STARTS_WITH}]},
				'first_name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
				'last_name': {operator: FilterOperator.AND, constraints: [{value:null, matchMode: FilterMatchMode.STARTS_WITH}]},
				'email': {operator: FilterOperator.AND, constraints: [{value:null, matchMode: FilterMatchMode.STARTS_WITH}]}
			},
			submitted: false,
			statuses: [
				{label: 'INSTOCK', value: 'instock'},
				{label: 'LOWSTOCK', value: 'lowstock'},
				{label: 'OUTOFSTOCK', value: 'outofstock'}
			]
		}
	},
	productService: null,
	created() {
		this.productService = new ProductService();
		
		this.columns = [
            {field: 'selection'},
			{field: 'avatar', header: 'Avatar'},
            {field: 'first_name', header: 'First Name'},
            {field: 'last_name', header: 'Last Name'},
            {field: 'email', header: 'Email'}
        ];
	},
	mounted() {
		this.loading=true;
		this.productService.getProducts().then(data => {
			this.products = data;
			this.loading = false;
			});
	},
	methods: {
		onColReorder() {
            this.$toast.add({severity:'success', summary: 'Column Reordered', life: 3000});
        },
        onRowReorder(event) {
            this.products = event.value;
            this.$toast.add({severity:'success', summary: 'Rows Reordered', life: 3000});
        },

		formatCurrency(value) {
			if(value)
				return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
			return;
		},
		openNew() {
			this.product = {};
			this.submitted = false;
			this.productDialog = true;
		},
		hideDialog() {
			this.productDialog = false;
			this.submitted = false;
		},
		saveProduct() {
			this.submitted = true;
			if (this.product.first_name.trim()) {
			if (this.product.id) {
				//this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value: this.product.inventoryStatus;
				//this.products[this.findIndexById(this.product.id)] = this.product;
				this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
				}
				else {
					this.product.id = this.createId();
					//this.product.code = this.createId();
					//this.product.image = 'product-placeholder.svg';
					//this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
					this.products.push(this.product);
					this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
				}
				this.productDialog = false;
				this.product = {};
			}
		},
		editProduct(product) {
			this.product = {...product};
			this.productDialog = true;
		},
		confirmDeleteProduct(product) {
			this.product = product;
			this.deleteProductDialog = true;
		},
		deleteProduct() {
			this.products = this.products.filter(val => val.id !== this.product.id);
			this.deleteProductDialog = false;
			this.product = {};
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
		},
		findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.products.length; i++) {
				if (this.products[i].id === id) {
					index = i;
					break;
				}
			}
			return index;
		},
		createId() {
			return this.products.length + 1;
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		confirmDeleteSelected() {
			this.deleteProductsDialog = true;
		},
		deleteSelectedProducts() {
			this.products = this.products.filter(val => !this.selectedProducts.includes(val));
			this.deleteProductsDialog = false;
			this.selectedProducts = null;
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
		}
	}
}
</script>

<style scoped lang="scss">

	.table-header {
		display: flex;
		justify-content: space-between;
	}

	.product-image {
		width: 100px;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
	}

	.p-dialog .product-image {
		width: 150px;
		margin: 0 auto 2rem auto;
		display: block;
	}

	.confirmation-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.product-badge {
		border-radius: 2px;
		padding: .25em .5rem;
		text-transform: uppercase;
		font-weight: 700;
		font-size: 12px;
		letter-spacing: .3px;

		&.status-instock {
			background: #C8E6C9;
			color: #256029;
		}

		&.status-outofstock {
			background: #FFCDD2;
			color: #C63737;
		}

		&.status-lowstock {
			background: #FEEDAF;
			color: #8A5340;
		}
	}

	::v-deep(.p-toolbar) {
		flex-wrap: wrap;
		.p-button {
			margin-bottom: .25rem;
		}
	}
</style>
