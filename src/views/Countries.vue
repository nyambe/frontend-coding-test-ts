<template>
	<div class="w-full">
		<div v-if="loading" class="flex items-start justify-center w-full h-screen pt-20">
			<svg class="w-12 h-12 text-teal-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
		</div>
		<div v-if="result" class="grid w-full max-w-4xl gap-2 mx-auto md:grid-cols-3">

			<button class="py-5 text-3xl font-black text-center uppercase hover:bg-gray-200" v-for="item in result.continents" v-bind:key="item.code">
				{{  item.code }}
			
			</button>
		
		</div>
		<button v-on:click="getContinents">get continents</button>
	</div>
</template>

<script setup lang="ts">
// import { countries, continents } from 'countries-list';
import { useCountries } from '../composables/useCountries';

const { getContinents } = useCountries();

const {result, error, loading }	= getContinents()




</script>

<style scoped>

</style>