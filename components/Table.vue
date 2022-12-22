<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
		<h4 class="mb-3">All Products</h4>
      <b-col lg="3" class="my-1">
        <b-form-group
          label="Filter"
          label-for="filter-input"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="Type to Search"
            ></b-form-input>

            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filter-included-fields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      stacked="md"
      show-empty
      small
      @filtered="onFiltered"
    >
      <template #cell(name)="row">
        {{ row.value.first }} {{ row.value.last }}
      </template>

      <template #cell(actions)="row">
        <b-button variant="primary" size="sm" @click="editProduct(row.item, row.item.title)" class="mr-1 text-center">
          <b-icon icon="pencil-fill"></b-icon>
        </b-button>
        <b-button variant="danger" size="sm" @click="deleteProduct(row.item, row.item.title, $event.target)" class="text-center">
          <b-icon icon="trash-fill"></b-icon>
        </b-button>
      </template>

      <template #row-details="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
          </ul>
        </b-card>
      </template>
    </b-table>
	<b-row>
		<b-col sm="7" md="6" class="my-1">
		  <b-pagination
		    v-model="currentPage"
		    :total-rows="totalRows"
		    :per-page="perPage"
		    align="fill"
		    size="sm"
		    class="my-0"
		  ></b-pagination>
		</b-col>
	</b-row>
    <!-- Edit modal -->
    <b-modal size="lg" ref="edit-modal" hide-footer :id="editModal.id" :title="'Edit ' + editModal.title" @hidden="">
		<b-row>
			<div class="ml-3 mb-3">
				<label for="title">Title</label>
				<b-form-input id="title" type="text" v-model="editModal.content.title" placeholder="Enter product title"></b-form-input>
			</div>
			<div class="ml-3 mb-3">
				<label for="price">Price</label>
				<b-form-input id="price" type="number" v-model="editModal.content.price" placeholder="Enter product price"></b-form-input>
			</div>
			<div class="ml-3 mb-3">
				<label for="description">Description</label>
				<b-form-textarea id="description" rows="3" max-row="6" no-auto-shrink v-model="editModal.content.description" placeholder="Enter product description"></b-form-textarea>
			</div>
			<div class="ml-3 mb-3">
				<label for="category">Category</label>
				<b-form-input id="category" type="text" v-model="editModal.content.category" placeholder="Enter product category"></b-form-input>
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
				<b-img height="300" center v-if="!hasImage" :src="getProductImage(editModal.content.image)" class="mb-3"></b-img>
			</div>
		</b-row>
		<b-row>
			 <b-button class="mt-3" variant="outline-danger" block @click="resetEditModal">Close Me</b-button>
			<b-button class="mt-2" variant="outline-primary" block @click="handleSave">Save</b-button>
		</b-row>
    </b-modal>
	<!-- Delete modal -->
	<b-modal 
		:header-bg-variant="headerBgVariant"
		  :header-text-variant="headerTextVariant"
		  :body-bg-variant="bodyBgVariant"
		  :body-text-variant="bodyTextVariant"
		  :footer-bg-variant="footerBgVariant"
		  :footer-text-variant="footerTextVariant"
		:id="deleteModal.id" 
		:title="'Delete ' + deleteModal.title" 
		variant="danger" @hidden="resetDeleteModal">
	  <p>{{ 'Are you sure you want to delete ' + deleteModal.title }} ?</p>
	</b-modal>
	
  </b-container>
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
		items: [],
        fields: [
          { key: 'id', label: 'Product ID', sortable: true, sortDirection: 'desc' },
          { key: 'title', label: 'Title', sortable: true, sortDirection: 'desc' },
		  { key: 'price', label: 'Price', sortable: true, sortDirection: 'desc' },
		  { key: 'category', label: 'category', sortable: true, sortDirection: 'desc' },
          { key: 'actions', label: 'Actions' }
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
        sortBy: '',
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        filterOn: [],
        editModal: {
          id: 'edit-modal',
          title: '',
          content: ''
        },
		deleteModal: {
		  id: 'delete-modal',
		  title: '',
		  content: ''
		},
		headerBgVariant: 'danger',
		headerTextVariant: 'light',
		bodyBgVariant: 'light',
		bodyTextVariant: 'light',
		footerBgVariant: 'danger',
		footerTextVariant: 'light'
      }
    },
    computed: {
		hasImage() {
			return !!this.productImg;
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
    mounted() {
		this.getAllProducts()
    },
    methods: {
		 clearImage() {
		      this.productImg = null;
		    },
		getProductImage(imageUrl) {
			return imageUrl;
		},
		getAllProducts() {
			const result = [];
			uni.request({
			    url: 'https://fakestoreapi.com/products', //仅为示例，并非真实接口地址
				method:'GET',
			    data: {
			        text: 'uni.request'
			    },
			    header: {
			        'custom-header': 'getallproducts' //自定义请求头信息
			    },
			    success: (res) => {
					result.push(res.data);
					this.$data.items = result[0];
					this.$data.totalRows = this.$data.items.length;
			        this.text = 'request success';
			    }
			});
		},
		handleSave(bvModalEvent) {
			bvModalEvent.preventDefault()
			this.updateOneProduct(this.$data.editModal.content)
		},
		updateOneProduct(updatedData) {
			const file = this.productImg; 
			if(file) {
				updatedData.image = URL.createObjectURL(file);
			}
			const updateProduct = uni.request({
			    header: {
			        'custom-header': 'updateOneProduct', //自定义请求头信息
			    	'content-type': 'application/json'
			    },
				url: 'https://fakestoreapi.com/products/'+updatedData.id, //仅为示例，并非真实接口地址
				method:'PUT',
			    data: JSON.stringify({
					title: updatedData.title,
					price: updatedData.price,
					description: updatedData.price,
					image: updatedData.image,
					category: updatedData.category
				}),
			})
			.then(
				res => console.log(res),
				this.resetEditModal()
			);
		},
      editProduct(item, title) {
        this.editModal.title = `Product ${title}`
        this.editModal.content = item
		this.$bvModal.show(this.editModal.id)
      },
      resetEditModal() {
        this.editModal.title = ''
        this.editModal.content = ''
		this.productImgSrc = null
		this.productImg = null
		this.$refs['edit-modal'].hide()
      },
	  deleteProduct(item, title, button) {
	    this.deleteModal.title = `Product: ${title}`
	    this.deleteModal.content = JSON.stringify(item, null, 2)
	  		this.$bvModal.show(this.deleteModal.id)
	  },
	  resetDeleteModal() {
	    this.deleteModal.title = ''
	    this.deleteModal.content = ''
		this.productImgSrc = null
		this.productImg = null
	  },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      }
    }
  }
</script>