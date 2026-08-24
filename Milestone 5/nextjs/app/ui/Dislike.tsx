"use client"
import React from 'react'

const Dislike = ({blogSlug} : {blogSlug: string}) => {
  return (
    <button onClick={() => {
      console.log("Dislike Button clicked: ", blogSlug)
    }}>Dislike{ blogSlug }</button>
)
}

export default Dislike