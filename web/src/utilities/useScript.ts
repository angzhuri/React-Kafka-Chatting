import { useState, useEffect } from 'react'

const useScript = (src: string | null) => {
  const [status, setStatus] = useState(src ? 'loading' : 'idle')

  useEffect(() => {
    if (!src) {
      setStatus('idle')
      return
    }

    let script = document.querySelector(`script[src="${src}"]`)

    if (!script) {
      script = document.createElement('script')
      script.setAttribute('src', src)
      script.setAttribute('async', 'async')
      script.setAttribute('data-status', 'loading')
      document.body.appendChild(script)

      const setAttributeFromEvent = (event: Event) => {
        script?.setAttribute('data-status', event.type === 'load' ? 'ready' : 'error')
      }

      script.addEventListener('load', setAttributeFromEvent)
      script.addEventListener('error', setAttributeFromEvent)
    } else {
      setStatus(script.getAttribute('data-status') as React.SetStateAction<string>)
    }

    const setStateFromEvent = (event: Event) => {
      setStatus(event.type === 'load' ? 'ready' : 'error')
    }

    script.addEventListener('load', setStateFromEvent)
    script.addEventListener('error', setStateFromEvent)

    return () => {
      if (script) {
        script.removeEventListener('load', setStateFromEvent)
        script.removeEventListener('error', setStateFromEvent)
      }
    }
  }, [src])

  return status
}

export default useScript
