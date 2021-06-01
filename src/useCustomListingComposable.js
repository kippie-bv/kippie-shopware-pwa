import {
  getCategoryProducts,
  searchProducts,
} from '@shopware-pwa/shopware-6-client'
import {
  useDefaults,
  getApplicationContext,
  useCms,
  createListingComposable,
} from '@shopware-pwa/composables'

const useCustomListingComposable = (
  rootContext,
  listingKey = 'categoryListing',
  defaults = {},
) => {
  const { getDefaults } = useDefaults(rootContext, 'useListing')
  const { apiInstance } = getApplicationContext(rootContext, 'useListing')
  const assignedDefaults = Object.assign(getDefaults(), defaults)
  let searchMethod
  if (listingKey === 'productSearchListing') {
    searchMethod = async (searchCriteria) => {
      return searchProducts(searchCriteria, apiInstance)
    }
  } else {
    const { categoryId } = useCms(rootContext)
    searchMethod = async (searchCriteria) => {
      if (!categoryId.value) {
        throw new Error(
          '[useListing][search] Search category id does not exist.',
        )
      }
      return getCategoryProducts(categoryId.value, searchCriteria, apiInstance)
    }
  }
  return createListingComposable({
    rootContext,
    listingKey,
    searchMethod,
    searchDefaults: assignedDefaults,
  })
}

export { useCustomListingComposable }
