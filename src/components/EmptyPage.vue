<template>
	<div class="p-grid">
		<div class="p-col-12">
			<div class="card">
				<label class="entry-label" for="name">Name</label>
				<br>
				<InputText v-model="nameValue" id="name" type="text" placeholder="Enter the name"/>
				<br>
				<br>
				<label class="entry-label" for="job">Job</label>
				<br>
				<InputText v-model="jobValue" type="text" placeholder="Enter the job"/>
				<br>
				<br>
				<Button @click="sendRegistrationRequest" label="Send Registration Request"></Button>
				<br>
				<br>
			</div>
		</div>
	</div>

	<TimelineDemo></TimelineDemo>

</template>


<script>
import CreateUserService from '../service/CreateUserService';
import TimelineDemo from '../pages/TimelineDemo.vue'
export default {
	data () {
		return {
			nameValue: null,
			jobValue: null
		}
	},
	createUserService: null,
	timelineService: null,
	created() {
		this.createUserService = new CreateUserService();
	},
	methods: {
		sendRegistrationRequest() {
			console.log(this.createUserService.sendRequest(this.nameValue, this.jobValue));	
		}
	},
	components: {
		'TimelineDemo': TimelineDemo
	}

}
</script>

<style scoped>
	.entry-label {
		font-weight: 950;
	}

</style>
