import { ref, computed, watch } from 'vue';
import { provideApolloClient, useQuery } from "@vue/apollo-composable";
import { ApolloClient, createHttpLink, InMemoryCache, gql, ApolloError } from '@apollo/client/core'

export interface Continent {
	code: string;
	name: string;
}

export interface GetContinentsQueryResult {
	continents: Continent[];
}

export interface Language {
	code: string;
	name: string;
}

export interface Country {
	code: string;
	name: string;
	currencies: string[];
	currency: string;
	emoji: string;
	languages: Language[];
}

interface CountryName {
	common: string;
	official: string;
}

interface MapsInfo {
	googleMaps: string;
	openStreetMaps: string;
}

interface CurrencyInfo {
	name: string;
	symbol: string;
}

interface CurrenciesInfo {
	[key: string]: CurrencyInfo;
}

interface CountryInfo {
	name: CountryName;
	maps: MapsInfo;
	currencies: CurrenciesInfo;
}


const httpLink = createHttpLink({
	uri: 'https://countries.trevorblades.com',
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
	link: httpLink,
	cache,
})

provideApolloClient(apolloClient);

const GET_CONTINENTS = gql`
	query GetContinents {
		continents {
			code
			name
		}
	}
`;

const GET_COUNTRIES_BY_CONTINENT = gql`
query GetCountries($code: String) {
	countries(filter: { continent: { eq: $code }, currency: { ne: "EUR" } }) {
		code
		name
		currencies
		currency
		emoji
		languages{
			code
			name
		}
	}
}
`;

const continents = ref<Continent[]>()
const loadingStatus = ref(false)
const errorMessage = ref<ApolloError | null>()


// Random Continent

const currentContinent = ref<Continent>();
const showContinentName = ref(true);
const showTimeout = ref(500);
const currentNumber = ref(0);
const countriesList = ref<Country[]>();
const currentCountry = ref<Country>();
const currencyMap = ref<string[]>();
const countriesCurrencyInfo = ref<CountryInfo[]>();


function setRandomNumber(length: number) {
	return Math.floor(Math.random() * length);
}

function setShowContentinent() {
	showContinentName.value = true;
	setTimeout(() => {
		showContinentName.value = false;
	}, showTimeout.value);
}


function getCountries(code: string) {

	const { result, loading, error } = useQuery(GET_COUNTRIES_BY_CONTINENT, {
		code
	});

	const countries = computed(() => result.value?.countries || []);

	watch(countries, (newCountries) => {
		countriesList.value = newCountries;
		if (newCountries.length > 0) {
			const randomIndex = Math.floor(Math.random() * newCountries.length);
			currentCountry.value = newCountries[randomIndex];
			const map = new Map();
			newCountries.forEach(country => {
				country.currencies.forEach(currency => {
					if (!map.has(currency)) {
						map.set(currency, []);
					}
					map.get(currency).push(country.name);
				});
			});
			currencyMap.value = Array.from(map.keys());
		}
	});

	return { countries, loading, error, currencyMap, currentCountry };

}



function getContinents() {
	const { result, loading, error } = useQuery<GetContinentsQueryResult>(GET_CONTINENTS)

	const continents = computed(() => result.value?.continents)

	const currentContinent = computed(() => {
		if (continents.value) {
			console.log('continents', continents.value)
			const randomIndex = Math.floor(Math.random() * continents.value.length);
			return continents.value[randomIndex];
		}
		return undefined;
	})

	function checkAnswerContinent(code) {
		console.log('code', code, currentContinent.value)
		if (!currentContinent.value || !continents.value || !result.value) {
			return
		}
		if (currentContinent.value?.code === code) {

			alert('Correct!');
			const res = getCountries(code);

			console.log('res', res?.countries.value)

			// result.value?.continents?.splice(continents.value.indexOf(currentContinent.value), 1);
		} else {
			alert('Wrong! Try again.');
		}
		// selectRandomContinent(); // Select a new continent for the next round
	}

	console.log('dontine', currentContinent.value)
	return {
		result,
		loading,
		error,
		continents,
		currentContinent,
		checkAnswerContinent
	}
}

function softReset() {
	if (countriesList.value && currentCountry.value) {
		if (countriesList.value.indexOf(currentCountry.value) === countriesList.value.length - 1) {
			const [first] = countriesList.value;
			currentCountry.value = first;
		} else {
			currentCountry.value = countriesList.value[countriesList.value.indexOf(currentCountry.value) + 1];
		}

		console.log('softReset', countriesList.value.indexOf(currentCountry.value), countriesList.value.length)
	}
}

async function getCurrencyInfo(currency: string) {
	// fetch from https://restcountries.com/v3.1/currency/{currency}
	countriesCurrencyInfo.value = [];

	try {
		const response = await fetch(`https://restcountries.com/v3.1/currency/${currency}`)
		const info = await response.json();
		countriesCurrencyInfo.value = info as CountryInfo[];
		console.log('response', info)
	} catch (error) {
		console.log('error', error)
	}

}


export function useCountries() {

	return {
		continents,
		loadingStatus,
		errorMessage,
		currentContinent,
		showContinentName,
		currentCountry,
		countriesList,
		currencyMap,
		countriesCurrencyInfo,
		getContinents,
		setShowContentinent,
		setRandomNumber,
		getCountries,
		softReset,
		getCurrencyInfo

	}
}

export default continents


