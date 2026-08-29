export const CATEGORIES = [
  {
    id: 'electronics', label: 'Electronics', icon: 'Smartphone',
    secondary: [
      { id: 'phones', label: 'Phones' },
      { id: 'laptops', label: 'Laptops' },
      { id: 'tablets', label: 'Tablets' },
      { id: 'tvs', label: 'TVs & Audio' },
      { id: 'cameras', label: 'Cameras' },
      { id: 'gaming', label: 'Gaming' },
      { id: 'networking', label: 'Networking' },
      { id: 'printers', label: 'Printers' },
    ],
  },
  {
    id: 'clothing', label: 'Clothing', icon: 'Shirt',
    secondary: [
      { id: 'mens', label: "Men's Wear" },
      { id: 'womens', label: "Women's Wear" },
      { id: 'kids', label: "Kids' Wear" },
      { id: 'sportswear', label: 'Sportswear' },
    ],
  },
  {
    id: 'footwear', label: 'Footwear', icon: 'Footprints',
    secondary: [
      { id: 'sneakers', label: 'Sneakers' },
      { id: 'formal-shoes', label: 'Formal Shoes' },
      { id: 'sandals', label: 'Sandals' },
      { id: 'boots', label: 'Boots' },
    ],
  },
  {
    id: 'home', label: 'Home & Living', icon: 'Home',
    secondary: [
      { id: 'furniture', label: 'Furniture' },
      { id: 'kitchen', label: 'Kitchen' },
      { id: 'bedding', label: 'Bedding' },
      { id: 'lighting', label: 'Lighting' },
    ],
  },
  {
    id: 'accessories', label: 'Accessories', icon: 'Watch',
    secondary: [
      { id: 'bags', label: 'Bags' },
      { id: 'watches', label: 'Watches' },
      { id: 'jewelry', label: 'Jewelry' },
      { id: 'sunglasses', label: 'Sunglasses' },
    ],
  },
];

export const getCategoryById = (id) => CATEGORIES.find((c) => c.id === id);
export const getSecondaryById = (primaryId, secondaryId) => {
  const primary = getCategoryById(primaryId);
  return primary?.secondary.find((s) => s.id === secondaryId);
};
