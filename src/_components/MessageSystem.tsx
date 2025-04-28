import { useEffect, useState } from 'react'
import { useMessage } from '@/context/MessageContext'
import { Info, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const MessageSystem = () => {
  const { message, hideMessage } = useMessage()
  const [isVisible, setIsVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (!message || !message.id) return

    const currentPath = location.pathname
    const dismissedRoutes = JSON.parse(localStorage.getItem(`dismissed-${message.id}`) || '[]')

    if (dismissedRoutes.includes(currentPath)) {
      setIsVisible(false)
      return
    }

    const delayTimeout = setTimeout(() => {
      setIsVisible(true)

      let durationTimeout: NodeJS.Timeout | null = null

      if (message.duration) {
        durationTimeout = setTimeout(() => {
          setIsVisible(false)
          hideMessage()
        }, message.duration)
      }

      return () => {
        if (durationTimeout) clearTimeout(durationTimeout)
      }
    }, 1000)

    return () => clearTimeout(delayTimeout)
  }, [message?.id, location.pathname, hideMessage])

  const handleClose = () => {
    if (!message?.id) return
    const currentPath = location.pathname
    const key = `dismissed-${message.id}`
    const dismissedRoutes = JSON.parse(localStorage.getItem(key) || '[]')

    if (!dismissedRoutes.includes(currentPath)) {
      dismissedRoutes.push(currentPath)
    }

    localStorage.setItem(key, JSON.stringify(dismissedRoutes))
    setIsVisible(false)
    hideMessage()
  }

  if (!message || !isVisible) return null

  const typeColor = {
    info: 'border-blue-500 bg-blue-50 text-blue-800',
    warning: 'border-yellow-500 bg-yellow-50 text-yellow-800',
    error: 'border-red-500 bg-red-50 text-red-800',
  }

  const positionClass = {
    'top-right': 'top-6 right-6',
    'top-center': 'top-6 left-1/2 -translate-x-1/2',
    'top-left': 'top-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-6 left-6',
  }

  const tailClass = {
    'top-right': 'after:top-full after:right-8 after:rotate-0',
    'top-center': 'after:top-full after:left-1/2 after:-translate-x-1/2 after:rotate-0',
    'top-left': 'after:top-full after:left-8 after:rotate-0',
    'bottom-right': 'after:bottom-full after:right-8 after:rotate-180',
    'bottom-center': 'after:bottom-full after:left-1/2 after:-translate-x-1/2 after:rotate-180',
    'bottom-left': 'after:bottom-full after:left-8 after:rotate-180',
  }

  const pos = message.position || 'top-center'

  return (
    <div
      className={`fixed z-50 w-full max-w-md transition-all duration-500 ease-in-out ${positionClass[pos]}`}
    >
      <div
        className={`relative border-l-4 shadow-xl rounded-xl px-5 py-4 flex items-start gap-4 
        ${typeColor[message.type || 'info']} after:absolute after:border-8 after:border-transparent 
        after:border-t-[12px] after:border-t-current after:content-[''] ${tailClass[pos]}`}
      >
        <Info className="mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold text-base">{message.title}</h3>
          <p className="text-sm">{message.body}</p>
        </div>
        <button onClick={handleClose} className="text-sm text-gray-500 hover:text-gray-800">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default MessageSystem