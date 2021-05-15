export declare interface Store {
  active: boolean
  addition: string | null
  apiAlias: string
  city: string
  createdAt: string
  description: string | null
  email: string | null
  excludedProducts: Array<[]> | null
  houseNumber: number | null
  id: string
  isPickup: boolean
  latitude: number | null
  longitude: number
  locationName: string | null
  name: string
  openTimes: Array<[]> | null
  owner: string | null
  phone: string | null
  postCode: string | null
  street: string | null
  translated: Array<[]> | null
  updatedAt: string | null
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
  const _storeSelectedStore: WritableComputedRef<string | null> = sharedRef(
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
    startLoading
    try {
      const result = await getStores(apiInstance)
      _storeStores.value = result.elements
    } catch (e) {
      const err = e
      error.value = err.message
    } finally {
      stopLoading
    }
  }

  async function retrieveStore(id: string): Promise<void> {
    startLoading
    if (totalStores.value === 0) {
      try {
        const result = await getStore(id, apiInstance)
        _storeStore.value = result
      } catch (e) {
        const err = e
        error.value = err.message
      } finally {
        stopLoading
      }
    } else {
      try {
        let store = _storeStores.value?.find((store) => store.id === id)
        _storeStore.value = store
      } catch (e) {
        const err = e
        error.value = err.message
      } finally {
        stopLoading
      }
    }
  }

  async function setStoreToCustomer(
    storeId: string,
    customerId: string,
  ): Promise<void> {
    startLoading
    try {
      saveStoreToCustomer(storeId, customerId, rootContext)
      _storeSelectedStore.value = storeId
    } catch (e) {
      const err = e
      error.value = err.message
    } finally {
      stopLoading
    }
  }

  async function refreshExcludedProducts(): Promise<void> {
    startLoading
    try {
      const result = await getExcludedProducts(apiInstance)
      _storeExcludedProducts.value = result
    } catch (e) {
      const err = e
      error.value = err.message
    } finally {
      stopLoading
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
