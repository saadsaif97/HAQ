"use client";

import React, { useEffect } from 'react'
import { createWidget } from '@typeform/embed'
import '@typeform/embed/build/css/widget.css'

export default function HAQ() {

  useEffect(()=>{
    const { refresh, unmount } = createWidget('LtDX31MU', {
      container: document.querySelector('#form'),
      width: 1068,
      height: 600,
      fullScreen: true
    })
  }, [])



  return (
    <div id='form'>HAQ</div>
  )
}
