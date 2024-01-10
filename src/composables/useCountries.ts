import { ref } from 'vue';
import { useQuery, useMutation, gql } from '@apollo/client';
import { TContinents, TCountries, continents, ICountryData } from 'countries-list'


const continentsList = ref<TContinents>()
const GET_CONTINENTS = gql`
  query GetContinents {
    continents {
      code
      name
    }
  }
`;

export function useContinents() {
	const continents = ref([]);
	const loading = ref(false);
	const error = ref(null);

	const resultado = useQuery(GET_CONTINENTS);

	console.log('resultado', resultado)


	return {
		continents,
		loading,
		error,
	};
}

export function useCountries() {
	return {
		continentsList,
		useContinents
	}
}