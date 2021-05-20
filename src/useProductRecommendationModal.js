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

  const { contextName, apiInstance } = getApplicationContext(
    rootContext,
    'useProductRecommendationModal',
  )
  const { sharedRef } = useSharedState(rootContext)

  const _product = sharedRef(`${contextName}-modal-product`)

  const _depositProduct = sharedRef(`${contextName}-modal-deposit-product`)

  const setProduct = async (value) => {
    _product.value = value
    await getDepositProduct()
  }

  const setDepositProduct = (value) => {
    _depositProduct.value = value
  }

  const product = computed(() => _product.value)
  const depositProduct = computed(() => _depositProduct.value)

  const getDepositProduct = async () => {
    console.log('depo', product)
    const id = product.value.translated.customFields['borg_id']
    const result = await apiInstance.invoke.post(`/store-api/product/${id}`, {})
    setDepositProduct(result.data.product)
  }

  const closeModal = () => {
    switchState(false)
  }

  const openModal = () => {
    switchState(true)
  }

  return {
    isOpen,
    product,
    setProduct,
    depositProduct,
    setDepositProduct,
    getDepositProduct,
    closeModal,
    openModal,
  }
}

export { useProductRecommendationModal }
