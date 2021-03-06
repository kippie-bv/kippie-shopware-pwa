const getPaymentMethodsEndpoint = () => `/store-api/v3/kpbv/payment-methods`
const getShippingMethodsEndpoint = () => `/store-api/v3/kpbv/shipping-methods`
const indexStoresEndpoint = () => `/store-api/kpbv/stores`
const getStoreEndpoint = (storeID) => `/store-api/kpbv/stores/${storeID}`
const getExcludedProductsEndpoint = (id) =>
  `/store-api/kpbv/excluded-products/${id}`
const saveStoreToCustomerEndpoint = () => `/store-api/kpbv/customer/save/store`
const getOpenTimesFromStoreEndpoint = (storeID) =>
  `/store-api/kpbv/opentimes/${storeID}`

const getPaymentMethods = async (contextInstance) => {
  const resp = await contextInstance.invoke.get(getPaymentMethodsEndpoint())

  return resp.data
}

const getShippingMethods = async (contextInstance) => {
  const resp = await contextInstance.invoke.get(getShippingMethodsEndpoint())

  return resp.data
}

const getStores = async (contextInstance, body = {}) => {
  const resp = await contextInstance.invoke.post(indexStoresEndpoint(), body)

  return resp.data
}

const getStore = async (storeID, contextInstance, body = {}) => {
  const resp = await contextInstance.invoke.post(
    getStoreEndpoint(storeID),
    body,
  )

  return resp.data
}

const getExcludedProducts = async (contextInstance, id) => {
  const resp = await contextInstance.invoke.post(
    getExcludedProductsEndpoint(id),
  )

  return resp.data
}

const saveStoreToCustomer = async (params = {}, contextInstance) => {
  const resp = await contextInstance.invoke.post(
    saveStoreToCustomerEndpoint(),
    {
      ...params,
    },
  )

  return resp.data
}

const getOpenTimesFromStore = async (storeId, contextInstance) => {
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
