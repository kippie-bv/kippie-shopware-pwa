import Cookie from 'cookie-universal'
import { saveStoreToCustomer } from '@kippie/shopware-6-client'

const $cookies = Cookie()

const KIPPIE_INTERCEPTOR_KEYS = {
  ON_STORE_SELECTION_CHANGED: 'onStoreSelectionChanged',
}

const onStoreSelectionChanged = async (store, userContext, contextinstance) => {
  $cookies.set('sw-selected-store', store.id)

  if (userContext.isLoggedIn.value) {
    if (userContext.user?.value?.extensions?.foreignKeys?.store !== store.id) {
      await saveStoreToCustomer(store.id, userContext.user.id, contextinstance)
    }
  }
  return false
}

const onUserLoginSetStore = async (user, contextinstance) => {
  if (user.extensions.foreignKeys.store) {
    $cookies.set('sw-selected-store', user.extensions.foreignKeys.store)
  } else {
    if ($cookies.get('sw-selected-store')) {
      await saveStoreToCustomer(
        $cookies.get('sw-selected-store'),
        user.id,
        contextinstance,
      )
    }
  }
}

const onChangeShippingMethodOpenModal = async (
  shippingMethod,
  user,
  contextInstance,
) => {
  const shippingMethodDetails = await getShippingMethodDetails(
    shippingMethod.id,
    contextInstance,
  )
  if (!['afhalen', 'pickup'].includes(shippingMethodDetails.name.toLowerCase()))
    return

  if (!user.extensions.foreignKeys.store) {
    console.log('OPEN STORE LOCATOR MODEL')
  }
}

export {
  onStoreSelectionChanged,
  onUserLoginSetStore,
  onChangeShippingMethodOpenModal,
  KIPPIE_INTERCEPTOR_KEYS,
}
