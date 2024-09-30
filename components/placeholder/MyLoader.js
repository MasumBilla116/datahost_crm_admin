import LoadingOverlay from 'react-loading-overlay'
import BounceLoader from 'react-spinners/BounceLoader'
 
export default function MyLoader({ loading, children }) {
  return (
    <LoadingOverlay
        active={loading}
        spinner
        text="Loading content..."
    >
      {children}
    </LoadingOverlay>
  )
}