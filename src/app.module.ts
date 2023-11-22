import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [SearchModule, ConfigModule.forRoot(), MoviesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
