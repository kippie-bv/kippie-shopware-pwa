import {
  useUIState,
  useSharedState,
  useProduct,
  useCart,
  useAddToCart,
  getApplicationContext,
} from '@shopware-pwa/composables'
import { computed, ref, watch } from '@vue/composition-api'
// import PWAbundles from '../../../../.shopware-pwa/pwa-bundles.json'

const requiredDepositProducts = ['01c9a6215f324adfb57e238850c26821']
const optionalDepositProducts = [
  '7bd89b026b5642dda7ba8a27433dcec9',
  '01489ce177b740799826fd118a272dfb',
]

const useDepositModal = (rootContext) => {
  const { cartItems, removeItem, refreshCart } = useCart(rootContext)

  const { isOpen, switchState: switchModal } = useUIState(
    rootContext,
    'PRODUCT_RECOMMENDATION_MODAL_STATE',
  )

  const { isOpen: hasDeposit, switchState: switchDeposit } = useUIState(
    rootContext,
    'PRODUCT_RECOMMENDATION_MODAL_HAS_DEPOSIT_STATE',
  )

  const { isOpen: hasChoice, switchState: switchHasChoice } = useUIState(
    rootContext,
    'PRODUCT_RECOMMENDATION_MODAL_CUSTOM_MADE_CHOICE',
  )

  const { isOpen: choiceWithDeposit, switchState: switchChoiceWithDeposit } =
    useUIState(
      rootContext,
      'PRODUCT_RECOMMENDATION_MODAL_CUSTOM_CHOICE_WITH_DEPOSIT',
    )
  // switchChoiceWithDeposit(true)

  const { contextName, apiInstance } = getApplicationContext(
    rootContext,
    'useProductRecommendationModal',
  )

  const { sharedRef } = useSharedState(rootContext)

  const _product = sharedRef(`${contextName}-modal-product`)

  const _depositProduct = sharedRef(`${contextName}-modal-deposit-product`)

  const removedDepositItem = ref('')

  const depositItem = computed(() => {
    return cartItems.value.find(
      (item) =>
        item.referencedId === product.value.translated.customFields['borg_id'],
    )
  })

  const productAddedToCart = async (value) => {
    const { product, loadAssociations } = useProduct(rootContext, value)
    await loadAssociations()

    _product.value = product.value
    if (
      optionalDepositProducts.includes(
        _product.value.translated.customFields['borg_id'],
      ) &&
      _product.value.translated.customFields['borg_active']
    ) {
      switchDeposit(true)
    } else {
      switchDeposit(false)
    }
    if (hasDeposit.value && !hasChoice.value) {
      switchModal(true)
      switchHasChoice(true)
      switchChoiceWithDeposit(true)
      await getDepositProduct()
    } else {
      if (!choiceWithDeposit.value) {
        removedDepositItem.value =
          _product.value.translated.customFields['borg_id']
        await removeLastDepositItem()
      }
    }
  }

  const setDepositProduct = (value) => {
    _depositProduct.value = value
  }

  const product = computed(() => _product.value)
  const depositProduct = computed(() => _depositProduct.value)

  const getDepositProduct = async () => {
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

  const onClose = async () => {
    if (!choiceWithDeposit.value) {
      await removeLastDepositItem()
    }
  }

  const removeLastDepositItem = async () => {
    if (depositItem.value)
      removedDepositItem.value = depositItem.value.referencedId

    await removeItem({ id: removedDepositItem.value })
  }

  const addLastDepositItem = async () => {
    const { product: productToAdd, search } = useProduct(rootContext)
    await search(removedDepositItem.value)
    const { addToCart } = useAddToCart(rootContext, productToAdd.value)
    await addToCart()
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
    choiceWithDeposit,
    switchChoiceWithDeposit,
    removeLastDepositItem,
    addLastDepositItem,
    onClose,
  }
}

export { useDepositModal }
