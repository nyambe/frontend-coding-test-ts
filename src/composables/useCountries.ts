import { ref, computed, onMounted } from 'vue';
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
const showContinentName = ref(false);
const showTimeout = ref(500);
const currentNumber = ref(0);

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
		code: code || currentContinent.value?.code,
	});

	const countries = computed(() => result.value?.countries || []);
	const currentCountry = computed(() => {
		if (continents.value) {
			console.log('continents', countries.value)
			const randomIndex = Math.floor(Math.random() * countries.value.length);
			return countries.value[randomIndex];
		}
		return undefined;
	})
	const currencyMap = computed(() => {
		const map = new Map();

		countries.value.forEach(country => {
			country.currencies.forEach(currency => {
				if (!map.has(currency)) {
					map.set(currency, []);
				}
				map.get(currency).push(country.name);
			});
		});

		return map;
	});

	return { countries, loading, error, currencyMap, currentCountry };


}



function getContinents() {
	const { result, loading, error } = useQuery<GetContinentsQueryResult>(GET_CONTINENTS)

	const continents = computed(() => result.value?.continents)

	const currentContinent = computed(() => {
		if (continents.value) {
			console.log('continents', continents.value)
			setShowContentinent()
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

export function useCountries() {
	return {
		continents,
		loadingStatus,
		errorMessage,
		currentContinent,
		showContinentName,
		getContinents,
		setShowContentinent,
		setRandomNumber,
		getCountries,

	}
}

export default continents


