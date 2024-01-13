import { ref, computed } from 'vue'

type ToastType = 'success' | 'error' | 'warning' | 'info'
type ToastStylesType = Record<ToastType, string>

const showToast = ref(false)
const toastTimeout = ref(5000)
const toastMessage = ref('')
const toastTitle = ref('')
const toastType = ref<ToastType>()
const toastStyles: ToastStylesType = {
	error: 'bg-red-100 border-red-400 text-red-700',
	info: 'bg-blue-100 border-blue-400 text-blue-700',
	success: 'bg-green-100 border-green-400 text-green-700',
	warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
}
const toastClass = computed(() => {
	return [
		'px-4 py-3 border-t-4 rounded-b shadow-md',
		toastType.value ? toastStyles[toastType.value] : '',
	]
})

function showToastMessage(timeout = 5000) {
	showToast.value = true
	setTimeout(() => {
		showToast.value = false
	}, timeout)
}

export default function useToast() {
	return {
		showToast,
		toastMessage,
		toastTitle,
		toastType,
		toastStyles,
		toastClass,
		toastTimeout,
		showToastMessage,
	}
}
