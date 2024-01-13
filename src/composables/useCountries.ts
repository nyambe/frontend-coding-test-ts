import { ref, computed, watch } from 'vue'
import { provideApolloClient, useQuery } from '@vue/apollo-composable'
import {
	ApolloClient,
	createHttpLink,
	InMemoryCache,
	gql,
	ApolloError,
} from '@apollo/client/core'

export interface Continent {
	code: string
	name: string
}

export interface GetContinentsQueryResult {
	continents: Continent[]
}

export interface Language {
	code: string
	name: string
}

export interface Country {
	code: string
	name: string
	currencies: string[]
	currency: string
	emoji: string
	languages: Language[]
}

interface CountryName {
	common: string
	official: string
}

interface MapsInfo {
	googleMaps: string
	openStreetMaps: string
}

interface CurrencyInfo {
	name: string
	symbol: string
}

interface CurrenciesInfo {
	[key: string]: CurrencyInfo
}

interface CountryInfo {
	name: CountryName
	maps: MapsInfo
	currencies: CurrenciesInfo
}

const httpLink = createHttpLink({
	uri: 'https://countries.trevorblades.com',
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
	link: httpLink,
	cache,
})

provideApolloClient(apolloClient)

const GET_CONTINENTS = gql`
  query GetContinents {
    continents(filter: { code: { ne: "AN" }}) {
      code
      name
    }
  }
`

const GET_COUNTRIES_BY_CONTINENT = gql`
  query GetCountries($code: String) {
    countries(filter: { continent: { eq: $code }, currency: { ne: "EUR" } }) {
      code
      name
      currencies
      currency
      emoji
      languages {
        code
        name
      }
    }
  }
`

const continents = ref<Continent[]>()
const loadingStatus = ref(false)
const errorMessage = ref<ApolloError | null>()

// currency per continent

const currentContinent = ref<Continent>()
const showContinentName = ref(true)
const showTimeout = ref(500)
const countriesList = ref<Country[]>()
const currentCountry = ref<Country>()
const currencyMap = ref<string[]>()
const maxTries = ref(3)
const tries = ref(0)

// currency info
const countriesCurrencyInfo = ref<CountryInfo[]>()
const currentCurrencyName = ref<string>()
const currentCurrencyCountries = ref<string>()
const loadingCurrencyInfo = ref(false)

function setRandomNumber(length: number) {
	return Math.floor(Math.random() * length)
}

function setShowContentinent() {
	showContinentName.value = true
	setTimeout(() => {
		showContinentName.value = false
	}, showTimeout.value)
}

function getCountries(code: string) {
	const { result, loading, error } = useQuery(GET_COUNTRIES_BY_CONTINENT, {
		code,
	})

	const countries = computed<Country[]>(() => result.value?.countries || [])

	watch(countries, (newCountries) => {
		countriesList.value = newCountries
		if (newCountries.length > 0) {
			const randomIndex = Math.floor(Math.random() * newCountries.length)
			currentCountry.value = newCountries[randomIndex]
			const map = new Map()
			newCountries.forEach((country) => {
				country.currencies.forEach((currency) => {
					if (!map.has(currency)) {
						map.set(currency, [])
					}
					map.get(currency).push(country.name)
				})
			})
			currencyMap.value = Array.from(map.keys())
		}
	})

	return { countries, loading, error, currencyMap, currentCountry }
}

function getContinents() {
	const { result, loading, error } =
		useQuery<GetContinentsQueryResult>(GET_CONTINENTS)

	const continents = computed(() => result.value?.continents)

	const currentContinent = computed(() => {
		if (continents.value) {
			const randomIndex = Math.floor(Math.random() * continents.value.length)
			return continents.value[randomIndex]
		}
		return undefined
	})

	return {
		result,
		loading,
		error,
		continents,
		currentContinent,
	}
}

function softReset() {
	if (countriesList.value && currentCountry.value) {
		if (
			countriesList.value.indexOf(currentCountry.value) ===
			countriesList.value.length - 1
		) {
			const [first] = countriesList.value
			currentCountry.value = first
		} else {
			currentCountry.value =
				countriesList.value[
				countriesList.value.indexOf(currentCountry.value) + 1
				]
		}
	}
}

async function getCurrencyInfo(currency: string) {
	countriesCurrencyInfo.value = []
	currentCurrencyName.value = currency
	currentCurrencyCountries.value = ''
	loadingCurrencyInfo.value = true

	try {
		const response = await fetch(
			`https://restcountries.com/v3.1/currency/${currency}`,
		)
		const info = await response.json()
		countriesCurrencyInfo.value = info as CountryInfo[]
		if (countriesCurrencyInfo.value && countriesCurrencyInfo.value.length > 0) {
			currentCurrencyName.value =
				countriesCurrencyInfo.value[0].currencies[currency].name
			currentCurrencyCountries.value = countriesCurrencyInfo.value
				.map((country) => country.name.common)
				.join(', ')
		}
	} catch (error) {
		currentCurrencyCountries.value = 'currency info not available'
		console.log('error', error)
	}
	loadingCurrencyInfo.value = false
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
		currentCurrencyCountries,
		currentCurrencyName,
		loadingCurrencyInfo,
		maxTries,
		tries,
		getContinents,
		setShowContentinent,
		setRandomNumber,
		getCountries,
		softReset,
		getCurrencyInfo,
	}
}

export default continents
