export type Book = {
  id: string;
  title: string;
  author: string;
  publishedYear: number;
  categories: string[]; // 如 ["Novel", "CS", "History"]
  price: number; // USD
  summary?: string;
  stock: number; // 库存
};
// 定义面包屑项类型接口
export interface BreadcrumbItem {
  label: string;
  path: string;
  isCurrent: boolean;
}