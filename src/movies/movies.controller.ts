import { Body, Controller, Post } from '@nestjs/common';
import { SearchService } from 'src/search/search.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly searchService: SearchService) {}

  @Post('search')
  async search(@Body() body) {
    return await this.searchService.search(body.data);
  }
}
