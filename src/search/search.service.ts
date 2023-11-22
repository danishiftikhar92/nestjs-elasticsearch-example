import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';

type dataResponse = {
  budget: number;
  genres: string[];
  homepage: string;
  id: number;
  keywords: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  production_companies: string[];
  production_countries: string[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: string[];
  status: string;
  tagline: string;
  title: string;
  vote_average: number;
  vote_count: number;
};

@Injectable()
export class SearchService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {}

  async createIndex() {
    const isIndexExist = await this.esService.indices.exists({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
    });

    if (!isIndexExist) {
      this.esService.indices.create({
        index: this.configService.get('ELASTICSEARCH_INDEX'),
        body: {
          mappings: {
            properties: {
              '@timestamp': {
                type: 'date',
              },
              budget: {
                type: 'long',
              },
              genres: {
                type: 'text',
              },
              homepage: {
                type: 'keyword',
              },
              id: {
                type: 'long',
              },
              keywords: {
                type: 'text',
              },
              original_language: {
                type: 'keyword',
              },
              original_title: {
                type: 'text',
              },
              overview: {
                type: 'text',
              },
              popularity: {
                type: 'double',
              },
              production_companies: {
                type: 'text',
              },
              production_countries: {
                type: 'text',
              },
              release_date: {
                type: 'date',
                format: 'iso8601',
              },
              revenue: {
                type: 'long',
              },
              runtime: {
                type: 'long',
              },
              spoken_languages: {
                type: 'text',
              },
              status: {
                type: 'keyword',
              },
              tagline: {
                type: 'text',
              },
              title: {
                type: 'text',
              },
              vote_average: {
                type: 'double',
              },
              vote_count: {
                type: 'long',
              },
            },
          },
        },
      });
    }
  }

  async search(search: { keyword: string; id?: number }) {
    const results = new Set();
    const response = await this.esService.search({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
      body: {
        size: 50,
        query: {
          bool: {
            must: [
              {
                term: {
                  id: {
                    value: search.id, // in case of search by id
                  },
                },
              },
            ],
            should: [
              {
                multi_match: {
                  query: search.keyword,
                  fields: [
                    'title',
                    'original_title',
                    'overview',
                    'tagline',
                    'genres',
                    'keywords',
                    'production_companies',
                    'production_countries',
                    'spoken_languages',
                  ],
                },
              },
            ],
          },
        },
      },
    });
    const hits = response.hits.hits;
    hits.map((item) => {
      results.add(item._source as dataResponse);
    });

    return { results: Array.from(results), total: response.hits.total };
  }
}
