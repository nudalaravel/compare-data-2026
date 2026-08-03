export default defineNuxtPlugin(() => {
  const { hydrateUserFromStorage } = useCompareWorkflow()
  hydrateUserFromStorage()
})
