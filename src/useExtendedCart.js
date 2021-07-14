import { computed } from '@vue/composition-api'
import { useCart } from '@shopware-pwa/composables'

const useExtendedCart = (rootContext) => {
  const { cart } = useCart(rootContext)

  const depositProducts = computed(
    () =>
      cart.value?.lineItems.filter((lineItem) => {
        if (lineItem.payload?.type === 'borg') return true
        return false
      }) || [],
  )

  const productsExcludedDeposit = computed(
    () =>
      cart.value?.lineItems.filter((lineItem) => {
        if (lineItem.payload?.type === 'borg') return false
        return true
      }) || [],
  )

  const totalDepositProducts = computed(() => {
    try {
      return depositProducts.value.reduce((prev, cur) => {
        return prev + cur.quantity
      }, 0)
    } catch (e) {
      console.error('[useExtendedCart]', 'Total Deposit Products is empty')
      return 0
    }
  })

  const totalDepositRelatedProducts = computed(() => {
    try {
      return cart.value.lineItems
        .filter((lineItem) => lineItem.payload.productNumber.includes('KP-'))
        ?.reduce((prev, cur) => {
          return prev + cur.quantity
        }, 0)
    } catch (e) {
      console.error(
        '[useExtendedCart]',
        'Total Deposit Related Products is empty',
      )
      return 0
    }
  })

  const getTotalPriceOfProductsExcludedDeposit = computed(() => {
    try {
      return productsExcludedDeposit.value.reduce((prev, cur) => {
        return prev + cur.price.totalPrice
      }, 0.0)
    } catch (e) {
      console.error('[useExtendedCart]', 'Total Price unknown')
      return 0.0
    }
  })

  return {
    depositProducts,
    totalDepositProducts,
    totalDepositRelatedProducts,
    productsExcludedDeposit,
    getTotalPriceOfProductsExcludedDeposit,
  }
}

export { useExtendedCart }
