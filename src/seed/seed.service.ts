import { PokemonType } from './interface/poke-response.interface';
import { FetchAdapter } from 'src/common/adapters/fetch.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: FetchAdapter
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokemonType>('https://pokeapi.co/api/v2/pokemon?limit=650')

    const pokemonToInsert: { name: string, no: number}[] = []
    
    data.results.forEach(async({ name, url }) => {
      const segmets = url.split('/');
      const no: number = Number(segmets[segmets.length - 2]);

      pokemonToInsert.push({ name, no });
    })

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed';
  }
}
