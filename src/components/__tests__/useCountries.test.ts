import { describe, it, expect } from 'vitest'
import { gql } from '@apollo/client/core'
import { createMockClient } from 'mock-apollo-client'
import { provideApolloClient, useQuery } from '@vue/apollo-composable'
import { useCountries, GET_CONTINENTS } from '../../composables/useCountries'



describe('useCountries', () => {
	it('initial state', () => {
		const {
			continents,
			currentContinent,
			currentCountry,
			currencyMap,
			showContinentName
		} = useCountries();

		expect(continents.value).toBeUndefined();
		expect(currentContinent.value).toBeUndefined();
		expect(currentCountry.value).toBeUndefined();
		expect(currencyMap.value).toBeUndefined();
		expect(showContinentName.value).toBe(true);
	});


	it('fetch continents', async () => {
		const { getContinents } = useCountries();
		const mockClient = createMockClient();

		mockClient.setRequestHandler(
			GET_CONTINENTS,
			() => Promise.resolve({
				data: {
					continents: [
						{
							code: 'AF',
							name: 'Africa'
						},
						{
							code: 'AS',
							name: 'Asia'
						},
						{
							code: 'EU',
							name: 'Europe'
						},
						{
							code: 'NA',
							name: 'North America'
						},
						{
							code: 'OC',
							name: 'Oceania'
						},
						{
							code: 'SA',
							name: 'South America'
						}
					]
				}
			})
		);

		provideApolloClient(mockClient);

		const { continents, currentContinent, loading, error, refetch } = getContinents();
		await refetch();

		expect(continents.value).toHaveLength(6);
		expect(currentContinent.value).toHaveProperty('code');
		expect(currentContinent.value).toHaveProperty('name');
		expect(loading.value).toBe(false);
		expect(error.value).toBeNull();

	})
})