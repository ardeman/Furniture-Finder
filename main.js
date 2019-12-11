var app = new Vue({ 
    el: '#app',
    data () {
        return {
            searchName: '',
            selectedStyle: [],
            selectedDelivery: [],
            products: [],
            furnitureStyles: [],
            loading: true
        };
    },
    filters: {
        limitText (text) {
            //limit text to max 114 char
            if (!text) return '';
            text = text.substr(0, 114);
            return text;
        },
        currencyDecimal (value) {
            //separate thousand in currency value
            var reverse = value.toString().split('').reverse().join(''),
                thousand = reverse.match(/\d{1,3}/g),
                thousand = thousand.join('.').split('').reverse().join('');
            return thousand;
        },
        dayUnit (value) {
            //show day unit
            return value + (value === '1' ? ' day' : ' days');
        }
    },
    mounted () {
        //get data from API using axios
        axios
                .get('https://www.mocky.io/v2/5c9105cb330000112b649af8')
                .then(response => {
                    //extract output from API to procucts and furnitureStyles variables
                    this.products = response.data.products,
                    this.furnitureStyles = response.data.furniture_styles;
                })
                .finally(() => {
                    //load materializecss multiple select template
                    var elems = document.querySelectorAll('select');
                    var instances = M.FormSelect.init(elems);
                    this.loading = false;
                });
    },
    computed: {
        //filter product based on user input
        filteredProducts() {
            return this.products.filter(product => {
                if (
                        (
                            //check if product.name is included in v-model searchName input, or if searchName empty then show all
                            product.name.toLowerCase().includes(this.searchName.toLowerCase())
                        )
                        && 
                        (
                            //check if product.furniture_style is included in v-model selectedStyle multiple select
                            //or if it empty then show all
                            this.selectedStyle.length === 0 
                            ||
                            product.furniture_style.some(sel => this.selectedStyle.includes(sel))
                        )
                        && 
                        (
                            //check if product.delivery_time is lower than max value of v-model selectedDelivery multiple select
                            //or if it empty then show all
                            this.selectedDelivery.length === 0 
                            ||
                            product.delivery_time <= Math.max.apply(null, this.selectedDelivery)
                        )
                    ){
                    return true;
                }
                else
                {
                    return false;
                }
            });
        }
    }
});