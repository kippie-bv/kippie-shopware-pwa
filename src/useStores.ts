export declare interface Store {
  active: Boolean
  addition: String | null
  apiAlias: String
  city: String
  createdAt: String
  description: String | null
  email: String | null
  excludedProducts: Array<[]> | null
  houseNumber: number | null
  id: String
  isPickup: Boolean
  latitude: number | null
  longitude: number
  locationName: String | null
  name: String
  openTimes: Array<[]> | null
  owner: String | null
  phone: String | null
  postCode: String | null
  street: String | null
  translated: Array<[]> | null
  updatedAt: String | null
}

import { ref, computed, WritableComputedRef, Ref } from '@vue/composition-api'
import {
  getApplicationContext,
  useSharedState,
} from '@shopware-pwa/composables'
import {
  getStores,
  getStore,
  saveStoreToCustomer,
  getExcludedProducts,
  getOpenTimesFromStore,
} from './shopware-6-client'

const useStores = (rootContext: any) => {
  const loading = ref(false)
  const error = ref(null)

  const startLoading = (loading.value = true)
  const stopLoading = (loading.value = false)

  const { apiInstance, contextName } = getApplicationContext(
    rootContext,
    'useStores',
  )
  const { sharedRef } = useSharedState(rootContext)
  const _storeStores: WritableComputedRef<Store[] | null> = sharedRef(
    `${contextName}-stores`,
  )
  const _storeSelectedStore: WritableComputedRef<String | null> = sharedRef(
    `${contextName}-selected-store`,
  )
  const _storeStore: WritableComputedRef<Store | null | undefined> = sharedRef(
    `${contextName}-store`,
  )
  const _storeExcludedProducts: WritableComputedRef<any[] | null> = sharedRef(
    `${contextName}-excluded-products`,
  )
  const _storeOpenTimes: WritableComputedRef<string[] | null> = sharedRef(
    `${contextName}-open-times`,
  )

  const stores = computed(() => _storeStores.value)
  const store = computed(() => _storeStore.value)
  const selectedStore = computed(() => _storeSelectedStore.value)
  const totalStores = computed(() => _storeStores.value?.length)
  const excludedProducts = computed(() => _storeExcludedProducts.value)
  const openTimes = computed(() => _storeOpenTimes.value)

  async function refreshStores(): Promise<void> {
    loading.value = true
    try {
      const result = await getStores(apiInstance)
      _storeStores.value = result.elements
    } catch (e) {
      const err = e
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function retrieveStore(id: string): Promise<void> {
    loading.value = true
    if (totalStores.value === 0) {
      try {
        const result = await getStore(id, apiInstance)
        _storeStore.value = result
      } catch (e) {
        const err = e
        error.value = err.message
      } finally {
        loading.value = false
      }
    } else {
      try {
        const store = _storeStores.value?.find((store) => store.id === id)
        _storeStore.value = store
      } catch (e) {
        const err = e
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
  }

  async function setStoreToCustomer(
    storeId: string,
    customerId: string,
  ): Promise<void> {
    loading.value = true
    try {
      saveStoreToCustomer(storeId, customerId, rootContext)
      _storeSelectedStore.value = storeId
    } catch (e) {
      const err = e
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function refreshExcludedProducts(): Promise<void> {
    loading.value = true
    try {
      const result = await getExcludedProducts(apiInstance)
      _storeExcludedProducts.value = result
    } catch (e) {
      const err = e
      error.value = err.message
    } finally {
      loading.value = false
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
