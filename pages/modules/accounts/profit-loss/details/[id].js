import React from 'react'
import { useRouter } from 'next/router';

const Details = () => {
    const router = useRouter();
    const {
      isReady,
      query: { id },
    } = router;
  return (
    <div>
        <p>details  {id}</p>
    </div>
  )
}

export default Details;