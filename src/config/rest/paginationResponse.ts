import {Pagination} from './pagination';
import {IPaginationMeta} from "nestjs-typeorm-paginate";

export class PaginationResponse<T> {
    pagination: IPaginationMeta;

    results: Array<T>;

    constructor(results: Array<T>, pagination: Pagination) {
        this.results = results;

        this.pagination = pagination;
    }
}
