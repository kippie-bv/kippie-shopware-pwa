const generateShippingMethodsLabel = (
  shippingMethodsFromProduct,
  shippingMethods,
) => {
  if (shippingMethodsFromProduct === undefined) {
    return 'Niet Beschikbaar'
  }
  let generatedText = ''

  shippingMethods.forEach((shippingMethod) => {
    if (!shippingMethodsFromProduct.includes(shippingMethod.id)) {
      return
    }
    if (generatedText.length === 0) {
      generatedText = generatedText.concat(shippingMethod.name)
    } else {
      generatedText = generatedText.concat(' en ').concat(shippingMethod.name)
    }
  })

  return generatedText
}

export { generateShippingMethodsLabel }
