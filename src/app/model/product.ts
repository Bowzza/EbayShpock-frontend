export interface Product {
    _id: string;
    articleNumber: string;
    productName: string;
    description: string;
    price: number;
    link: string;
    img: string;
    inWishlist: boolean;
    notify: boolean,
    shop: string;
}