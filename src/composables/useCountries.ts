import { continents } from 'countries-list';
import { ref, computed } from 'vue';
import { ApolloClient, createHttpLink, InMemoryCache, gql, ApolloError } from '@apollo/client/core'
import { provideApolloClient, useQuery } from "@vue/apollo-composable";

export interface Continent {
	code: string;
	name: string;
}

export interface GetContinentsQueryResult {
	continents: Continent[];
}

// HTTP connection to the API
const httpLink = createHttpLink({
	// You should use an absolute URL here
	uri: 'https://countries.trevorblades.com',
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
	link: httpLink,
	cache,
})

const GET_CONTINENTS = gql`
	query GetContinents {
		continents {
			code
			name
		}
	}
`;

const continents = ref<GetContinentsQueryResult>()
const loadingStatus = ref(false)
const errorMessage = ref<ApolloError | null>()


function getContinents() {
	const query = provideApolloClient(apolloClient)(() => useQuery<GetContinentsQueryResult>(GET_CONTINENTS))
	const { result, loading, error } = query
	const continents = result.value?.continents
	return {
		result,
		continents,
		loading,
		error
	}
}


console.log(continents)

export function useCountries() {
	return {
		continents,
		loadingStatus,
		errorMessage,
		getContinents
	}
}

export default continents


