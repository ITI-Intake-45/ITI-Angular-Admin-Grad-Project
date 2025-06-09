import { Pageable } from './Pageable';
import { Sort } from './Sort';

export interface Page<T> {
  content: T[];           // The actual data array
  pageable: Pageable;     // Pagination info
  totalPages: number;     // Total number of pages
  totalElements: number;  // Total number of elements
  last: boolean;          // Is this the last page?
  first: boolean;         // Is this the first page?
  numberOfElements: number; // Number of elements in current page
  size: number;           // Page size
  number: number;         // Current page number (0-based)
  sort: Sort;             // Sorting information
  empty: boolean;         // Is the page empty?
}
