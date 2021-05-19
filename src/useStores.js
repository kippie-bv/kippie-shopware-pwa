import { ref, computed } from '@vue/composition-api'
import {
  getApplicationContext,
  useSharedState,
} from '@shopware-pwa/composables'
import {
  getStores,
  getStore,
  saveStoreToCustomer,
  getExcludedProducts,
} from './shopware-6-client'

const useStores = (rootContext) => {
  const loading = ref(false)
  const error = ref(null)

  const startLoading = () => (loading.value = true)
  const stopLoading = () => (loading.value = false)

  const { apiInstance, contextName } = getApplicationContext(
    rootContext,
    'useStores',
  )
  const { sharedRef } = useSharedState(rootContext)
  const _storeStores = sharedRef(`${contextName}-stores`)
  const _storeSelectedStore = sharedRef(`${contextName}-selected-store`)
  const _storeStore = sharedRef(`${contextName}-store`)
  const _storeExcludedProducts = sharedRef(`${contextName}-excluded-products`)
  const _storeOpenTimes = sharedRef(`${contextName}-open-times`)

  const stores = computed(() => _storeStores.value)
  const store = computed(() => _storeStore.value)
  const selectedStore = computed(() => _storeSelectedStore.value)
  const totalStores = computed(() => _storeStores.value?.length)
  const excludedProducts = computed(() => _storeExcludedProducts.value)
  const openTimes = computed(() => _storeOpenTimes.value)

  async function refreshStores() {
    startLoading()
    try {
      const result = await getStores(apiInstance)
      _storeStores.value = result.elements
    } catch (e) {
      const err = e
      error.value = err.message
    } finally {
      stopLoading()
    }
  }

  async function retrieveStore(id) {
    startLoading()
    if (totalStores.value === 0) {
      try {
        const result = await getStore(id, apiInstance)
        _storeStore.value = result
      } catch (e) {
        const err = e
        error.value = err.message
      } finally {
        stopLoading()
      }
    } else {
      try {
        const result = _storeStores.value?.find((value) => value.id === id)
        _storeStore.value = result
      } catch (e) {
        const err = e
        error.value = err.message
      } finally {
        stopLoading()
      }
    }
  }

  async function setStoreToCustomer(storeId, customerId) {
    startLoading()
    try {
      saveStoreToCustomer(storeId, customerId, rootContext)
      _storeSelectedStore.value = storeId
    } catch (e) {
      const err = e
      error.value = err.message
    } finally {
      stopLoading()
    }
  }

  async function refreshExcludedProducts() {
    startLoading()
    try {
      const result = await getExcludedProducts(apiInstance)
      _storeExcludedProducts.value = result
    } catch (e) {
      const err = e
      error.value = err.message
    } finally {
      stopLoading()
    }
  }

  return {
    loading,
    error,
    stores,
    store,
    selectedStore,
    totalStores,
    excludedProducts,
    refreshStores,
    retrieveStore,
    setStoreToCustomer,
    refreshExcludedProducts,
  }
}

export { useStores }
