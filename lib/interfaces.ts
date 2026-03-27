
export interface Resource {
  url: string,
  num: number,
  str: string,
}

export interface PokeData {
  res_pokemon?: Resource,
  res_species?: Resource,
  name_pokemon?:  string,
  sprites?: (string | null)[],
  types?:           Resource[],
  moves?:           Resource[],
  abilities?:       Resource[],
  evolution_chain?: Resource[],
  locations?:       Resource[],
}

export interface Favorite extends Resource {
  name: string,
}

// UTILITY - LANGUAGES =============================================================================

export interface Language {
  id: number,
  name: string,
  official: boolean,
  iso639: string,
  iso3166: string,
  names: Name[],
}

// UTILITY - COMMON MODELS =========================================================================

export interface APIResource {
  url: string,
}

export interface Description { }
export interface Effect { }
export interface Encounter { }
export interface FlavorText { }
export interface GenerationGameIndex { }
export interface MachineVersionDetail { }

export interface Name {
  name: string,
  language: Language,
}

export interface NamedAPIResource {
  name: string,
  url: string,
}

export interface VerboseEffect { }
export interface VersionEncounterDetail { }
export interface VersionGameIndex { }
export interface VersionGroupFlavorText { }

// EVOLUTION =======================================================================================

export interface EvolutionChain {
  id:                 number,
  baby_trigger_item:  NamedAPIResource, // * Item
  chain:              ChainLink,
}

export interface ChainLink {
  is_baby:    boolean,
  species:    NamedAPIResource, // * PokemonSpecies
  // evolution_details: EvolutionDetail[],
  evolves_to: ChainLink[],
}

// POKEMON =========================================================================================

export interface Pokemon {
  id:   number,
  name: string,
  // base_experience: number,
  // height:          number,
  // is_default:      boolean,
  // order:           number,
  // weight:          number,
  abilities:  PokemonAbility[],
  forms:      NamedAPIResource[], // * PokemonForm
  // game_indices:    VersionGameIndex[],
  // held_items:      PokemonHeldItem[],
  location_area_encounters: string,
  moves:      PokemonMove[],
  // past_types:      PokemonTypePast[],
  // past_abilities:  PokemonAbilityPast[],
  // past_stats:      PokemonStatPast[],
  sprites:    PokemonSprites,
  // cries:           PokemonCries,
  species:    NamedAPIResource,   // * PokemonSpecies
  // stats:           PokemonStat[],
  types:      PokemonType[],
}

export interface PokemonAbility {
  is_hidden:  boolean,
  slot:       number,
  ability:    NamedAPIResource, // * Ability
}

export interface Ability {
  id:     number,
  name:   string,
  names:  Name[],
  // is_main_series:  boolean,
  // generation:      NamedAPIResource, // * Generation
  // effect_entries:      VerboseEffect[],
  // effect_changes:      AbilityEffectChange[],
  // flavor_text_entries: AbilityFlavorText[],
  // pokemon:             AbilityPokemon[],
}

export interface PokemonForm {
  id:     number,
  name:   string,
  names:  Name[],
  order:  number,
  form_name:  string,
  form_names: Name[],
  form_order: number,
  is_default:     boolean,
  is_battle_only: boolean,
  is_mega:        boolean,
  pokemon:  NamedAPIResource, // * Pokemon
  // types:    PokemonFormType[],
  sprites:  PokemonFormSprites,
  // version_group: NamedAPIResource,  // * VersionGroup
}

export interface PokemonFormSprites {
  front_default:  string | null,
  front_shiny:    string | null,
  back_default:   string | null,
  back_shiny:     string | null,
}

export interface PokemonMove {
  move: NamedAPIResource, // * Move
  // version_group_details: PokemonMoveVersion[],
}

