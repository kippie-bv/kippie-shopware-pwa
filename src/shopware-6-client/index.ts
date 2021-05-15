import { createInstance } from '@shopware-pwa/shopware-6-client'

const getPaymentMethodsEndpoint = () => `/store-api/v3/kpbv/payment-methods`
const getShippingMethodsEndpoint = () => `/store-api/v3/kpbv/shipping-methods`
const indexStoresEndpoint = () => `/store-api/kpbv/stores`
const getStoreEndpoint = (storeID: String) =>
  `/store-api/kpbv/stores/${storeID}`
const getExcludedProductsEndpoint = () =>
  `/store-api/kpbv/stores/excluded-products`
const saveStoreToCustomerEndpoint = () => `/store-api/kpbv/customer/save/store`
const getOpenTimesFromStoreEndpoint = (storeID: String) =>
  `/store-api/kpbv/opentimes/${storeID}`

const defaultInstance = createInstance()

const getPaymentMethods = async (contextInstance = defaultInstance) => {
  const resp = await contextInstance.invoke.get(getPaymentMethodsEndpoint())

  return resp.data
}

const getShippingMethods = async (contextInstance = defaultInstance) => {
  const resp = await contextInstance.invoke.get(getShippingMethodsEndpoint())

  return resp.data
}

const getStores = async (
  contextInstance = defaultInstance,
  body: Object = {},
) => {
  const resp = await contextInstance.invoke.post(indexStoresEndpoint(), body)

  return resp.data
}

const getStore = async (
  storeID: String,
  contextInstance = defaultInstance,
  body: Object = {},
) => {
  const resp = await contextInstance.invoke.post(
    getStoreEndpoint(storeID),
    body,
  )

  return resp.data
}

const getExcludedProducts = async (
  contextInstance = defaultInstance,
  body: Object = {},
) => {
  const resp = await contextInstance.invoke.post(
    getExcludedProductsEndpoint(),
    body,
  )

  return resp.data
}

const saveStoreToCustomer = async (
  storeId: String,
  customerId: String,
  contextInstance = defaultInstance,
) => {
  const resp = await contextInstance.invoke.post(
    saveStoreToCustomerEndpoint(),
    {
      storeId: storeId,
      customerId: customerId,
    },
  )

  return resp.data
}

const getOpenTimesFromStore = async (
  storeId: String,
  contextInstance = defaultInstance,
) => {
  const body = {
    limit: 7,
    includes: {
      kpbv_open_times_entity: ['open', 'close', 'weekday', 'isClosed'],
    },
  }

  const resp = await contextInstance.invoke.post(
    getOpenTimesFromStoreEndpoint(storeId),
    body,
  )

  return resp.data
}

export {
  getPaymentMethods,
  getShippingMethods,
  getStores,
  getStore,
  getExcludedProducts,
  saveStoreToCustomer,
  getOpenTimesFromStore,
}
