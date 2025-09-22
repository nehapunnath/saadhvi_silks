import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    price: [],
    occasion: [],
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const products = [
    // Bridal (5 products)
    {
      id: 15,
      name: "Velvet Bridal Saree",
      price: 17999,
      originalPrice: 22999,
      image: "https://aghanoorbridal.com/cdn/shop/files/WhatsAppImage2023-11-25at07.22.14_1_1366x.jpg?v=1755262935",
      category: "Bridal",
      occasion: ["Wedding", "Bridal"],
      description: "Luxurious velvet saree with heavy embroidery for bridal elegance",
      badge: "Premium",
    },
    {
      id: 23,
      name: "Zari Embroidered Bridal Saree",
      price: 16999,
      originalPrice: 21999,
      image: "https://anantfashion.in/cdn/shop/products/4-1-1.jpg?v=1709820034&width=1445",
      category: "Bridal",
      occasion: ["Wedding", "Bridal"],
      description: "Opulent silk saree with heavy zari embroidery",
      badge: "Bestseller",
    },
    {
      id: 25,
      name: "Embroidered Silk Bridal Saree",
      price: 14999,
      originalPrice: 18999,
      image: "https://www.singhanias.in/cdn/shop/products/391115_1.jpg?v=1756455637",
      category: "Bridal",
      occasion: ["Wedding", "Bridal"],
      description: "Silk saree with intricate thread and sequin embroidery",
    },
    {
      id: 27,
      name: "Net Bridal Saree with Sequins",
      price: 12999,
      originalPrice: 16999,
      image: "https://media.samyakk.in/pub/media/catalog/product/w/h/white-net-designer-saree-with-sequins-work-and-readymade-blouse-gh3732-c.jpg",
      category: "Bridal",
      occasion: ["Wedding", "Bridal"],
      description: "Elegant net saree with sparkling sequin work",
      badge: "New",
    },
    {
      id: 44,
      name: "Heavy Embroidered Bridal Saree",
      price: 18999,
      originalPrice: 23999,
      image: "https://anayadesignerstudio.com/cdn/shop/files/purple_color_saree_for_wedding.webp?v=1741086277",
      category: "Bridal",
      occasion: ["Wedding", "Bridal"],
      description: "Grand silk saree with intricate embroidery and zari work",
      badge: "Premium",
    },
    // Kanjivaram (5 products)
    {
      id: 1,
      name: "Kanjivaram Silk Saree",
      price: 12499,
      originalPrice: 15999,
      image: "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_580x.jpg?v=1571711124",
      category: "Kanjivaram",
      occasion: ["Wedding", "Festival"],
      description: "Authentic Kanjivaram silk with traditional motifs and pure zari work",
      badge: "Bestseller",
    },
    {
      id: 21,
      name: "Dharmavaram Silk Saree",
      price: 11999,
      originalPrice: 14999,
      image: "https://pionexfab.com/product-img/royal-blue-pure-silk-dharmavar-1725441514.jpg",
      category: "Kanjivaram",
      occasion: ["Wedding", "Formal"],
      description: "Rich Dharmavaram silk with intricate zari patterns",
      badge: "Trending",
    },
    {
      id: 24,
      name: "Kanchipuram Bridal Saree",
      price: 15999,
      originalPrice: 19999,
      image: "https://priyangaa.in/cdn/shop/files/127c.jpg?v=1717921093",
      category: "Kanjivaram",
      occasion: ["Wedding", "Bridal"],
      description: "Traditional Kanchipuram silk with ornate zari work",
      badge: "Trending",
    },
    {
      id: 35,
      name: "Kanjivaram Pure Silk Saree",
      price: 16999,
      originalPrice: 20999,
      image: "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_580x.jpg?v=1571711124",
      category: "Kanjivaram",
      occasion: ["Wedding", "Formal"],
      description: "Pure Kanjivaram silk with elaborate zari work",
      badge: "Premium",
    },
    {
      id: 45,
      name: "Kanjivaram Temple Border Saree",
      price: 13999,
      originalPrice: 17999,
      image: "https://shobitam.com/cdn/shop/files/ARN002_10_1800x1800.jpg?v=1737248263",
      category: "Kanjivaram",
      occasion: ["Wedding", "Festival"],
      description: "Kanjivaram silk with traditional temple border design",
      badge: "New",
    },
    // Silk (5 products)
    {
      id: 9,
      name: "Kalamkari Silk Saree",
      price: 7899,
      originalPrice: 9999,
      image: "https://i.pinimg.com/736x/1c/ae/e9/1caee9eb709f8cf6eb9e275bda408be1.jpg",
      category: "Silk",
      occasion: ["Festival", "Formal"],
      description: "Traditional Kalamkari art on pure silk",
      badge: "New",
    },
    {
      id: 14,
      name: "Mysore Silk Saree",
      price: 8499,
      originalPrice: 10999,
      image: "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0070_580x.jpg?v=1571711124",
      category: "Silk",
      occasion: ["Wedding", "Festival"],
      description: "Pure Mysore silk with rich zari borders",
      badge: "Bestseller",
    },
    {
      id: 17,
      name: "Bandhani Silk Saree",
      price: 8299,
      originalPrice: 10499,
      image: "https://www.aachho.co/cdn/shop/files/NRN_5340.jpg_2_1400x.jpg?v=1728303784",
      category: "Silk",
      occasion: ["Festival", "Party"],
      description: "Traditional Bandhani silk with tie-dye patterns",
      badge: "New",
    },
    {
      id: 19,
      name: "Pure Silk Saree with Zari",
      price: 13499,
      originalPrice: 16999,
      image: "https://panjavarnam.com/cdn/shop/files/pink-and-blue-kanchipuram-silk-saree-with-zari-checks-medium-border-handwoven-pure-silk-for-wedding-wear-pv-nyc-1023-silk-sari-panjavarnam-pv-nyc-1023-90035.jpg?v=1742458189",
      category: "Silk",
      occasion: ["Wedding", "Festival"],
      description: "Luxurious pure silk with intricate zari borders",
      badge: "Bestseller",
    },
    {
      id: 46,
      name: "Pure Silk Handwoven Saree",
      price: 11999,
      originalPrice: 14999,
      image: "https://okhai.org/cdn/shop/products/AGO0306_40368f34-8e31-45fd-a477-6cbfcf020053.jpg?v=1754301942",
      category: "Silk",
      occasion: ["Wedding", "Formal"],
      description: "Handwoven pure silk saree with elegant zari motifs",
      badge: "Premium",
    },
    // Soft Silk (5 products)
    {
      id: 10,
      name: "Chanderi Silk Saree",
      price: 6999,
      originalPrice: 8999,
      image: "https://thearyavart.com/cdn/shop/products/SRP-94_1080x.jpg?v=1601353401",
      category: "Soft Silk",
      occasion: ["Festival", "Formal"],
      description: "Lightweight Chanderi silk with delicate zari weaving",
      badge: "Popular",
    },
    {
      id: 47,
      name: "Soft Silk Banarasi Saree",
      price: 7999,
      originalPrice: 9999,
      image: "https://lajreedesigner.com/cdn/shop/files/KPR-190-Red_1_500x750_crop_center.jpg?v=1745495554",
      category: "Soft Silk",
      occasion: ["Festival", "Formal"],
      description: "Lightweight Banarasi soft silk with intricate patterns",
      badge: "New",
    },
    {
      id: 48,
      name: "Soft Silk Embroidered Saree",
      price: 7499,
      originalPrice: 9499,
      image: "https://www.fabfunda.com/product-img/blue-soft-rangoli-silk-embroid-1715430945.jpeg",
      category: "Soft Silk",
      occasion: ["Party", "Formal"],
      description: "Soft silk saree with delicate embroidery",
      badge: "Trending",
    },
    {
      id: 49,
      name: "Mysore Soft Silk Saree",
      price: 6899,
      originalPrice: 8999,
      image: "https://vootbuy.in/cdn/shop/files/Untitleddesign_5_f09c6ed9-9345-4f5d-bc75-32586c45ad73_1080x.png?v=1733030809",
      category: "Soft Silk",
      occasion: ["Festival", "Formal"],
      description: "Elegant Mysore soft silk with subtle zari work",
    },
    {
      id: 50,
      name: "Soft Silk Printed Saree",
      price: 6599,
      originalPrice: 8499,
      image: "https://image.suratwholesaleshop.com/data/2024y/August/51752/Multi%20Colour-Crepe%20Soft%20Silk-Casual%20Wear-Printed-Saree-HIGHLIGHT-4014.jpg",
      category: "Soft Silk",
      occasion: ["Casual", "Formal"],
      description: "Soft silk saree with vibrant printed patterns",
      badge: "New",
    },
    // Ikkat Silk (5 products)
    {
      id: 22,
      name: "Patola Silk Saree",
      price: 13999,
      originalPrice: 17999,
      image: "https://www.theweavesart.com/cdn/shop/files/PatanPatolaSingleIkatSilkSaree_800x.png?v=1685019509",
      category: "Ikkat Silk",
      occasion: ["Wedding", "Festival"],
      description: "Handwoven Patola silk with vibrant geometric designs",
      badge: "Premium",
    },
    {
      id: 37,
      name: "Ikkat Silk Saree",
      price: 12999,
      originalPrice: 15999,
      image: "https://pochampallysarees.com/cdn/shop/files/ikkat-silk-saree-cream-chocolet-pochampallysarees-com-23370.jpg?v=1756457015",
      category: "Ikkat Silk",
      occasion: ["Festival", "Formal"],
      description: "Handwoven Ikkat silk with unique geometric designs",
      badge: "New",
    },
    {
      id: 38,
      name: "Patan Patola Saree",
      price: 17999,
      originalPrice: 22999,
      image: "https://www.theweavesart.com/cdn/shop/files/PatanPatolaSingleIkatSilkSaree_800x.png?v=1685019509",
      category: "Ikkat Silk",
      occasion: ["Wedding", "Festival"],
      description: "Exquisite double Ikkat Patola silk saree",
      badge: "Premium",
    },
    {
      id: 51,
      name: "Ikkat Silk Designer Saree",
      price: 11999,
      originalPrice: 14999,
      image: "https://media.samyakk.in/pub/media/catalog/product/g/r/green-zari-woven-ikkat-silk-saree-with-unstitched-blouse-gi1130_1.jpg",
      category: "Ikkat Silk",
      occasion: ["Party", "Formal"],
      description: "Designer Ikkat silk saree with modern patterns",
      badge: "Trending",
    },
    {
      id: 52,
      name: "Ikkat Silk Handwoven Saree",
      price: 10999,
      originalPrice: 13999,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNesypbQJQQyj_zN32PH6GDC-8ybatilY4jQ&s",
      category: "Ikkat Silk",
      occasion: ["Festival", "Formal"],
      description: "Handwoven Ikkat silk saree with vibrant colors",
    },
    // Silk Dhoti (5 products)
    {
      id: 40,
      name: "Silk Dhoti",
      price: 8999,
      originalPrice: 10999,
      image: "https://www.alayacotton.in/cdn/shop/products/PureSilkDhoti-40KJariBorder.jpg?v=1655315083",
      category: "Silk Dhoti",
      occasion: ["Festival", "Formal"],
      description: "Traditional silk dhoti with elegant patterns",
      badge: "Premium",
    },
    {
      id: 53,
      name: "Pure Silk Dhoti with Zari",
      price: 9999,
      originalPrice: 12999,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeouYO2mc8SQKCYzUAcgo-7_ye_HWgP1ggbw&s",
      category: "Silk Dhoti",
      occasion: ["Wedding", "Festival"],
      description: "Pure silk dhoti with intricate zari border",
      badge: "Bestseller",
    },
    {
      id: 54,
      name: "Embroidered Silk Dhoti",
      price: 8499,
      originalPrice: 10999,
      image: "https://sanwara.com/cdn/shop/products/SY_EMB_DH_BU_113_1.jpg?v=1653548526",
      category: "Silk Dhoti",
      occasion: ["Festival", "Formal"],
      description: "Silk dhoti with delicate embroidery work",
      badge: "New",
    },
    {
      id: 55,
      name: "Handwoven Silk Dhoti",
      price: 7999,
      originalPrice: 9999,
      image: "https://yourstore.io/api/uploads/5d30013a5c83a702392c4c8b/products/1751704772664-665059.webp",
      category: "Silk Dhoti",
      occasion: ["Festival", "Formal"],
      description: "Handwoven silk dhoti with traditional motifs",
    },
    {
      id: 56,
      name: "Silk Dhoti with Gold Border",
      price: 9499,
      originalPrice: 11999,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0m1H88HKSPn253dTNX2bWOythLZ3FNMITLg&s",
      category: "Silk Dhoti",
      occasion: ["Wedding", "Formal"],
      description: "Silk dhoti with elegant gold border",
      badge: "Premium",
    },
    // Banaras (5 products)
    {
      id: 2,
      name: "Banarasi Silk Saree",
      price: 9999,
      originalPrice: 12499,
      image: "https://m.media-amazon.com/images/I/9176UCN4piL._UY350_.jpg",
      category: "Banaras",
      occasion: ["Wedding", "Bridal"],
      description: "Exquisite Banarasi silk with intricate brocade work",
      badge: "Popular",
    },
    {
      id: 26,
      name: "Heavy Banarasi Bridal Saree",
      price: 19999,
      originalPrice: 25999,
      image: "https://www.rajendra.co/cdn/shop/files/Pink-Purple-Pure-Georgette-Banarasi-Bandhani-Saree-2.jpg?v=1699272621",
      category: "Banaras",
      occasion: ["Wedding", "Bridal"],
      description: "Luxurious Banarasi silk with heavy zari and brocade",
      badge: "Premium",
    },
    {
      id: 36,
      name: "Banarasi Pure Silk Saree",
      price: 14999,
      originalPrice: 18999,
      image: "https://m.media-amazon.com/images/I/9176UCN4piL._UY350_.jpg",
      category: "Banaras",
      occasion: ["Wedding", "Festival"],
      description: "Rich Banarasi silk with traditional brocade patterns",
      badge: "Trending",
    },
    {
      id: 57,
      name: "Banarasi Handwoven Saree",
      price: 12999,
      originalPrice: 15999,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBDk8BudUs9w2E3NrhSj2XyiaLhZF4zhHgmA&s",
      category: "Banaras",
      occasion: ["Wedding", "Festival"],
      description: "Handwoven Banarasi silk with classic motifs",
      badge: "Bestseller",
    },
    {
      id: 58,
      name: "Banarasi Zari Saree",
      price: 13999,
      originalPrice: 17999,
      image: "https://www.singhanias.in/cdn/shop/files/488748_1.jpg?v=1756453618",
      category: "Banaras",
      occasion: ["Wedding", "Formal"],
      description: "Banarasi silk saree with intricate zari patterns",
      badge: "New",
    },
    // Tussar (5 products)
    {
      id: 4,
      name: "Tussar Silk Saree",
      price: 6299,
      originalPrice: 8499,
      image: "https://oldsilksareebuyers.com/wp-content/uploads/2021/04/Old-Wedding-pattu-saree-buyers-1.jpg",
      category: "Tussar",
      occasion: ["Festival", "Formal"],
      description: "Pure Tussar silk with natural texture and elegant drape",
    },
    {
      id: 59,
      name: "Tussar Handwoven Saree",
      price: 6999,
      originalPrice: 8999,
      image: "https://ethnicsland.com/cdn/shop/files/2ecc3f_1b549f36bdfa4441aff315dfe07e62cb_mv2.jpg?v=1747747818",
      category: "Tussar",
      occasion: ["Festival", "Formal"],
      description: "Handwoven Tussar silk with subtle patterns",
      badge: "New",
    },
    {
      id: 60,
      name: "Tussar Embroidered Saree",
      price: 7499,
      originalPrice: 9499,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUejOS2pgWumTNDJusVk0pcRL32DBgGSo8oQ&s",
      category: "Tussar",
      occasion: ["Party", "Formal"],
      description: "Tussar silk saree with delicate embroidery",
      badge: "Trending",
    },
    {
      id: 61,
      name: "Tussar Printed Saree",
      price: 5999,
      originalPrice: 7999,
      image: "https://medias.utsavfashion.com/media/catalog/product/cache/1/image/500x/040ec09b1e35df139433887a97daa66f/d/i/digital-printed-pure-tussar-silk-saree-in-black-v1-scra195.jpg",
      category: "Tussar",
      occasion: ["Casual", "Formal"],
      description: "Tussar silk saree with vibrant prints",
    },
    {
      id: 62,
      name: "Tussar Zari Border Saree",
      price: 6799,
      originalPrice: 8799,
      image: "https://mohifab.com/cdn/shop/files/il_fullxfull.6370828083_7j2v.jpg?v=1734075504",
      category: "Tussar",
      occasion: ["Festival", "Formal"],
      description: "Tussar silk saree with elegant zari border",
      badge: "Popular",
    },
    // Designer (5 products)
    {
      id: 3,
      name: "Designer Art Silk Saree",
      price: 7499,
      originalPrice: 9999,
      image: "https://templedesigner.com/cdn/shop/files/DSC09301.jpg?v=1718716907",
      category: "Designer",
      occasion: ["Party", "Formal"],
      description: "Contemporary designer saree with modern patterns",
      badge: "New",
    },
    {
      id: 5,
      name: "Organza Saree with Embroidery",
      price: 8799,
      originalPrice: 11299,
      image: "https://www.zilikaa.com/cdn/shop/files/I-8_979db032-6a74-4d04-92d7-4002545852d9_800x.jpg?v=1745492865",
      category: "Designer",
      occasion: ["Party", "Bridal"],
      description: "Sheer organza with intricate hand embroidery",
      badge: "Trending",
    },
    {
      id: 8,
      name: "Hand Painted Silk Saree",
      price: 9299,
      originalPrice: 11799,
      image: "https://dailybuyys.com/cdn/shop/products/WhatsApp_Image_2019-12-31_at_12.36.19_PM_1.jpg?v=1578145637",
      category: "Designer",
      occasion: ["Festival", "Party"],
      description: "Artistic hand-painted silk with unique designs",
    },
    {
      id: 13,
      name: "Embroidered Net Saree",
      price: 10999,
      originalPrice: 13999,
      image: "https://www.anantexports.in/cdn/shop/files/IMG-20250118_143844.jpg?v=1737191405&width=1946",
      category: "Designer",
      occasion: ["Party", "Bridal"],
      description: "Glamorous net saree with sequin and thread embroidery",
      badge: "Trending",
    },
    {
      id: 18,
      name: "Georgette Designer Saree",
      price: 9499,
      originalPrice: 11999,
      image: "https://akrithi.com/cdn/shop/products/fullsizeoutput_113d.jpeg?v=1538161310",
      category: "Designer",
      occasion: ["Party", "Formal"],
      description: "Elegant georgette saree with intricate sequin work",
      badge: "Trending",
    },
    // Fancy (5 products)
    {
      id: 39,
      name: "Fancy Georgette Saree",
      price: 5999,
      originalPrice: 7999,
      image: "https://assets2.andaazfashion.com/media/catalog/product/g/r/grey-beige-lace-embroidered-georgette-jacket-style-fancy-saree-sarv180031-1.jpg",
      category: "Fancy",
      occasion: ["Party", "Casual"],
      description: "Vibrant georgette saree with modern embellishments",
      badge: "New",
    },
    {
      id: 63,
      name: "Fancy Sequined Saree",
      price: 6499,
      originalPrice: 8499,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIZJVepK8yiCaX6U4Ez7_TxfNB-3RD7AXTvw&s",
      category: "Fancy",
      occasion: ["Party", "Casual"],
      description: "Fancy saree with sparkling sequin work",
      badge: "Trending",
    },
    {
      id: 64,
      name: "Fancy Chiffon Saree",
      price: 5799,
      originalPrice: 7799,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR_xHigcGim2n4a57xbXb02yKosLnu2xA9Xw&s",
      category: "Fancy",
      occasion: ["Party", "Casual"],
      description: "Lightweight chiffon saree with modern prints",
    },
    {
      id: 65,
      name: "Fancy Embroidered Saree",
      price: 6999,
      originalPrice: 8999,
      image: "https://www.vishalprints.in/cdn/shop/files/FALGUNI-43200-01_2ad17e39-9276-43e7-99f5-c2f8c9308396.jpg?v=1719127484",
      category: "Fancy",
      occasion: ["Party", "Formal"],
      description: "Fancy saree with intricate thread embroidery",
      badge: "New",
    },
    {
      id: 66,
      name: "Fancy Net Saree",
      price: 6299,
      originalPrice: 8299,
      image: "https://www.karagiri.com/cdn/shop/files/OP-376_1.jpg?v=1705486998",
      category: "Fancy",
      occasion: ["Party", "Casual"],
      description: "Fancy net saree with delicate embellishments",
      badge: "Popular",
    },
    // Cotton (5 products)
    {
      id: 6,
      name: "Cotton Silk Saree",
      price: 4499,
      originalPrice: 5999,
      image: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/7/c/7c90315SHMTPRM104_4.jpg?rnd=20200526195200&tr=w-512",
      category: "Cotton",
      occasion: ["Casual", "Formal"],
      description: "Comfortable cotton silk blend for everyday elegance",
    },
    {
      id: 16,
      name: "Printed Cotton Saree",
      price: 3999,
      originalPrice: 5499,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTndqA82RqM8JESHaplRysQ_1X9CKCnpZJJZA&s",
      category: "Cotton",
      occasion: ["Casual"],
      description: "Vibrant printed cotton saree for everyday wear",
    },
    {
      id: 31,
      name: "Cotton Blend Saree",
      price: 3499,
      originalPrice: 4999,
      image: "https://img.tatacliq.com/images/i10/437Wx649H/MP000000016980115_437Wx649H_202303242007384.jpeg",
      category: "Cotton",
      occasion: ["Casual", "Formal"],
      description: "Soft cotton blend saree for daily comfort",
      badge: "New",
    },
    {
      id: 32,
      name: "Handwoven Cotton Saree",
      price: 4299,
      originalPrice: 5999,
      image: "https://dailybuyys.com/cdn/shop/products/index_e0d4b02e-02d2-43f2-8c73-21d8b245efd1.jpg?v=1629452746",
      category: "Cotton",
      occasion: ["Casual"],
      description: "Handwoven cotton saree with traditional patterns",
    },
    {
      id: 67,
      name: "Cotton Chequered Saree",
      price: 3799,
      originalPrice: 5299,
      image: "https://aham.store/cdn/shop/files/IMG_4048_530x@2x.jpg?v=1723632139",
      category: "Cotton",
      occasion: ["Casual", "Formal"],
      description: "Cotton saree with elegant chequered patterns",
      badge: "Popular",
    },
    // Daily Wear (5 products)
    {
      id: 12,
      name: "Linen Silk Saree",
      price: 5699,
      originalPrice: 7499,
      image: "https://images.meesho.com/images/products/538705150/lx0an_512.jpg",
      category: "Daily Wear",
      occasion: ["Casual", "Formal"],
      description: "Breathable linen silk blend with subtle elegance",
    },
    {
      id: 20,
      name: "Chiffon Printed Saree",
      price: 4999,
      originalPrice: 6999,
      image: "https://kotharisons.com/cdn/shop/files/IMG_1091_09dc2362-d8a1-456b-91a5-590d3355fc45.jpg?v=1716802645&width=1946",
      category: "Daily Wear",
      occasion: ["Casual", "Party"],
      description: "Lightweight chiffon saree with vibrant prints",
    },
    {
      id: 68,
      name: "Daily Wear Cotton Saree",
      price: 3999,
      originalPrice: 5499,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ3FVDt5br5o4mZQteNsO-f5sEUHlWmMMYoQ&s",
      category: "Daily Wear",
      occasion: ["Casual"],
      description: "Comfortable cotton saree for daily wear",
      badge: "New",
    },
    {
      id: 69,
      name: "Linen Printed Saree",
      price: 5299,
      originalPrice: 7299,
      image: "https://www.sudarshansaree.com/cdn/shop/files/ASLX-MA01.jpg?v=1688115810",
      category: "Daily Wear",
      occasion: ["Casual", "Formal"],
      description: "Linen saree with subtle printed designs",
    },
    {
      id: 70,
      name: "Daily Wear Chiffon Saree",
      price: 4699,
      originalPrice: 6499,
      image: "https://cdn-image.blitzshopdeck.in/ShopdeckCatalogue/tr:f-webp,w-600,fo-auto/65b8c7204c0f6179ae976461/media/D3xfZliS_ERIP5LDL7C_2024-06-27_1.jpg",
      category: "Daily Wear",
      occasion: ["Casual", "Party"],
      description: "Lightweight chiffon saree for everyday elegance",
      badge: "Popular",
    },
    // Lehenga (5 products)
    {
      id: 7,
      name: "Bridal Lehenga Saree",
      price: 18999,
      originalPrice: 24999,
      image: "https://assets0.mirraw.com/images/94575/b8e9f725abec95ae26ae5609d1f69bca_zoom.jpg?1536740731",
      category: "Lehenga",
      occasion: ["Wedding", "Bridal"],
      description: "Regal bridal lehenga saree with heavy embroidery",
      badge: "Premium",
    },
    {
      id: 71,
      name: "Lehenga Choli Set",
      price: 15999,
      originalPrice: 19999,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjaIMBk-DKH5iLB0GwVXPafPpohMdSuB5vVQ&s",
      category: "Lehenga",
      occasion: ["Wedding", "Bridal"],
      description: "Elegant lehenga choli with intricate embroidery",
      badge: "Bestseller",
    },
    {
      id: 72,
      name: "Designer Lehenga Saree",
      price: 16999,
      originalPrice: 21999,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1VrKmOt-t0vaphbnhuZG1mfzIceH1NvUrXQ&s",
      category: "Lehenga",
      occasion: ["Wedding", "Party"],
      description: "Designer lehenga saree with modern embellishments",
      badge: "Trending",
    },
    {
      id: 73,
      name: "Embroidered Lehenga Set",
      price: 14999,
      originalPrice: 18999,
      image: "https://www.meerasplussizestore.com/cdn/shop/files/Orange-Anarkali-Lavina-SCL_0116.jpg?v=1733376438&width=2048",
      category: "Lehenga",
      occasion: ["Wedding", "Bridal"],
      description: "Lehenga set with heavy embroidery and zari work",
      badge: "New",
    },
    {
      id: 74,
      name: "Silk Lehenga Choli",
      price: 17999,
      originalPrice: 22999,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsNIRPRnogP5xeYyO1tUEfh2Xy5xcedPr16w&s",
      category: "Lehenga",
      occasion: ["Wedding", "Bridal"],
      description: "Silk lehenga choli with traditional patterns",
      badge: "Premium",
    },
    // Dress Material (5 products)
    {
      id: 41,
      name: "Dress Material Set",
      price: 3499,
      originalPrice: 4999,
      image: "https://www.chinayabanaras.com/cdn/shop/files/CDM-268_H_a_2_-LOW-DressMaterials-Chinaya_800x.jpg?v=1755686955",
      category: "Dress Material",
      occasion: ["Casual", "Formal"],
      description: "Unstitched dress material with embroidery",
      badge: "New",
    },
    {
      id: 75,
      name: "Churidar Dress Material",
      price: 3799,
      originalPrice: 5299,
      image: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/27508258/2024/2/12/4742eb92-18f8-43f8-a9a0-1f93cd44eed21707728326111TAVASEmbroideredUnstitchedDressMaterial1.jpg",
      category: "Dress Material",
      occasion: ["Casual", "Formal"],
      description: "Unstitched churidar set with elegant prints",
      badge: "Popular",
    },
    {
      id: 76,
      name: "Embroidered Dress Material",
      price: 3999,
      originalPrice: 5499,
      image: "https://peachmode.com/cdn/shop/products/file_23236b90-7da5-4028-857a-c0c6ff41bf1d.jpg?v=1685707269",
      category: "Dress Material",
      occasion: ["Casual", "Formal"],
      description: "Unstitched dress material with intricate embroidery",
    },
    {
      id: 77,
      name: "Cotton Dress Material",
      price: 3299,
      originalPrice: 4799,
      image: "https://peachmode.com/cdn/shop/products/green-printed-cotton-dress-material-peachmode-1_43bb1706-03b4-4b43-92c9-1843693186ae.jpg?v=1669043735&width=2000",
      category: "Dress Material",
      occasion: ["Casual"],
      description: "Comfortable cotton dress material for daily wear",
      badge: "New",
    },
    {
      id: 78,
      name: "Silk Dress Material",
      price: 4499,
      originalPrice: 5999,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREwe-mxUaxIqNDJdl9bEnyU_VIQKrm735QbQ&s",
      category: "Dress Material",
      occasion: ["Formal", "Party"],
      description: "Silk dress material with elegant patterns",
      badge: "Trending",
    },
    // Readymade (5 products)
    {
      id: 42,
      name: "Readymade Blouse Saree",
      price: 6499,
      originalPrice: 8499,
      image: "https://cdn.shopaccino.com/nakhrali/products/188-365299528167402_l.jpg?v=600",
      category: "Readymade",
      occasion: ["Party", "Casual"],
      description: "Pre-stitched saree with readymade blouse",
      badge: "Trending",
    },
    {
      id: 79,
      name: "Readymade Designer Saree",
      price: 6999,
      originalPrice: 8999,
      image: "https://www.anantexports.in/cdn/shop/files/IMG-20240516_160739.jpg?v=1715856063&width=1946",
      category: "Readymade",
      occasion: ["Party", "Formal"],
      description: "Pre-stitched designer saree with modern embellishments",
      badge: "New",
    },
    {
      id: 80,
      name: "Readymade Net Saree",
      price: 6799,
      originalPrice: 8799,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIlgi_RTZNbIjw4-D5rLS7bK9sWnGUpezmow&s",
      category: "Readymade",
      occasion: ["Party", "Bridal"],
      description: "Pre-stitched net saree with sequin work",
      badge: "Popular",
    },
    {
      id: 81,
      name: "Readymade Silk Saree",
      price: 7299,
      originalPrice: 9299,
      image: "https://www.royalexport.in/product-img/premium-party-wear-ready-made--1734422706.jpg",
      category: "Readymade",
      occasion: ["Festival", "Formal"],
      description: "Pre-stitched silk saree with elegant patterns",
    },
    {
      id: 82,
      name: "Readymade Georgette Saree",
      price: 6599,
      originalPrice: 8599,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJxoprWjrvV3ZHCzAI1dlcGUTJ19_UJQDV5g&s",
      category: "Readymade",
      occasion: ["Party", "Casual"],
      description: "Pre-stitched georgette saree with modern designs",
      badge: "New",
    },
    // Sale (5 products)
    {
      id: 43,
      name: "Sale Kanjivaram Saree",
      price: 9999,
      originalPrice: 14999,
      image: "https://houseofelegance.in/cdn/shop/files/KanjivaramSilkSaree2.jpg?v=1698311560",
      category: "Sale",
      occasion: ["Wedding", "Festival"],
      description: "Kanjivaram silk saree on special discount",
      badge: "Sale",
    },
    {
      id: 83,
      name: "Sale Banarasi Saree",
      price: 8999,
      originalPrice: 12999,
      image: "https://m.media-amazon.com/images/I/9176UCN4piL._UY350_.jpg",
      category: "Sale",
      occasion: ["Wedding", "Festival"],
      description: "Banarasi silk saree on special discount",
      badge: "Sale",
    },
    {
      id: 84,
      name: "Sale Designer Saree",
      price: 5999,
      originalPrice: 9999,
      image: "https://static.wixstatic.com/media/faf1ba_8e61a7e398744cc7bf39deab4da8c0a3~mv2.jpg/v1/fill/w_526,h_691,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/faf1ba_8e61a7e398744cc7bf39deab4da8c0a3~mv2.jpg",
      category: "Sale",
      occasion: ["Party", "Formal"],
      description: "Designer saree on special discount",
      badge: "Sale",
    },
    {
      id: 85,
      name: "Sale Cotton Saree",
      price: 2999,
      originalPrice: 4999,
      image: "https://jaipuriaapparels.com/cdn/shop/files/DSC_6173copy.jpg?v=1718978775&width=1946",
      category: "Sale",
      occasion: ["Casual", "Formal"],
      description: "Cotton saree on special discount",
      badge: "Sale",
    },
    {
      id: 86,
      name: "Sale Lehenga Saree",
      price: 12999,
      originalPrice: 18999,
      image: "https://www.nihalfashions.com/blog/wp-content/uploads/2010/12/Lehenga-Style-Sarees-Nihal-Fashions.jpg",
      category: "Sale",
      occasion: ["Wedding", "Bridal"],
      description: "Lehenga saree on special discount",
      badge: "Sale",
    },
  ];

  const categories = [
    "All",
    "Bridal",
    "Kanjivaram",
    "Silk",
    "Soft Silk",
    "Ikkat Silk",
    "Silk Dhoti",
    "Banaras",
    "Tussar",
    "Designer",
    "Fancy",
    "Cotton",
    "Daily Wear",
    "Lehenga",
    "Dress Material",
    "Readymade",
    "Sale",
  ];
  const occasions = ["Wedding", "Bridal", "Festival", "Party", "Formal", "Casual"];
  const prices = [
    { label: "Under ₹5,000", value: "0-5000" },
    { label: "₹5,000 - ₹10,000", value: "5000-10000" },
    { label: "₹10,000 - ₹15,000", value: "10000-15000" },
    { label: "Over ₹15,000", value: "15000-100000" },
  ];

  // Filter products based on selected filters
  useEffect(() => {
    let result = products;

    // Category filter
    if (selectedFilters.category.length > 0 && !selectedFilters.category.includes("All")) {
      result = result.filter(product => selectedFilters.category.includes(product.category));
    }

    // Price filter
    if (selectedFilters.price.length > 0) {
      result = result.filter(product => {
        return selectedFilters.price.some(priceRange => {
          const [min, max] = priceRange.split('-').map(Number);
          return product.price >= min && product.price <= max;
        });
      });
    }

    // Occasion filter
    if (selectedFilters.occasion.length > 0) {
      result = result.filter(product =>
        product.occasion.some(occ => selectedFilters.occasion.includes(occ))
      );
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedFilters]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
      } else {
        newFilters[filterType] = [...newFilters[filterType], value];
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      category: [],
      price: [],
      occasion: [],
    });
  };

  const formatPrice = price => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const paginate = pageNumber => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8]">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`md:w-1/4 ${
              filterOpen ? 'block fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'
            } md:block`}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#2E2E2E]">Filters</h2>
                <div className="flex items-center">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#6B2D2D] hover:text-[#3A1A1A] mr-4"
                  >
                    Clear All
                  </button>
                  {filterOpen && (
                    <button
                      onClick={toggleFilter}
                      className="md:hidden text-[#2E2E2E] hover:text-[#3A1A1A]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Category</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {categories.map((category, index) => (
                    <label key={index} className="flex items-center py-1">
                      <input
                        type="checkbox"
                        className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                        checked={selectedFilters.category.includes(category)}
                        onChange={() => handleFilterChange('category', category)}
                      />
                      <span className="ml-3 text-[#2E2E2E]">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Price Range</h3>
                <div className="space-y-2">
                  {prices.map((price, index) => (
                    <label key={index} className="flex items-center py-1">
                      <input
                        type="checkbox"
                        className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                        checked={selectedFilters.price.includes(price.value)}
                        onChange={() => handleFilterChange('price', price.value)}
                      />
                      <span className="ml-3 text-[#2E2E2E]">{price.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Occasion Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Occasion</h3>
                <div className="space-y-2">
                  {occasions.map((occasion, index) => (
                    <label key={index} className="flex items-center py-1">
                      <input
                        type="checkbox"
                        className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                        checked={selectedFilters.occasion.includes(occasion)}
                        onChange={() => handleFilterChange('occasion', occasion)}
                      />
                      <span className="ml-3 text-[#2E2E2E]">{occasion}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:w-3/4">
            {/* Mobile Filter Toggle and Results Count */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={toggleFilter}
                className="md:hidden flex items-center bg-white px-4 py-2 rounded-lg shadow-sm text-[#6B2D2D] font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
              </button>
              <div className="text-[#2E2E2E]">
                Showing {currentProducts.length} of {filteredProducts.length} products
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl group border border-[#D9A7A7]"
                  >
                    <div className="relative overflow-hidden">
                      {product.badge && (
                        <span className="absolute top-4 left-4 bg-[#6B2D2D] text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                          {product.badge}
                        </span>
                      )}
                      <div className="h-80 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#D9A7A7]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-[#6B2D2D]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-[#2E2E2E] mb-2 group-hover:text-[#3A1A1A] transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-[#2E2E2E] text-sm mb-3 line-clamp-2">{product.description}</p>

                      <div className="flex items-center mt-2 mb-3">
                        <span className="text-[#6B2D2D] font-bold text-lg">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-[#2E2E2E] text-sm line-through ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex">{/* Removed color swatches */}</div>
                        <Link to="/viewdetails">
                          <button className="bg-[#800020] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6B2D2D] hover:text-white transition-all duration-300">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-[#2E2E2E] mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-medium text-[#2E2E2E] mb-2">No products found</h3>
                <p className="text-[#2E2E2E]">Try adjusting your filters to find what you're looking for.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 bg-[#6B2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#3A1A1A] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > productsPerPage && (
              <div className="flex justify-center mt-16">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border text-[#2E2E2E] hover:bg-[#D9A7A7] hover:text-[#3A1A1A] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`px-4 py-2 rounded-lg border ${
                        currentPage === page
                          ? 'bg-[#6B2D2D] text-white'
                          : 'text-[#2E2E2E] hover:bg-[#D9A7A7] hover:text-[#3A1A1A]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border text-[#2E2E2E] hover:bg-[#D9A7A7] hover:text-[#3A1A1A] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;