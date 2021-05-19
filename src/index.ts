import { useStores } from './useStores'
import { useExtendedCart } from './useExtendedCart'
import { useProductRecommendationModal } from './useProductRecommendationModal'
import VueCompositionApi from '@vue/composition-api'
import Vue from 'vue'
Vue.use(VueCompositionApi)

export * from './shopware-6-client'
export { useStores, useExtendedCart, useProductRecommendationModal }
