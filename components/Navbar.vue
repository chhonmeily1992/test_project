<template>
	<view>
		 <div>
			<b-navbar toggleable="lg" variant="dark" type="dark">
			<b-container>
				<b-navbar-brand href="#">
					<b-icon class="p-2" icon="cart" font-scale="2"></b-icon>
					CRUD APP 
				</b-navbar-brand>
				<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
				<b-collapse is-nav id="nav-collapse">
				  <!-- Right aligned nav items -->
				  <b-navbar-nav>
					<b-nav-item href="#" active><b-icon class="p-1" icon="cart4" font-scale="2"></b-icon> Products</b-nav-item>
					<navigator url="/pages/newProduct/newProduct" hover-class="newProduct-hover">
						<b-nav-item>
							<b-icon class="p-1" icon="cart-plus" font-scale="2"></b-icon>
							Add New Product
						</b-nav-item>
					</navigator>
					<b-nav-item href="#"><b-icon class="p-1" icon="file" font-scale="2"></b-icon>About</b-nav-item>
				  </b-navbar-nav>
				</b-collapse>
			  </b-container>
		  </b-navbar>
		</div>  
	</view>
</template>

<script>
	export default {
		name:"Navbar",
		data() {
			return {
				
				
			};
		},
		methods: {

		}
	}
</script>

<style>

</style>