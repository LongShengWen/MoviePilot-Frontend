// 请求和获取剪贴板内容
export async function getClipboardContent() {
  if (navigator.clipboard && window.isSecureContext) {
    return await navigator.clipboard.readText()
  } else {
    const input = document.createElement('textarea')
    document.body.appendChild(input)
    input.select()
    document.execCommand('paste')
    const content = input.value
    document.body.removeChild(input)
    return content
  }
}

// 将内容复制到剪贴板，兼容非安全域场景
export async function copyToClipboard(content: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(content)
  } else {
    const input = document.createElement('textarea')
    input.value = content
    document.body.appendChild(input)
    // 阻止事件冒泡到其他元素，确保 focusin 事件只在 textarea 元素上处理，不会影响其他元素
    input.addEventListener('focusin', e => e.stopPropagation())
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }
}

// VAPID公钥转Uint8Array
export function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// 判断是否为PWA
export const isPWA = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    return registrations.length > 0
  }
  return (window.navigator as any).standalone === true
}
