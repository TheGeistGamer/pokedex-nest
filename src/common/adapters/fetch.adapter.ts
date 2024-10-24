import { HttpAdapter } from '../interfaces/http-adapter.interface'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FetchAdapter implements HttpAdapter {
  async get<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      throw new Error('This is a error, check logs')
    }
  }
}