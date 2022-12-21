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
        <b-button variant="primary" size="sm" @click="edit(row.item, row.item.title, $event.target)" class="mr-1 text-center">
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
    <b-modal :id="editModal.id" :title="'Edit ' + editModal.title" @hide="resetEditModal">
      <pre>{{ editModal.content }}</pre>
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
		variant="danger" @hide="resetDeleteModal">
	  <p>{{ 'Are you sure you want to delete ' + deleteModal.title }} ?</p>
	</b-modal>
	
  </b-container>
</template>

<script>
  export default {
    data() {
      return {
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
        perPage: 8,
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
		bodyTextVariant: '',
		footerBgVariant: 'danger',
		footerTextVariant: 'light'
      }
    },
    computed: {
    },
    mounted() {
		this.getAllProducts()
    },
    methods: {
		getAllProducts() {
			const result = [];
			uni.request({
			    url: 'https://fakestoreapi.com/products', //仅为示例，并非真实接口地址
				method:'GET',
			    data: {
			        text: 'uni.request'
			    },
			    header: {
			        'custom-header': 'hello' //自定义请求头信息
			    },
			    success: (res) => {
					result.push(res.data);
					this.$data.items = result[0];
					this.$data.totalRows = this.$data.items.length;
			        this.text = 'request success';
			    }
			});
		},
      edit(item, title, button) {
        this.editModal.title = `Product: ${title}`
        this.editModal.content = JSON.stringify(item, null, 2)
        this.$root.$emit('bv::show::modal', this.editModal.id, button)
      },
	  deleteProduct(item, title, button) {
	    this.deleteModal.title = `Product: ${title}`
	    this.deleteModal.content = JSON.stringify(item, null, 2)
	    this.$root.$emit('bv::show::modal', this.deleteModal.id, button)
	  },
      resetEditModal() {
        this.editModal.title = ''
        this.editModal.content = ''
      },
	  resetDeleteModal() {
	    this.deleteModal.title = ''
	    this.deleteModal.content = ''
	  },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      }
    }
  }
</script>