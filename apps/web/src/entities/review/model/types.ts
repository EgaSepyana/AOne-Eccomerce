export interface Review {
  id: string;
  productId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  author: string;
  heightCm?: number;
  sizeBought: string;
  fit: "kekecilan" | "pas" | "kebesaran";
  photos?: string[];
  helpful: number;
  createdAt: string;
}
