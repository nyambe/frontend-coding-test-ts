<template>
	<div class="w-full px-10 py-5">
		<div v-if="loading" class="flex items-center justify-center w-full min-h-screen">
			<svg class="w-12 h-12 text-teal-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
		</div>

		<div v-if="!loading" class="flex justify-center w-full">
		
			<div v-if="currentContinent && showContinentName">
				<div class="flex flex-col items-center justify-around h-32 mt-64" v-if="!currentCountry">
					<h2 class="py-4 text-3xl font-black lg:text-6xl">Currency Quest </h2>
					<div class="text-base">
						<p class="text-center">Guess the currency of the country</p>
						<p class="text-center">Good luck!</p>
						<p class="text-4xl">😂</p>
					</div>

					<button v-on:click="getCountries(currentContinent.code)" class="animate-pulse px-5 pb-1 mt-5 font-black text-xl border text-white rounded-full bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
						 play
					</button>
				
				</div>

				<div v-if="currentCountry" class="w-full p-5 text-6xl font-black text-center lg:text-9xl">
						{{ currentCountry?.emoji }}
				</div>


				<div class="w-full pb-5 text-xl font-black text-center md:text-5xl" v-if="currentCountry">
					{{ currentCountry.name  }} {{ currentCountry.currency }}
				</div>
				<div v-if="currencyMap && currencyMap.length" class="grid w-full max-w-6xl grid-cols-6 gap-2 mx-auto md:grid-cols-8">
					<button v-on:click="check(item)" class="p-1 text-xl font-bold text-center uppercase md:p-2 md:text-3xl hover:bg-gray-200" v-for="item in currencyMap" v-bind:key="item">
						{{ item }}	
					</button>
				</div>
				<button v-if="currentCountry && !showToast && !loadingCurrencyInfo" v-on:click="softReset" class="mt-10 text-xs md:mt-20">
				try another country
				</button>
				<div v-if="loadingCurrencyInfo" class="w-64 mx-auto mt-10 text-xs font-bold text-slate-700 md:mt-20 animate-ping"> ... </div>
			</div>
		</div>

	</div>
</template>

<script setup lang="ts">
import { useCountries } from '../composables/useCountries';
import useToast from '../composables/useToast';

const { toastMessage, showToastMessage, toastTitle, toastType, showToast } = useToast();
const { getContinents, showContinentName, getCountries,  currentCountry, currencyMap, softReset, getCurrencyInfo, currentCurrencyName, currentCurrencyCountries, loadingCurrencyInfo } = useCountries();
const { loading,  currentContinent  }	=  getContinents()

async function check(selectedCurrency: string) {
	await getCurrencyInfo(selectedCurrency)

	let answer =  'FALSE! '

	if (selectedCurrency === currentCountry.value?.currency) {
		answer = 'CORRECT! '
		toastType.value = 'success'
		

		setTimeout(() => {
			showToast.value = false
			softReset()
		}, 9000);

	} else {
		toastType.value = 'error'
	}

	toastTitle.value = `${answer} ${selectedCurrency}: ${currentCurrencyName.value}`;
	toastMessage.value = `Used in: ${currentCurrencyCountries.value}`;

	showToastMessage()
}




</script>

<style scoped>

</style>