import React from 'react'

export default function HoverCounter({count,incrementCount}) {
  return (
    <div onMouseOut={incrementCount}>Hovered {count} times</div>
  )
}
