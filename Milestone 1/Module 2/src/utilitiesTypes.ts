

type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    color?: string;
}


type ProductSummary = Pick<Product, "id" | "name" | "price">;

type ProductWithoutStock = Omit<Product, "stock" | "color">;

type ProductWithRequiredColor = Required<Product>;
const product2 : ProductWithRequiredColor = {
    id: 1,
    name: "Laptop",
    price: 999.99,
    stock: 10,
    color: "Silver"
}


type OptionalProduct = Partial<Product>;
const optionalProduct: OptionalProduct = {
    id: 2,
    name: "Phone"
}

type ReadonlyProduct = Readonly<Product>;
const readonlyProduct: ReadonlyProduct = {
    id: 3,
    name: "Tablet",
    price: 499.99,
    stock: 5,
    color: "Black"
}

const emptyObj : Record<string, unknown> = {};

const product1 = {
    id: 4,
    name: "Monitor",
    price: 199.99,
}