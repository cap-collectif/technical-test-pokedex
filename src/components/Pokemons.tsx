import { graphql, useLazyLoadQuery } from 'react-relay'
import { PokemonsQuery } from '../../__generated__/PokemonsQuery.graphql'
import { useState } from 'react'

export const Pokemons = () => {
  const [search, setSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const searchapi = `${searchQuery}%`

  const GRAPHQL = graphql`
    query PokemonsQuery($searchapi: String!) {
      pokemons: pokemon_v2_pokemonspecies(limit: 150, where: { name: { _ilike: $searchapi } }) {
        name
        pokemonId: id
        pokemon_v2_pokemons {
          weight
          height
        }
        pokemonColor: pokemon_v2_pokemoncolor {
          pokemonId: id
          name
        }
      }
    }
  `

  const data = useLazyLoadQuery<PokemonsQuery>(GRAPHQL, { searchapi })

  const handleSubmit = e => {
    e.preventDefault()
    setSearchQuery(search)
  }

  return (
    <div className="p-4">
      <h1 className="mb-5">Pokemons :</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for a pokemon"
        />
        <button type="submit">Search</button>
      </form>
      <div className="grid grid-cols-4 gap-4">
        {data.pokemons.map(pokemon => (
          <div key={pokemon.pokemonId}>
            <h2>{pokemon.name}</h2>
            <p>Weight: {pokemon.pokemon_v2_pokemons[0].weight}</p>
            <p>Height: {pokemon.pokemon_v2_pokemons[0].height}</p>
            <p>Color: {pokemon.pokemonColor.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pokemons
