import { ChainLink, EvolutionChain, LocationAreaEncounter, Name, NamedAPIResource, PokeData, Pokemon, PokemonForm, PokemonSpecies, Resource } from "@/lib/interfaces";

export const API_URL = "https://pokeapi.co/api/v2";
export const LANG = "en";

export const LS = (() => ({
  /**
   * Get the item count from Local Storage.
   */
  cnt(): number { return localStorage.length; },
  /**
   * Get the nth item key from Local Storage.
   * @param idx An index.
   */
  key(idx: number): string | null { return localStorage.key(idx); },
  /**
   * Check for the existence of an item key from Local Storage.
   * @param key An item key.
   */
  has(key: string): boolean { return localStorage.getItem(key) != null; },
  /**
   * Get an item value from Local Storage.
   * @param key An item key.
   */
  get(key: string): any {
    try { return JSON.parse(localStorage.getItem(key)!); }
    catch (err) { console.error(err); return null; }
  },
  /**
   * Set an item value into Local Storage. Returning a success or failure.
   * @param key An item key.
   * @param val An item value.
   */
  set(key: string, val: any): boolean {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch (err) { console.error(err); return false; }
  },
  /**
   * Delete an item from Local Storage.
   * @param key An item key.
   */
  del(key: string): void { localStorage.removeItem(key); },
  /**
   * Delete all items from Local Storage.
   */
  clr(): void { localStorage.clear(); },
}))();

// FUNCTIONS =======================================================================================

function cbToResource(obj: NamedAPIResource): Resource {
  return {
    url: obj.url,
    num: +(obj.url.split("/").at(-2)!),
    str: obj.name,
  };
}

const cbFindName = (obj: Name): boolean => (obj.language.name === LANG);

const cbFlattenChain = (arr: Resource[], obj: ChainLink) => {
  arr.push(cbToResource(obj.species));
  obj.evolves_to.map((chain) => (cbFlattenChain(arr, chain)));
  return arr;
};

async function get(arg: string | Resource): Promise<any> {
  try
  {
    const res = await (() => {
      switch (typeof arg) {
        case "string": return fetch(`${API_URL}/${arg}`);
        case "object": return fetch(arg.url);
        default: return;
      }
    })();

    if (!res) {
      throw new Error(`Bad argument: ${arg}`);
    }

    if (!res.ok) {
      throw new Error(`Bad response status: ${res.status} ${res.statusText}`);
    }

    return res.json(); // * fallible
  }
  catch (err)
  {
    console.error(err);

    return null;
  }
}

