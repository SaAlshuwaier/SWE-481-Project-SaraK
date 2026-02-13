import { GenreDto } from './GenreDto'; // if you already have the Genre model
import { StarDto } from './StarDto';   // same for Star model

export interface MovieDto {
    id: string;        // Movie's ID (e.g., tt1234567)
    title: string;     // Movie's Title
    year: number;      // Movie's Release Year
    director: string;  // Movie's Director
    rating: number;    // Movie's Rating (double in backend -> number in TS)

    genres: GenreDto[]; // List of genres associated with the movie
    stars: StarDto[];   // List of stars associated with the movie
}