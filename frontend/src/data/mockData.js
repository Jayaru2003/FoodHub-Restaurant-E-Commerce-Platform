/**
 * mockData.js – temporary mock dataset for the FoodHub homepage.
 *
 * Shape mirrors the expected real API responses:
 *   GET /api/products  → { content: Product[], ... }
 *   GET /api/categories → Category[]
 *
 * Replace these stubs by pointing the homepage hooks at
 * `productService.getProducts()` and `productService.getCategories()`
 * once the Spring Boot backend is running.
 */

export const MOCK_CATEGORIES = [
  { id: 'burgers',   name: 'Burgers',   emoji: '🍔', description: 'Juicy smash & gourmet burgers' },
  { id: 'pizza',     name: 'Pizza',     emoji: '🍕', description: 'Stone-fired Neapolitan & NY style' },
  { id: 'pasta',     name: 'Pasta',     emoji: '🍝', description: 'Handmade Italian classics' },
  { id: 'sushi',     name: 'Sushi',     emoji: '🍣', description: 'Fresh nigiri, maki & rolls' },
  { id: 'salads',    name: 'Salads',    emoji: '🥗', description: 'Light, vibrant & nourishing' },
  { id: 'desserts',  name: 'Desserts',  emoji: '🍰', description: 'Sweet endings to every meal' },
];

export const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Smash Burger Deluxe',
    description: 'Double smash patties, aged cheddar, house sauce, brioche bun, served with crispy fries.',
    price: 14.99,
    category: 'burgers',
    available: true,
    imageUrl: '/images/product_burger_deluxe.jpg',
  },
  {
    id: 'p2',
    name: 'Margherita Pizza',
    description: 'San Marzano tomatoes, fresh buffalo mozzarella, extra virgin olive oil, and fragrant basil.',
    price: 17.50,
    category: 'pizza',
    available: true,
    imageUrl: '/images/product_pizza_margherita.jpg',
  },
  {
    id: 'p3',
    name: 'Pasta Carbonara',
    description: 'Rigatoni, guanciale, egg yolk, aged pecorino, freshly cracked black pepper.',
    price: 15.00,
    category: 'pasta',
    available: true,
    imageUrl: '/images/product_pasta_carbonara.jpg',
  },
  {
    id: 'p4',
    name: 'Premium Sushi Platter',
    description: 'Assorted nigiri & maki: salmon, tuna, ebi, avocado, served with wasabi & pickled ginger.',
    price: 28.00,
    category: 'sushi',
    available: true,
    imageUrl: '/images/product_sushi_platter.jpg',
  },
  {
    id: 'p5',
    name: 'Classic Caesar Salad',
    description: 'Crisp romaine, house-made Caesar dressing, parmesan shavings, golden anchovy croutons.',
    price: 11.50,
    category: 'salads',
    available: true,
    imageUrl: '/images/product_caesar_salad.jpg',
  },
  {
    id: 'p6',
    name: 'Chocolate Lava Cake',
    description: 'Warm dark chocolate cake with a molten centre, served with Madagascar vanilla ice cream.',
    price: 9.00,
    category: 'desserts',
    available: true,
    imageUrl: '/images/product_chocolate_lava_cake.jpg',
  },
];
