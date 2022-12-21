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
        <b-button variant="primary" size="sm" @click="edit(row.item, row.index, $event.target)" class="mr-1 text-center">
          <b-icon icon="pencil-fill"></b-icon>
        </b-button>
        <b-button variant="danger" size="sm" @click="deleteProduct(row.item, row.index, $event.target)" class="text-center">
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
    <b-modal :id="editModal.id" :title="'Edit' + editModal.title" @hide="resetEditModal">
      <pre>{{ editModal.content.title }}</pre>
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
		:title="'Delete' + deleteModal.title" 
		variant="danger" @hide="resetDeleteModal">
	  <pre>{{ 'Are you sure you want to delete this product ' + deleteModal.content.title }}</pre>
	</b-modal>
	
  </b-container>
</template>

<script>
  export default {
    data() {
      return {
        items: [
			{ id: 1, title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops', price:109.95, description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday', category: "men's clothing" },
			{ id: 2, title: "Mens Casual Premium Slim Fit T-Shirts ", price: 22.3, description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",category: "men's clothing",}
        ],
        fields: [
          { key: 'id', label: 'Product ID', sortable: true, sortDirection: 'desc' },
          { key: 'title', label: 'Title', sortable: true, sortDirection: 'desc' },
		  { key: 'price', label: 'Price', sortable: true, sortDirection: 'desc' },
		  { key: 'category', label: 'category', sortable: true, sortDirection: 'desc' },
          { key: 'actions', label: 'Actions' }
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 5,
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
      // Set the initial number of items
      this.totalRows = this.items.length
    },
    methods: {
      edit(item, index, button) {
        this.editModal.title = `Row index: ${index}`
        this.editModal.content = JSON.stringify(item, null, 2)
        this.$root.$emit('bv::show::modal', this.editModal.id, button)
      },
	  deleteProduct(item, index, button) {
	    this.deleteModal.title = `Row index: ${index}`
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