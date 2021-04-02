<template>
	<div class="layout-profile">
		<div id="asd">
			<img class="myPic" src="https://media-exp1.licdn.com/dms/image/C4E03AQGji9lWkNw1yg/profile-displayphoto-shrink_800_800/0/1600437083110?e=1622678400&v=beta&t=Z5aMAVNuHDqywSbflW7k95JanTe5q0vnKGcR5at0y20" alt="" />
		</div>
		<button class="p-link layout-profile-link" @click="onClick">
			<span class="username">Melih Ekici</span>
			<i class="pi pi-fw pi-cog"></i>
		</button>
        <transition name="layout-submenu-wrapper">
            <ul v-show="expanded">
                <li><button class="p-link"><i class="pi pi-fw pi-user"></i><span>Account</span></button></li>
                <li><button class="p-link"><i class="pi pi-fw pi-inbox"></i><span>Notifications</span><span class="menuitem-badge">2</span></button></li>
                <li><button class="p-link"><i class="pi pi-fw pi-power-off"></i><span>Logout</span></button></li>
            </ul>
        </transition>
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				expanded: false
			}
		},
		methods: {
			onClick(event){
				this.expanded = !this.expanded;
				event.preventDefault();
			}
		}
	}
</script>

<style scoped>
</style>