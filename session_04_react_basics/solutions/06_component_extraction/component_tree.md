# Component Tree

## Sơ đồ component

```
App
├── Navbar { logo, links }
├── Hero { title, subtitle, buttonText }
├── ProductGrid { title, products }
│   └── ProductCard { image, name, price }
└── Footer { text }
```

## Props mỗi component

- `Navbar`
  - `logo`: tên thương hiệu
  - `links`: mảng các link `{ label, href }`
- `Hero`
  - `title`: tiêu đề chính
  - `subtitle`: mô tả phụ
  - `buttonText`: nội dung nút
- `ProductGrid`
  - `title`: tiêu đề section
  - `products`: mảng sản phẩm
- `ProductCard`
  - `image`: đường dẫn ảnh
  - `name`: tên sản phẩm
  - `price`: giá
- `Footer`
  - `text`: nội dung chân trang

## Lý do tách component

- `Navbar`: tái sử dụng ở nhiều trang, dễ thay đổi menu chỉ ở 1 chỗ.
- `Hero`: phần giới thiệu độc lập, có thể dùng lại với nội dung khác.
- `ProductCard`: mỗi sản phẩm lặp lại, tách ra giúp render `.map()` sạch hơn.
- `ProductGrid`: quản lý layout danh sách, tách khỏi nội dung từng thẻ sản phẩm.
- `Footer`: chân trang dùng chung, tách riêng để dễ bảo trì.
