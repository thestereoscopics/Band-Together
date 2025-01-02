import DiscogRecord from "@/app/models/DiscogRecord";

interface DiscogResponse {
  pagination: Pagination;
  releases: DiscogRecord[];
}

interface Pagination {
  page: number;
  pages: number;
  per_page: number;
  items: number;
  urls: string;
}
export default DiscogResponse;
