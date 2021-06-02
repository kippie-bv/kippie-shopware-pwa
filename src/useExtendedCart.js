import { computed } from '@vue/composition-api'
import { useCart } from '@shopware-pwa/composables'

import {
  getProductRegularPrice,
  getProductSpecialPrice,
  getProductTierPrices,
  getProductCalculatedListingPrice,
  getProductCalculatedPrice,
  getProductPriceDiscount,
} from '@shopware-pwa/helpers'

const useExtendedCart = (rootContext) => {
  const { cart } = useCart(rootContext)

  const depositProducts = computed(() =>
    cart.value?.lineItems.filter((lineItem) => {
      if (lineItem.payload?.type === 'borg') return true
      return false
    }),
  )

  const productsExcludedDeposit = computed(() =>
    cart.value?.lineItems.filter((lineItem) => {
      if (lineItem.payload?.type === 'borg') return false
      return true
    }),
  )

  const totalDepositProducts = computed(() => {
    return depositProducts.value?.reduce((prev, cur) => {
      return prev + cur.quantity
    }, 0)
  })

  const totalDepositRelatedProducts = computed(() => {
    return cart.value?.lineItems
      .filter((lineItem) => lineItem.payload.productNumber.includes('KP-'))
      .reduce((prev, cur) => {
        return prev + cur.quantity
      }, 0)
  })

  const getTotalPriceOfProductsExcludedDeposit = computed(() => {
    console.log('ex0', productsExcludedDeposit)
    return productsExcludedDeposit.value.reduce((prev, cur) => {
      return prev + cur.price.totalPrice
    }, 0.0)
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
