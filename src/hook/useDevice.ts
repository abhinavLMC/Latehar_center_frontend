import { useEffect, useState } from 'react'

interface PropTypes {
  isMobileDevice: boolean
  tableScroll: {[key: string]: string | number}
  componentSize: "large" | "middle" | "small"
}
const useDevice = (): PropTypes => {
  const [isMobile, setIsMobile] = useState<boolean>(true)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 767) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    }
  }, [])

  return {
    isMobileDevice: isMobile,
    tableScroll: { x: isMobile ? 700 : ''},
    componentSize: isMobile ? "middle" : "large"
  }
}

export default useDevice