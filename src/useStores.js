import { ref, computed } from '@vue/composition-api'
import {
  getApplicationContext,
  useSharedState,
  useUser,
  useIntercept,
} from '@shopware-pwa/composables'
import {
  getStores,
  getStore,
  saveStoreToCustomer,
  getExcludedProducts,
  getOpenTimesFromStore,
} from './shopware-6-client'

import { KIPPIE_INTERCEPTOR_KEYS } from './events'

const useStores = (rootContext) => {
  const SELECTED_STORE_COOKIE_KEY = 'sw-selected-store'
  const loading = ref(false)
  const error = ref(null)

  const startLoading = () => (loading.value = true)
  const stopLoading = () => (loading.value = false)

  const { apiInstance, contextName } = getApplicationContext(
    rootContext,
    'useStores',
  )

  const { broadcast } = useIntercept(rootContext)

  const { user, isLoggedIn } = useUser(rootContext)

  const { sharedRef } = useSharedState(rootContext)
  const _storeStores = sharedRef(`${contextName}-stores`)
  const _storeSelectedStore = sharedRef(`${contextName}-selected-store`)
  const _storeStore = sharedRef(`${contextName}-store`)
  const _storeExcludedProducts = sharedRef(`${contextName}-excluded-products`)

  const stores = computed(() => _storeStores.value)
  const store = computed(() => _storeStore.value)
  const selectedStore = computed(() => {
    if (_storeSelectedStore.value === null) {
      if (isLoggedIn) {
        if (user.value?.extensions?.foreignKeys.store) {
          _storeSelectedStore.value = user.value?.extensions?.foreignKeys.store
          return _storeSelectedStore.value
        }
      }
    }
    _storeSelectedStore.value = rootContext.$cookies.get(
      SELECTED_STORE_COOKIE_KEY,
    )
    return _storeSelectedStore.value
  })

  const totalStores = computed(() => _storeStores.value?.length)
  const excludedProducts = computed(() => _storeExcludedProducts.value)

  async function refreshStores() {
    startLoading()
    try {
      const result = await getStores(apiInstance, {
        associations: {
          openTimes: [],
        },
      })
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
    try {
      const result = await getStore(id, apiInstance, {
        associations: {
          openTimes: [],
        },
      })
      _storeStore.value = result.elements[0]
    } catch (e) {
      const err = e
      error.value = err.message
    } finally {
      stopLoading()
    }
  }

  async function setStoreToCustomer(storeId) {
    startLoading()
    try {
      rootContext.$cookies.set(SELECTED_STORE_COOKIE_KEY, storeId)
      if (isLoggedIn) {
        saveStoreToCustomer(storeId, user.id, apiInstance)
      }
      _storeSelectedStore.value = storeId
      broadcast(KIPPIE_INTERCEPTOR_KEYS.ON_STORE_SELECTION_CHANGED, {
        storeId: storeId,
        userId: user.id,
      })
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
