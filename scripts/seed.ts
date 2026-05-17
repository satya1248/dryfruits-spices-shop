import mongoose from "mongoose";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env.local");
  process.exit(1);
}

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
});

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  unit: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  imageUrl: String,
  inStock: Boolean,
  featured: Boolean,
  tags: [String],
});

const Category = mongoose.models.Category ?? mongoose.model("Category", categorySchema);
const Product = mongoose.models.Product ?? mongoose.model("Product", productSchema);

const categories = [
  {
    name: "Dry Fruits",
    slug: "dry-fruits",
    description: "Premium nuts, raisins, and dried fruits sourced for freshness.",
  },
  {
    name: "Spices",
    slug: "spices",
    description: "Aromatic whole and ground spices for everyday cooking.",
  },
];

const products = [
  {
    name: "California Almonds",
    slug: "california-almonds",
    description: "Crunchy, naturally sweet almonds perfect for snacking or baking.",
    price: 12.99,
    unit: "250g",
    categorySlug: "dry-fruits",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    inStock: true,
    featured: true,
    tags: ["almonds", "nuts"],
  },
  {
    name: "Cashew Kernels",
    slug: "cashew-kernels",
    description: "Creamy whole cashews with a buttery texture and mild sweetness.",
    price: 14.5,
    unit: "250g",
    categorySlug: "dry-fruits",
    imageUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80",
    inStock: true,
    featured: true,
    tags: ["cashews", "nuts"],
  },
  {
    name: "Golden Raisins",
    slug: "golden-raisins",
    description: "Plump, sun-dried golden raisins ideal for desserts and trail mix.",
    price: 6.99,
    unit: "500g",
    categorySlug: "dry-fruits",
    imageUrl: "https://images.unsplash.com/photo-1599599810769-8c5e0e6b8b1e?w=600&q=80",
    inStock: true,
    featured: false,
    tags: ["raisins", "dried fruit"],
  },
  {
    name: "Medjool Dates",
    slug: "medjool-dates",
    description: "Large, caramel-like dates with a soft texture and rich flavor.",
    price: 11.25,
    unit: "500g",
    categorySlug: "dry-fruits",
    imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&q=80",
    inStock: true,
    featured: true,
    tags: ["dates", "dried fruit"],
  },
  {
    name: "Walnut Halves",
    slug: "walnut-halves",
    description: "Fresh walnut halves with earthy notes, great for salads and granola.",
    price: 10.75,
    unit: "250g",
    categorySlug: "dry-fruits",
    imageUrl: "https://images.unsplash.com/photo-1599599810769-8c5e0e6b8b1e?w=600&q=80",
    inStock: true,
    featured: false,
    tags: ["walnuts", "nuts"],
  },
  {
    name: "Dried Apricots",
    slug: "dried-apricots",
    description: "Tangy-sweet Turkish apricots without added sugar.",
    price: 8.49,
    unit: "250g",
    categorySlug: "dry-fruits",
    imageUrl: "https://images.unsplash.com/photo-1615485925516-63b7a5d9b6e0?w=600&q=80",
    inStock: true,
    featured: false,
    tags: ["apricots", "dried fruit"],
  },
  {
    name: "Pistachios Roasted",
    slug: "pistachios-roasted",
    description: "Lightly salted roasted pistachios in the shell.",
    price: 15.99,
    unit: "250g",
    categorySlug: "dry-fruits",
    imageUrl: "https://images.unsplash.com/photo-1599599810769-8c5e0e6b8b1e?w=600&q=80",
    inStock: true,
    featured: true,
    tags: ["pistachios", "nuts"],
  },
  {
    name: "Turmeric Powder",
    slug: "turmeric-powder",
    description: "Vibrant ground turmeric with warm, earthy aroma for curries and golden milk.",
    price: 4.99,
    unit: "100g",
    categorySlug: "spices",
    imageUrl: "https://images.unsplash.com/photo-1615485500051-4d4e4d4e4b4e?w=600&q=80",
    inStock: true,
    featured: true,
    tags: ["turmeric", "powder"],
  },
  {
    name: "Cumin Seeds",
    slug: "cumin-seeds",
    description: "Aromatic whole cumin seeds essential for tempering and spice blends.",
    price: 3.49,
    unit: "100g",
    categorySlug: "spices",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    inStock: true,
    featured: false,
    tags: ["cumin", "whole spice"],
  },
  {
    name: "Coriander Powder",
    slug: "coriander-powder",
    description: "Mild, citrusy ground coriander for everyday Indian cooking.",
    price: 3.25,
    unit: "100g",
    categorySlug: "spices",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    inStock: true,
    featured: false,
    tags: ["coriander", "powder"],
  },
  {
    name: "Garam Masala",
    slug: "garam-masala",
    description: "Classic warming blend of cardamom, cinnamon, cloves, and more.",
    price: 5.49,
    unit: "100g",
    categorySlug: "spices",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    inStock: true,
    featured: true,
    tags: ["blend", "masala"],
  },
  {
    name: "Black Peppercorns",
    slug: "black-peppercorns",
    description: "Bold whole peppercorns with sharp heat; grind fresh for best flavor.",
    price: 4.75,
    unit: "100g",
    categorySlug: "spices",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    inStock: true,
    featured: false,
    tags: ["pepper", "whole spice"],
  },
  {
    name: "Cardamom Pods",
    slug: "cardamom-pods",
    description: "Fragrant green cardamom pods for chai, desserts, and biryanis.",
    price: 9.99,
    unit: "50g",
    categorySlug: "spices",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    inStock: true,
    featured: true,
    tags: ["cardamom", "whole spice"],
  },
  {
    name: "Red Chili Powder",
    slug: "red-chili-powder",
    description: "Medium-heat Kashmiri chili powder for color and gentle spice.",
    price: 3.99,
    unit: "100g",
    categorySlug: "spices",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    inStock: true,
    featured: false,
    tags: ["chili", "powder"],
  },
  {
    name: "Cinnamon Sticks",
    slug: "cinnamon-sticks",
    description: "Sweet Ceylon cinnamon quills for beverages, baking, and slow cooking.",
    price: 5.25,
    unit: "50g",
    categorySlug: "spices",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    inStock: false,
    featured: false,
    tags: ["cinnamon", "whole spice"],
  },
  {
    name: "Fennel Seeds",
    slug: "fennel-seeds",
    description: "Licorice-like seeds used in tempering, teas, and digestive blends.",
    price: 3.75,
    unit: "100g",
    categorySlug: "spices",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    inStock: true,
    featured: false,
    tags: ["fennel", "whole spice"],
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB");

  await Product.deleteMany({});
  await Category.deleteMany({});
  console.log("Cleared existing data");

  const createdCategories = await Category.insertMany(categories);
  const categoryMap = Object.fromEntries(
    createdCategories.map((c) => [c.slug, c._id]),
  );

  const productDocs = products.map((p) => ({
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    unit: p.unit,
    category: categoryMap[p.categorySlug],
    imageUrl: p.imageUrl,
    inStock: p.inStock,
    featured: p.featured,
    tags: p.tags,
  }));

  await Product.insertMany(productDocs);
  console.log(`Seeded ${createdCategories.length} categories and ${productDocs.length} products`);

  await mongoose.disconnect();
  console.log("Done");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