export interface Move {
  id:     number,
  name:   string,
  names:  Name[],
  // accuracy:      number,
  // effect_chance: number,
  // pp:            number,
  // priority:      number,
  // power:         number,
  // contest_combos: ContestComboSets,
  // contest_type:        NamedAPIResource,   // * ContestType
  // contest_effect:      APIResource,        // * ContestEffect
  // damage_class:        NamedAPIResource,   // * MoveDamageClass
  // effect_entries: VerboseEffect[],
  // effect_changes: AbilityEffectChange[],
  // learned_by_pokemon:  NamedAPIResource[], // * Pokemon
  // flavor_text_entries: MoveFlavorText[],
  // generation:          NamedAPIResource,   // * Generation
  // machines: MachineVersionDetail[],
  // meta: MoveMetaData,
  // past_values: PastMoveStatValues[],
  // stat_changes: MoveStatChange[],
  super_contest_effect: APIResource,  // * SuperContestEffect
  target:          NamedAPIResource,  // * MoveTarget
  type:            NamedAPIResource,  // * Type
}

export interface PokemonSprites {
  front_default:      string | null,
  front_shiny:        string | null,
  front_female:       string | null,
  front_shiny_female: string | null,
  back_default:       string | null,
  back_shiny:         string | null,
  back_female:        string | null,
  back_shiny_female:  string | null,
  other: {
    dream_world: {
      front_default:      string | null,
      front_female:       string | null,
    },
    home: {
      front_default:      string | null,
      front_shiny:        string | null,
      front_female:       string | null,
      front_shiny_female: string | null,
    },
    "official-artwork": {
      front_default:      string | null,
      front_shiny:        string | null,
    },
    showdown: {
      front_default:      string | null,
      front_shiny:        string | null,
      front_female:       string | null,
      front_shiny_female: string | null,
      back_default:       string | null,
      back_shiny:         string | null,
      back_female:        string | null,
      back_shiny_female:  string | null,
    }
  },
  versions: {
    "generation-i":     object,
    "generation-ii":    object,
    "generation-iii":   object,
    "generation-iv":    object,
    "generation-v":     object,
    "generation-vi":    object,
    "generation-vii":   object,
    "generation-viii":  object,
    "generation-ix":    object,
    // "generation-x":  object,
  },
}

export interface PokemonSpecies {
  id:     number,
  name:   string,
  names:  Name[],
  order:  number,
  gender_rate:    number,
  capture_rate:   number,
  base_happiness: number,
  is_baby:      boolean,
  is_legendary: boolean,
  is_mythical:  boolean,
  hatch_counter: number,
  has_gender_differences: boolean,
  forms_switchable: boolean,
  growth_rate: NamedAPIResource, // * GrowthRate
  // pokedex_numbers: PokemonSpeciesDexEntry[],
  egg_groups: NamedAPIResource[], // * EggGroup
  color: NamedAPIResource, // * PokemonColor
  shape: NamedAPIResource, // * PokemonShape
  evolves_from_species: NamedAPIResource, // * PokemonSpecies
  evolution_chain: APIResource, // * EvolutionChain
  habitat: NamedAPIResource, // * PokemonHabitat
  generation: NamedAPIResource, // * Generation
  // pal_park_encounters: PalParkEncounterArea[],
  flavor_text_entries: FlavorText[],
  form_descriptions: Description[],
  // genera: Genus[],
  // varieties: PokemonSpeciesVariety[],
}

export interface PokemonType {
  slot: number,
  type: NamedAPIResource, // * Type
}

export interface Type {
  id:     number,
  name:   string,
  // damage_relations: TypeRelations,
  // past_damage_relations: TypeRelationsPast[],
  // game_indices: GenerationGameIndex[],
  // generation:        NamedAPIResource, // * Generation
  // move_damage_class: NamedAPIResource, // * MoveDamageClass
  names:  Name[],
  // pokemon: TypePokemon[],
  moves:  NamedAPIResource[], // * Move
}

export interface LocationAreaEncounter {
  location_area:  NamedAPIResource, // * LocationArea
  // version_details: VersionEncounterDetail[],
}

export interface LocationArea {
  id:     number,
  name:   string,
  names:  Name[],
  game_index: number,
  location:   NamedAPIResource, // * Location
  // encounter_method_rates: EncounterMethodRate[],
  // pokemon_encounters: PokemonEncounter[],
}

export interface Location {
  id:     number,
  name:   string,
  names:  Name[],
  region: NamedAPIResource,   // * Region
  areas:  NamedAPIResource[], // * LocationArea
  game_indices: GenerationGameIndex[],
}
