import {
  useUIState,
  useSharedState,
  useProduct,
  getApplicationContext,
} from '@shopware-pwa/composables'
import { computed, watch } from '@vue/composition-api'
import PWAbundles from '../../../../.shopware-pwa/pwa-bundles.json'

const requiredDepositProducts =
  PWAbundles['kpbv-borg'].configuration.config.requiredDepositProducts
const optionalDepositProducts =
  PWAbundles['kpbv-borg'].configuration.config.depositProducts

const useDepositModal = (rootContext) => {
  const { isOpen, switchState: switchModal } = useUIState(
    rootContext,
    'PRODUCT_RECOMMENDATION_MODAL_STATE',
  )

  const { isOpen: hasDeposit, switchState: switchDeposit } = useUIState(
    rootContext,
    'PRODUCT_RECOMMENDATION_MODAL_HAS_DEPOSIT_STATE',
  )

  const { contextName, apiInstance } = getApplicationContext(
    rootContext,
    'useProductRecommendationModal',
  )

  const { sharedRef } = useSharedState(rootContext)

  const _product = sharedRef(`${contextName}-modal-product`)

  const _depositProduct = sharedRef(`${contextName}-modal-deposit-product`)

  const productAddedToCart = async (value) => {
    const { product, loadAssociations } = useProduct(rootContext, value)
    await loadAssociations()
    _product.value = product.value
    console.debug('product', product.value)
    if (
      optionalDepositProducts.includes(
        _product.value.translated.customFields['borg_id'],
      )
    ) {
      switchDeposit(true)
    } else {
      switchDeposit(false)
    }
    switchModal(true)
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
    switchModal(false)
  }

  const openModal = () => {
    switchModal(true)
  }

  return {
    isOpen,
    product,
    productAddedToCart,
    depositProduct,
    setDepositProduct,
    getDepositProduct,
    closeModal,
    openModal,
    hasDeposit,
    requiredDepositProducts,
    optionalDepositProducts,
  }
}

export { useDepositModal }
