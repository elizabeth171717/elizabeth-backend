
  module.exports = {
  restaurantName: "Sample Restaurant",
  sections: [
    {
      id: "1",
      section: "Appetizers",
      groups: [], // 👈 No groups in this section
      items: [
        {
          id: "ap1",
          name: "Spring Rolls",
          description: "Crispy rolls stuffed with vegetables.",
          price: 5.99,
          image: "https://res.cloudinary.com/dadjbgtb5/image/upload/w_500,f_auto,q_auto/v1775484370/springrolls_gbmcgi.jpg",
          available: true,
          visible: true,
          remaining: 0,
          modifiers: [
            { id: "m1", name: "Extra Sauce", price: 0.5 },
            
          ],
 customProperties: [],
 tags: ["vegetarian"],
        },
        {
          id: "ap2",
          name: "Garlic Bread",
          description: "Toasted bread with garlic and herbs.",
          price: 4.49,
          image: "https://res.cloudinary.com/dadjbgtb5/image/upload/w_500,f_auto,q_auto/v1775484369/garlicbread_gjcbbq.jpg",
          available: false,
          visible: true,
          remaining: 2,
          modifiers: [],
         
 customProperties: [], // ✅ this is the dynamic part
 tags: ["vegetarian", "mild"],
  
        },
        {
          id: "ap3",
          name: "Bruschetta",
          description: "Grilled bread with tomato and basil.",
          price: 6.25,
          image: "https://res.cloudinary.com/dadjbgtb5/image/upload/w_500,f_auto,q_auto/v1775484369/bruschetta_ubejjs.jpg",
          available: true,
          visible: false,
          remaining: 0,
          modifiers: [
              { id: "m2", name: "Add Balsamic", price: 1 },
            { id: "m3", name: "Add Parmesan", price: 1.5 },
          ],
          
  customProperties: [],
  tags: ["vegetarian"],
        },
      ],
    },
    {
      id: "2",
      section: "Mains",
      groups: [], // 👈 optional empty if not grouping yet
      items: [
        {
          id: "mn1",
          name: "Grilled Chicken",
          description: "Juicy grilled chicken with herbs.",
          price: 12.99,
          image: "https://res.cloudinary.com/dadjbgtb5/image/upload/w_500,f_auto,q_auto/v1775484369/grillchickenbreast_iqocei.jpg",
          available: true,
          visible: true,
          remaining: null,
          modifiers: [
            { id: "m4", name: "Add Rice", price: 2 },
            { id: "m5", name: "Extra Veggies", price: 5 },
             { id: "m6", name: "Add Beans", price: 2 },
          ],
          
  customProperties: [],
  tags: [],
        },
        {
          id: "mn2",
          name: "Veggie Pasta",
          description: "Pasta tossed with fresh vegetables.",
          price: 10.49,
          image: "https://res.cloudinary.com/dadjbgtb5/image/upload/w_500,f_auto,q_auto/v1775484368/veggiepasta_pwemcz.jpg",
          available: true,
          visible: true,
          remaining: null,
          modifiers: [
            { id: "m7", name: "Make itGluten-Free Pasta", price: 3 },
          ],
          
customProperties: [],
tags: ["vegetarian"],
        },
        {
          id: "mn3",
          name: "Cheeseburger",
          description: "Beef patty with melted cheese and fries.",
          price: 11.99,
          image: "https://res.cloudinary.com/dadjbgtb5/image/upload/w_500,f_auto,q_auto/v1775484368/cheeseburguer_h1zbpf.jpg",
          available: true,
          visible: true,
           remaining: 5, // ✅ ONLY 5 LEFT
          modifiers: [
            { id: "m8", name: "Add Bacon", price: 2 },
            { id: "m9", name: "Extra Cheese", price: 1 },
            { id: "m10", name: "No Onions", price: 0 },
          ],
          
  customProperties: [],
  tags: [],
        },
      ],
    },
    {
      id: "3",
      section: "Desserts",
      groups: [], // 👈 still allowed
      items: [
        {
          id: "ds1",
          name: "Chocolate Cake",
          description: "Rich and moist chocolate cake.",
          price: 6.99,
          image: "https://res.cloudinary.com/dadjbgtb5/image/upload/w_500,f_auto,q_auto/v1775484367/chocolatecake_wgg6xo.jpg",
          available: true,
          visible: true,
          remaining: null,
          modifiers: [],
          
  customProperties: [],
  tags: ["vegan"],
        },
        {
          id: "ds2",
          name: "Cheesecake",
          description: "Creamy cheesecake with berry topping.",
          price: 7.49,
          image: "https://res.cloudinary.com/dadjbgtb5/image/upload/w_500,f_auto,q_auto/v1775484367/cheesecake_d0d2zc.jpg",
          available: true,
          visible: true,
          remaining: 2, // ✅ LOW STOCK
          modifiers: [
            { id: "m11", name: "Strawberry Topping", price: 1 },
            { id: "m12", name: "Chocolate Syrup", price: 1 },
          ],
          
 customProperties: [],
 tags: [],
        },
        {
          id: "ds3",
          name: "Ice Cream",
          description: "Two scoops of vanilla or chocolate.",
          price: 4.99,
          image: "https://res.cloudinary.com/dadjbgtb5/image/upload/w_500,f_auto,q_auto/v1775484367/icecream_tf1pha.jpg",
          available: true,
          visible: true,
          remaining: null,
          modifiers: [
            { id: "m13", name: "Add Sprinkles", price: 0.5 },
            { id: "m14", name: "Whipped Cream", price: 0.75 },
          ],
          
  customProperties: [],
  tags: [],
        },
      ],
    },
    {
      id: "4",
      section: "Drinks",
      groups: [
        {
          id: "g1",
          groupName: "Atole", // 👈 group within Drinks
          items: [
            {
              id: "drA1",
              name: "Atole de Elote",
              description: "Sweet corn-based traditional atole.",
              price: 0,
              image: "https://res.cloudinary.com/dadjbgtb5/image/upload/w_500,f_auto,q_auto/v1775484366/atoledeelote_odesd3.jpg",
              available: true,
              visible: true,
              remaining: null,
              modifiers: [
                { id: "m15", name: "Small", price: 4.49 },
                { id: "m16", name: "Medium", price: 6 },
            { id: "m17", name: "Large", price: 8 },
              ],
              
  customProperties: [],
  tags: [],
            },
            {
              id: "drA2",
              name: "Champurrado",
              description: "Thick Mexican chocolate atole.",
              price: 0,
              image: "https://res.cloudinary.com/dadjbgtb5/image/upload/w_500,f_auto,q_auto/v1775484366/champurrado_tn8vya.jpg",
              available: true,
              visible: true,
              remaining: null,
              modifiers: [
                { id: "m18", name: "Small", price: 4.49 },
                 { id: "m19", name: "Medium", price: 6 },
            { id: "m20", name: "Large", price: 8 },
              ],
              
 customProperties: [],
 tags: [],
            },
          ],
        },
        {
          id: "g2",
          groupName: "Aguas Frescas", // 👈 another optional group
          items: [
            {
              id: "drF1",
              name: "Horchata",
              description: "Rice and cinnamon drink.",
              price: 0,
              image: "https://res.cloudinary.com/dadjbgtb5/image/upload/w_500,f_auto,q_auto/v1775484365/orchata_m1blz7.jpg",
              available: true,
              visible: true,
              remaining: null,
              modifiers: [
                { id: "m21", name: "Small", price: 2.99 },
                { id: "m22", name: "Medium", price: 4 },
            { id: "m23", name: "Large", price: 6 },
              ],
              
  customProperties: [],
  tags: [],
            },
            {
              id: "drF2",
              name: "Jamaica",
              description: "Hibiscus flower tea served cold.",
              price: 0,
              image: "https://res.cloudinary.com/dadjbgtb5/image/upload/w_500,f_auto,q_auto/v1775484365/agua_de_jamaica_zrvbjb.jpg",
              available: true,
              visible: true,
              remaining: null,
              modifiers: [
                { id: "m24", name: "Small", price: 2.99 },
                   { id: "m25", name: "Medium", price: 4 },
            { id: "m26", name: "Large", price: 6 },
              ],
              
  customProperties: [],
  tags: [],
            },
          ],
        },
      ],
      items: [
        {
          id: "dr3",
          name: "Coffee",
          description: "Hot brewed coffee.",
          price: 2.99,
          image: "https://res.cloudinary.com/dadjbgtb5/image/upload/w_500,f_auto,q_auto/v1775484365/coffe_qt2bhy.jpg",
          available: true,
          visible: true,
          remaining: null,
          modifiers: [
            { id: "m27", name: "Add Milk", price: 0.5 },
            { id: "m28", name: "Extra Shot", price: 1 },
          ],
          
 customProperties : [  // ✅ this is the dynamic part
    { key: "Ground", value: "Decaf" },
    
  ],
  tags: [],
        },
      ],
    },
  ],
};