export async function getPokemon(arg: string): Promise<PokeData | null> {
  try
  {
    const obj: PokeData = {};
    let tmp: any;

    // * normalize user arg
    arg = arg.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
    tmp = await get(`pokemon/${arg}/`);
    if (!tmp) throw new Error(`Unable to get pokemon: ${arg}`);
    const API_pokemon: Pokemon = tmp;

    obj.res_pokemon = {
      url: `${API_URL}/pokemon/${API_pokemon.id}/`,
      num: API_pokemon.id,
      str: API_pokemon.name
    };
    obj.res_species = cbToResource(API_pokemon.species);

    obj.sprites = [
      API_pokemon.sprites.other["official-artwork"].front_default,
      API_pokemon.sprites.other["official-artwork"].front_shiny,
    ];

    obj.types = API_pokemon.types.map(({ type }) => (cbToResource(type)));
    obj.abilities = API_pokemon.abilities.map(({ ability }) => (cbToResource(ability)));
    obj.moves = API_pokemon.moves.map(({ move }) => (cbToResource(move)));

    // todo: localize types, abilities, moves
    // get(`type/${ID}/`)
    // get(`ability/${ID}/`)
    // get(`moves/${ID}/`)
    // name = .names[#].name

    arg = obj.res_species.str;
    tmp = await get(`pokemon-species/${arg}/`);
    if (!tmp) throw new Error(`Unable to get pokemon species: ${arg}`);
    const API_species: PokemonSpecies = tmp;

    obj.name_pokemon = `${API_species.names.find(cbFindName)?.name || obj.res_pokemon.str}`;

    arg = API_species.evolution_chain.url.split("/").at(-2)!;
    tmp = await get(`evolution-chain/${arg}/`);
    if (!tmp) throw new Error(`Unable to get evolution chain: ${arg}`);
    const API_evolution_chain: EvolutionChain = tmp;

    obj.evolution_chain = cbFlattenChain([], API_evolution_chain.chain);

    // todo: maybe only show evolution chain if its not a variant?
    // todo: "n/a" fallback
    // todo: localize evolution chain

    const API_form = await (async (res_pokemon, res_species) => {
      if (res_pokemon.str === res_species.str) { return; }
      arg = res_pokemon.str;
      tmp = await get(`pokemon-form/${arg}/`);
      if (!tmp) throw new Error(`Unable to get pokemon form: ${arg}`);
      const API_form: PokemonForm = tmp;

      obj.name_pokemon = `${API_form.names.find(cbFindName)?.name || res_pokemon.str}`;

      return API_form;
    })(obj.res_pokemon, obj.res_species);

    // * OLD ONE
    // if (obj.res_pokemon.str !== obj.res_species.str) {
    //   arg = obj.res_pokemon.str;
    //   tmp = await get(`pokemon-form/${arg}/`);
    //   if (!tmp) throw new Error(`Unable to get pokemon form: ${arg}`);
    //   const API_form: PokemonForm = tmp;

    //   obj.name_pokemon = `${API_form.names.find(cbFindName)?.name || obj.res_pokemon.str}`;
    // }

    arg = obj.res_pokemon.str;
    tmp = await get(`pokemon/${arg}/encounters`);
    if (!tmp) throw new Error(`Unable to get pokemon encounters: ${arg}`);
    const API_encounters: LocationAreaEncounter[] = tmp;

    obj.locations = API_encounters.map(({ location_area }) => (cbToResource(location_area)));

    // todo: "n/a" fallback
    // todo: localize encounters

    // console.log(API_pokemon);
    // console.log(API_species);
    // console.log(API_evolution_chain);
    // console.log(API_form);
    // console.log(API_encounters);
    // console.log(obj);

    return obj;
  }
  catch (err)
  {
    console.error(err);

    return null;
  }
}

export async function getPokemonLite(arg: string): Promise<PokeData | null> {
  try
  {
    const obj: PokeData = {};
    let tmp: any;

    // * normalize user arg
    arg = arg.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
    tmp = await get(`pokemon/${arg}/`);
    if (!tmp) throw new Error(`Unable to get pokemon: ${arg}`);
    const API_pokemon: Pokemon = tmp;

    obj.res_pokemon = {
      url: `${API_URL}/pokemon/${API_pokemon.id}/`,
      num: API_pokemon.id,
      str: API_pokemon.name
    };
    obj.res_species = cbToResource(API_pokemon.species);

    obj.sprites = [
      API_pokemon.sprites.other["official-artwork"].front_default,
      API_pokemon.sprites.other["official-artwork"].front_shiny,
    ];

    arg = obj.res_species.str;
    tmp = await get(`pokemon-species/${arg}/`);
    if (!tmp) throw new Error(`Unable to get pokemon species: ${arg}`);
    const API_species: PokemonSpecies = tmp;

    obj.name_pokemon = `${API_species.names.find(cbFindName)?.name || obj.res_pokemon.str}`;

    const API_form = await (async (res_pokemon, res_species) => {
      if (res_pokemon.str === res_species.str) { return; }
      arg = res_pokemon.str;
      tmp = await get(`pokemon-form/${arg}/`);
      if (!tmp) throw new Error(`Unable to get pokemon form: ${arg}`);
      const API_form: PokemonForm = tmp;

      obj.name_pokemon = `${API_form.names.find(cbFindName)?.name || res_pokemon.str}`;

      return API_form;
    })(obj.res_pokemon, obj.res_species);

    // console.log(API_pokemon);
    // console.log(API_species);
    // console.log(API_form);
    // console.log(obj);

    return obj;
  }
  catch (err)
  {
    console.error(err);

    return null;
  }
}
