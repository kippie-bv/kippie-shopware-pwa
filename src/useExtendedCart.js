import { computed } from '@vue/composition-api'
import { useCart } from '@shopware-pwa/composables'

const useExtendedCart = (rootContext) => {
  const { cart } = useCart(rootContext)

  const depositProducts = computed(() =>
    cart.value?.lineItems.filter((lineItem) => {
      if (lineItem.payload?.type === 'borg') return true
      return false
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

  return {
    depositProducts,
    totalDepositProducts,
    totalDepositRelatedProducts,
  }
}

export { useExtendedCart }
