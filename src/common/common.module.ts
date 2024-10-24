import { FetchAdapter } from './adapters/fetch.adapter'
import { Module } from '@nestjs/common'

@Module({
  providers: [FetchAdapter],
  exports: [FetchAdapter],
})
export class CommonModule {}
