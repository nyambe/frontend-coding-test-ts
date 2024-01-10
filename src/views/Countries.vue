<template>
	<div>
		<pre>
			{{ continents }}
		</pre>
	</div>
</template>

<script setup lang="ts">
import { countries, continents } from 'countries-list';
import  { useContinents } from '../composables/useCountries';
// src/composables/useCountries.ts

const { getContinents } = useContinents();
getContinents();


</script>

<style scoped>

</style>