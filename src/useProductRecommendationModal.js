import {
  useUIState,
  useSharedState,
  getApplicationContext,
} from '@shopware-pwa/composables'
import { computed } from '@vue/composition-api'

const useProductRecommendationModal = (rootContext) => {
  const { isOpen, switchState } = useUIState(
    rootContext,
    'PRODUCT_RECOMMENDATION_MODAL_STATE',
  )

  const { contextName } = getApplicationContext(
    rootContext,
    'useProductRecommendationModal',
  )
  const { sharedRef } = useSharedState(rootContext)

  const _product = sharedRef(`${contextName}-modal-product`)

  const _depositProduct = sharedRef(`${contextName}-modal-deposit-product`)

  const setProduct = (value) => {
    _product.value = value
  }

  const setDepositProduct = (value) => {
    _depositProduct.value = value
  }

  const product = computed(() => _product.value)
  const depositProduct = computed(() => _depositProduct.value)

  return {
    isOpen,
    switchState,
    product,
    setProduct,
    depositProduct,
    setDepositProduct,
  }
}

export { useProductRecommendationModal }
