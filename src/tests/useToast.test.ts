import { describe, it, expect } from 'vitest'
import useToast from '../composables/useToast'


describe('useToast', () => {
  it('initial state', () => {
    const { showToast, toastMessage, toastTitle, toastType } = useToast()

    expect(showToast.value).toBe(false)
    expect(toastMessage.value).toBe('')
    expect(toastTitle.value).toBe('')
    expect(toastType.value).toBeUndefined()
  })

  it('showToastMessage changes showToast state', async () => {
    const { showToast, showToastMessage, toastStyles } = useToast()

    showToastMessage(100)
    expect(showToast.value).toBe(true)
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve(); // resolve without returning any value
      }, 200);
    });
    expect(showToast.value).toBe(false)
  })


  it('toastClass computed property', () => {
    const { toastType, toastClass, toastStyles } = useToast()
    expect(toastClass.value).toEqual(['px-4 py-3 border-t-4 rounded-b shadow-md', ''])
    toastType.value = 'success'
    console.log(toastStyles[toastType.value])
    expect(toastStyles[toastType.value]).toContain('bg-green-100 border-green-400 text-green-700')
  })
})
