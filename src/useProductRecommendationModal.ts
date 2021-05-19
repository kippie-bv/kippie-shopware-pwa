import {
  useUIState,
  useSharedState,
  getApplicationContext,
} from '@shopware-pwa/composables'
import { computed, WritableComputedRef } from '@vue/composition-api'
import { Product } from '@shopware-pwa/commons/interfaces/models/content/product/Product'

const useProductRecommendationModal = (rootContext: any) => {
  const { isOpen, switchState } = useUIState(
    rootContext,
    'PRODUCT_RECOMMENDATION_MODAL_STATE',
  )

  const { contextName } = getApplicationContext(
    rootContext,
    'useProductRecommendationModal',
  )
  const { sharedRef } = useSharedState(rootContext)

  const _product: WritableComputedRef<Object | null | undefined> = sharedRef(
    `${contextName}-modal-product`,
  )

  const _depositProduct: WritableComputedRef<Object | null | undefined> =
    sharedRef(`${contextName}-modal-deposit-product`)

  const setProduct = (product: Product) => {
    _product.value = product
  }

  const setDepositProduct = (product: Product) => {
    _depositProduct.value = product
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
