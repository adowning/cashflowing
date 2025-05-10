import { ref, onMounted, onUnmounted } from 'vue'

export function useDisplay(maxWidth = 768) {
  const isMobile = ref(window.innerWidth < maxWidth)
  const containerMaxW =
    'xl:max-w-[600px] xl:mx-auto lg:max-w-[600px] lg:mx-auto md:max-w-[600px] md:mx-auto sm:max-w-[600px] sm:mx-auto xs:max-w-[600px] xs:mx-auto'

  const handleResize = () => {
    isMobile.value = window.innerWidth < maxWidth
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
    handleResize() // Initial check on mount
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return { isMobile, containerMaxW }
}
