// import something here
import VueCurrencyFilter from 'vue-currency-filter'
// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // something to do
  Vue.use(VueCurrencyFilter, {
	  symbol : 'P',
	  thousandsSeparator: ',',
	  fractionCount: 2,
	  fractionSeparator: '.',
	  symbolPosition: 'front',
	  symbolSpacing: true
	})
}
