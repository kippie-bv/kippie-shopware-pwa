import { computed } from '@vue/composition-api'
import { useCart } from '@shopware-pwa/composables'

const useExtendedCart = (rootContext: any) => {
  const { cart } = useCart(rootContext)

  const depositProducts = computed(() =>
    cart.value?.lineItems.filter((lineItem: any) => {
      if (lineItem.payload?.type === 'borg') return true
      return false
    }),
  )

  const totalDepositProducts = computed(() => {
    return depositProducts.value?.reduce((prev: any, cur: any) => {
      return prev + cur.quantity
    }, 0)
  })

  const totalDepositRelatedProducts = computed(() => {
    return cart.value?.lineItems
      .filter((lineItem: any) => lineItem.payload.productNumber.includes('KP-'))
      .reduce((prev: any, cur: any) => {
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
