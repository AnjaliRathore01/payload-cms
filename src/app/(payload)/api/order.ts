export const createOrder = async (items: any[], total: number) => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify({
      items,
      total,
    }),
  })
  return response.json()
}
