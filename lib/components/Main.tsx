"use client";

import IMG_SHUFFLE from "@/public/images/shuffle.png";
import IMG_SAVE from "@/public/images/save.png";
import IMG_SAVE_FILL from "@/public/images/save-fill.png";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { getPokemon, getPokemonLite, LS } from "@/lib/common";
import { Favorite, PokeData, Resource } from "@/lib/interfaces";

export default function Main() {
  const [ STR, setSTR ] = useState<string>();
  const [ CUR, setCUR ] = useState<PokeData>();
  const [ EVO, setEVO ] = useState<PokeData[]>();
  const [ FAV, setFAV ] = useState<Favorite[]>();

  const [ imageState, setImageState ] = useState(0);

  function cbSubmit(e: FormData) {
    const str = e.get("search")?.toString();
    console.log(`SEARCH: ${str}`);
    setSTR(str);
  }

  function cbSwitch(num: number, str: string) {
    if (num === CUR!.res_pokemon?.num) return;
    setSTR(str);
  }

  function cbRNG() {
    const rng = Math.floor(Math.random() * 1025) + 1;
    setSTR(`${rng}`);
  }

  function cbFAV() {
    if (!CUR) return;
    if (FAV!.some(({ num }) => num === CUR.res_pokemon?.num)) {
      setFAV(FAV!.filter(({ num }) => num !== CUR.res_pokemon?.num));
    } else {
      setFAV([...FAV!, { ...CUR.res_pokemon!, name: CUR.name_pokemon! }]);
    }
  }

  function strList(arr: Resource[]) {
    if (arr.length === 0) return "n/a";
    return arr.map(({ str }) => str).join(", ");
  }

  // * gets pokemon data
  useEffect(() => {
    setImageState(0); // * reset image state
    const str = STR ?? "pikachu";
    console.log(`EFFECT: STR - getting ${str}`);
    (async () => {
      const cur = await getPokemon(str);

      if (!cur) {
        alert("fetch error");
        return;
      }

      const evo = await Promise.all(cur.evolution_chain!.map(async ({ str }) => await getPokemonLite(str)));

      setCUR(cur);
      setEVO(evo.filter(v => v !== null));
    })();
  }, [STR]);

  // * runs TWICE upon page load/reload
  useEffect(() => {
    console.log(`EFFECT: FAV - ${!FAV ? "getting" : "setting" } arr_fav_pokemon`);
    if (!FAV) {
      // console.log("getting arr_fav_pokemon");
      setFAV(LS.get("arr_fav_pokemon") ?? []);
    } else {
      // console.log("setting arr_fav_pokemon");
      LS.set("arr_fav_pokemon", FAV);
    }
  }, [FAV]);

  return (
    <>
      <div className="p-4">
        {(CUR && EVO && FAV) ? (
          <div className="grid gap-4">

            {/* HEADER */}

            <div className="flex flex-row gap-4 items-center">
              <button className="hover:cursor-pointer" type="button" onClick={cbRNG}>
                <Image className="size-6 md:size-8" src={IMG_SHUFFLE} alt={"Shuffle"} />
              </button>
              <button className="hover:cursor-pointer" type="button" onClick={cbFAV}>
                <Image className="size-6 md:size-8" src={FAV.some(({ num }) => num === CUR.res_pokemon?.num) ? IMG_SAVE_FILL : IMG_SAVE} alt={"Favorite"} />
              </button>
              <form action={cbSubmit} className="w-full">
                <input type="text" name="search" placeholder="Search" className="border-2 border-solid border-gray-300 rounded-xl p-2 w-full" />
              </form>
            </div>

            {/* CONTENT */}

            <div className="flex flex-col gap-4">

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-2">
                <p className="text-xl font-bold pb-1">Favorites</p>
                <div className="flex flex-row gap-2 *:border-2 *:border-solid *:border-gray-200 *:rounded-lg *:p-1 *:hover:cursor-pointer *:hover:bg-blue-50">
                  {FAV.map((val, idx) => (
                    <Fragment key={idx}>
                      <p onClick={() => { cbSwitch(val.num, val.name); }}>{val.name}</p>
                    </Fragment>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                <div className="lg:row-span-2 border-2 border-dashed border-gray-300 rounded-xl p-2 flex flex-col items-center">
                  <div className="text-4xl font-bold">
                    <div>{`#${CUR.res_pokemon?.num.toString().padStart(4, "0")} - ${CUR.name_pokemon}`}</div>
                  </div>
                  <div className="hover:cursor-pointer" title="Click to toggle image between default and shiny form.">
                    <Image
                      width={384}
                      height={384}
                      className="size-96"
                      src={CUR.sprites![imageState]!}
                      alt={`${imageState ? "Shiny" : "Default"} ${CUR.name_pokemon}`}
                      onClick={() => { setImageState(imageState ? 0 : 1); }}
                    />
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-2">
                  <p className="text-xl font-bold pb-1">Types</p>
                  <div>{strList(CUR.types!)}</div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-2">
                  <p className="text-xl font-bold pb-1">Abilities</p>
                  <div>{strList(CUR.abilities!)}</div>
                </div>

              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-2">
                <p className="text-xl font-bold pb-1">Moves</p>
                <div>{strList(CUR.moves!)}</div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-2">
                <p className="text-xl font-bold pb-1">Locations</p>
                <div>{strList(CUR.locations!)}</div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-2">
                <p className="text-xl font-bold pb-1">Evolutions</p>
                <div className="flex flex-row gap-2 text-center *:rounded-2xl *:p-2 *:hover:cursor-pointer *:hover:bg-blue-50">
                  {CUR.evolution_chain!.length < 2 ? (
                    <>
                      <p>n/a</p>
                    </>
                  ) : (
                    <>
                      {EVO.map((val, idx) => (
                        <Fragment key={idx}>
                          <div onClick={() => { cbSwitch(val.res_pokemon!.num!, val.res_pokemon!.str!); }}>
                            <Image
                              width={256}
                              height={256}
                              className="max-h-64"
                              src={val.sprites![0]!}
                              alt={`Default ${val.name_pokemon}`}
                            />
                            <p>#{val.res_pokemon!.num.toString().padStart(4, "0")}</p>
                            <p>{val.res_pokemon!.str}</p>
                          </div>
                        </Fragment>
                      ))}
                    </>
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}
