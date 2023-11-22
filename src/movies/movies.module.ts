import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [MoviesModule, SearchModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
