import * as products from "./products.json";

export async function seedProducts(prisma) {
  //////console.log('Products seed');
  const shops = await prisma.operator.findMany();
  //////console.log('shop count ', shops.length);
  for (const shop of shops) {
    if (shop.products !== undefined && shop.products.length > 0) continue;
    //console.log(products.default)
    for (var product of products.default) {
      product.shopId = shop.id;
      product.totalDiscountInCents = 0;
      delete product.shop_id;
      // product.id = ulid()
    }
  }
  // await prisma.product.createMany({ data: { ...products } })
  for await (const product of products.default) {
    ////console.log(product)
    await prisma.product.create({ data: { ...product } });
  }
}
// seedProducts()
