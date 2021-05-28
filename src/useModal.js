import { useUIState, getApplicationContext } from '@shopware-pwa/composables'

const useModal = (rootContext, modalContextName) => {
  const { contextName } = getApplicationContext(rootContext, modalContextName)

  const { isOpen, switchState } = useUIState(
    rootContext,
    `${contextName}_MODAL_STATE`,
  )

  const closeModal = () => {
    if (isOpen.value) switchState(false)
  }

  const openModal = () => {
    if (!isOpen.value) switchState(true)
  }

  const toggleModal = () => {
    switchState(!isOpen.value)
  }

  return {
    closeModal,
    openModal,
    toggleModal,
    isOpen,
  }
}

export { useModal }
