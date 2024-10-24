import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import { CreatePokemonDto } from './dto/create-pokemon.dto'
import { UpdatePokemonDto } from './dto/update-pokemon.dto'
import { Pokemon } from './entities/pokemon.entity'
import { isValidObjectId, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PokemonService {
  constructor
  (
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon
      
    } catch (error) {
      this.handleException(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto
    return await this.pokemonModel.find().skip(offset).limit(limit).sort({ no: 1 }).select('-__v')
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    // Encontrar por no
    if (!isNaN(+term)) pokemon = await this.pokemonModel.findOne({ no: term })

    // Mongo ID
    if (!pokemon && isValidObjectId(term)) pokemon = await this.pokemonModel.findById(term)

    // Name
    if (!pokemon) pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim()}) 

    if (!pokemon) throw new NotFoundException(`Pokemon with id ${term} not found`)

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term)

    try {
      await pokemon.updateOne(updatePokemonDto)
      return ({ ...pokemon.toJSON(), ...updatePokemonDto })
    } catch (error) {
      this.handleException(error)
    }

  }

  async remove(_id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id})
    if (deletedCount === 0) throw new BadRequestException(`Pokemon with id ${_id} not found`)

    return `Pokemon with id ${_id} deleted`
  }

  private handleException(error: any) {
    if (error.code === 11000) throw new BadRequestException(`Pokemon exist id db ${JSON.stringify(error.keyValue)}`)

    console.log(error)
    throw new InternalServerErrorException('Something went wrong')
  }
}
