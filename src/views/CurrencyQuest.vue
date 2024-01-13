<template>
  <div class="w-full px-10 py-5">
    <div
      v-if="loading"
      class="flex items-center justify-center w-full min-h-screen"
    >
      <svg
        class="w-12 h-12 text-teal-600 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>

    <div v-if="!loading" class="flex justify-center w-full">
      <div v-if="currentContinent && showContinentName">
        <div
          v-if="!currentCountry"
          class="flex flex-col items-center justify-around h-32 mt-64"
        >
          <h2 class="py-4 text-3xl font-black lg:text-6xl">Currency Quest</h2>
          <div class="text-base">
            <p class="text-center">Guess the currency of the country</p>
            <p class="text-center">Good luck!</p>
            <p class="text-4xl">😂</p>
          </div>

          <button
            class="animate-pulse px-5 pb-1 mt-5 font-black text-xl border text-white rounded-full bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
            v-on:click="getCountries(currentContinent.code)"
          >
            play
          </button>
        </div>

        <div
          v-if="currentCountry"
          class="w-full p-5 text-6xl font-black text-center lg:text-9xl"
        >
          {{ currentCountry?.emoji }}
        </div>

        <div
          v-if="currentCountry"
          class="w-full pb-5 text-xl font-black text-center md:text-5xl"
        >
          {{ currentCountry.name }}
					 <button v-on:click="help" class="text-sm">
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="currentColor" d="M140 180a12 12 0 1 1-12-12a12 12 0 0 1 12 12M128 72c-22.06 0-40 16.15-40 36v4a8 8 0 0 0 16 0v-4c0-11 10.77-20 24-20s24 9 24 20s-10.77 20-24 20a8 8 0 0 0-8 8v8a8 8 0 0 0 16 0v-.72c18.24-3.35 32-17.9 32-35.28c0-19.85-17.94-36-40-36m104 56A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88"/></svg>
					 </button>
        </div>
        <div
          v-if="currencyMap && currencyMap.length && !loadingCurrencyInfo"
          class="grid w-full max-w-6xl grid-cols-6 gap-2 mx-auto md:grid-cols-8"
        >
          <button
            v-for="item in currencyMap"
            v-bind:key="item"
						v-bind:disabled="showToast"
            class="p-1 text-xl font-bold text-center uppercase md:p-2 md:text-3xl hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
            v-on:click="check(item)"
          >
            {{ item }}
          </button>
        </div>
        <div
          v-if="loadingCurrencyInfo"
          class="w-64 mx-auto mt-10 text-xs font-bold text-slate-700 md:mt-20 animate-ping"
        >
          ...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCountries } from '../composables/useCountries'
import useToast from '../composables/useToast'


const { toastMessage, showToastMessage, toastTitle, toastType, showToast, toastTimeout } =
  useToast()
const {
  getContinents,
  showContinentName,
  getCountries,
  currentCountry,
  currencyMap,
  softReset,
  getCurrencyInfo,
  currentCurrencyName,
  currentCurrencyCountries,
  loadingCurrencyInfo,
	tries,
	maxTries
} = useCountries()
const { loading, currentContinent, refetch } = getContinents()

function help() {
	toastTitle.value = 'Help'
	toastMessage.value =
		'Worlwide three-letter format currencies. The first two letters of the code are usually the country code (e.g., "US" for United States, "AU" for Australia). GUESS THE CURRENCY CODE.	Country will reset after 3 wrong answers. Max tries will increase after 3 incorrect answers.'
	toastType.value = 'info'
	showToastMessage(9000)
}

async function check(selectedCurrency: string) {
  await getCurrencyInfo(selectedCurrency)
	const isCorrectCurrency = currentCountry.value?.currencies.includes(selectedCurrency);
	tries.value += 1

  let answer = 'FALSE! '

  if (isCorrectCurrency) {
    answer = 'TRUE! '
    toastType.value = 'success'
    toastMessage.value = `Used in: ${currentCurrencyCountries.value}.`
	
    setTimeout(() => {
      showToast.value = false
			maxTries.value = 3
			tries.value = 0
      softReset()
    }, toastTimeout.value)
		
	} else {	
		toastType.value = 'error'
    toastMessage.value = `Used in: ${currentCurrencyCountries.value}.  ${tries.value} of ${maxTries.value} tries.`
	}

	
	if (tries.value === maxTries.value) {
		toastType.value = 'warning'
		answer = `FALSE! ${currentCountry.value?.name}`
		toastTitle.value = `${answer} ${currentCountry.value?.emoji}: ${currentCountry.value?.currency}`
		toastMessage.value = `TOO MANY TRIES!.`

		showToastMessage(toastTimeout.value+1000)
		setTimeout(() => {
			tries.value = 0
			maxTries.value = maxTries.value < 5 ? maxTries.value + 1 : maxTries.value
      toastTimeout.value = 3000
			softReset()
		}, toastMessage.value.length)
		
	} else {
		toastTitle.value = `${answer} ${selectedCurrency}: ${currentCurrencyName.value}`
  	
		showToastMessage(toastTimeout.value)
	}  
}


</script>

<style scoped></style>
