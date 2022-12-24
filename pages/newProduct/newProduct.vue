<template>
	<view>
		<b-form @submit="onSubmit" @reset="onReset">
			<b-row>
				<div class="ml-3 mb-3">
					<label for="title">Title</label>
					<b-form-input id="title" type="text" v-model="productData.title" placeholder="Enter product title"></b-form-input>
				</div>
				<div class="ml-3 mb-3">
					<label for="price">Price</label>
					<b-form-input id="price" type="number" v-model="productData.price" placeholder="Enter product price"></b-form-input>
				</div>
				<div class="ml-3 mb-3">
					<label for="description">Description</label>
					<b-form-textarea id="description" rows="3" max-row="6" no-auto-shrink v-model="productData.description" placeholder="Enter product description"></b-form-textarea>
				</div>
				<div class="ml-3 mb-3">
					<label for="category">Category</label>
					<b-form-input id="category" type="text" v-model="productData.category" placeholder="Enter product category"></b-form-input>
				</div>
				<div class="ml-3 mb-3">
					<label for="product-image">Change Product Image</label>
					<b-form-file
					id="product-image"
					  v-model="productImg"
					  :state="Boolean(productImg)"
					  placeholder="Choose a file or drop it here..."
					  drop-placeholder="Drop file here..."
					  accept="image/jpeg, image/png, image/gif"
					></b-form-file>
					 <b-button v-if="hasImage" class="mt-3" @click="clearImage">Clear image</b-button>
				</div>
				<div class="ml-3 mb-3">
					<b-img height="300" center v-if="hasImage" :src="productImgSrc" class="mb-3"></b-img>
					<b-img height="300" center v-if="!hasImage" :src="getProductImage(productData.image)" class="mb-3"></b-img>
				</div>
			</b-row>
			<b-row>
				 <b-button class="mt-3" variant="outline-danger" block @click="onCancel">Cancel</b-button>
				<b-button class="mt-2" variant="outline-primary" block @click="onSubmit">Save</b-button>
			</b-row>
		</b-form>
	</view>
</template>

<script>
	const base64Encode = data =>
	  new Promise((resolve, reject) => {
	    const reader = new FileReader();
	    reader.readAsDataURL(data);
	    reader.onload = () => resolve(reader.result);
	    reader.onerror = error => reject(error);
	  });
	export default {
		data() {
			return {
				productImg: null,
				productImgSrc: null,
				productData: {
				  id: '',
				  title: '',
				  price: '',
				  description: '',
				  category: '',
				  image: ''
				},
			}
		},
		watch: {
			productImg(newValue, oldValue) {
			      if (newValue !== oldValue) {
			        if (newValue) {
			          base64Encode(newValue)
			            .then(value => {
			              this.productImgSrc = value;
			            })
			            .catch(() => {
			              this.productImgSrc = null;
			            });
			        } else {
			          this.productImgSrc = null;
			        }
			      }
			    }
		},
		computed: {
			hasImage() {
				return !!this.productImg;
			}
		},
		methods: {
			clearImage() {
			     this.productImg = null;
			   },
			getProductImage(imageUrl) {
				return imageUrl;
			},
			onSubmit(data){
				const file = this.productImg;
				if(file) {
					data.image = URL.createObjectURL(file);
				}
				const createProduct = uni.request({
				    header: {
				        'custom-header': 'createNewProduct', //自定义请求头信息
				    	'content-type': 'application/json'
				    },
					url: 'https://fakestoreapi.com/products', //仅为示例，并非真实接口地址
					method:'POST',
				    data: JSON.stringify({
						title: data.title,
						price: data.price,
						description: data.description,
						category: data.category,
						image: data.image
					}),
				})
				.then(
					res => console.log(res),
					uni.navigateTo({
						url: '/pages/index/index'
					})
				);
			},
			onCancel(){
				alert('cancel')
				uni.navigateTo({
					url: '/pages/index/index'
				});
			},
		}
	}
</script>

<style>

</style>
