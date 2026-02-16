package org.acme.service;

import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.acme.dto.ProductDTO;
import org.acme.entity.ProductEntity;
import org.acme.entity.RawMaterialEntity;
import org.acme.exception.AppException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

@QuarkusTest
public class ProductServiceTest {

  @Inject
  ProductService productService;

  @Inject
  RawMaterialService rawMaterialService;

  @BeforeEach
  @Transactional
  public void setup() {
    org.acme.entity.ProductRawMaterialEntity.deleteAll();
    ProductEntity.deleteAll();
    RawMaterialEntity.deleteAll();
  }

  @Test
  public void testCreateProduct() {
    ProductEntity product = new ProductEntity();
    product.name = "Table";
    product.value = new BigDecimal("100.00");
    product.code = "TBL";

    productService.createProduct(product);

    Assertions.assertNotNull(product.id);
    Assertions.assertEquals("Table", product.name);
  }

  @Test
  public void testGetProducts() {
    ProductEntity product = new ProductEntity();
    product.name = "Table";
    product.value = new BigDecimal("100.00");
    product.code = "TBL";
    productService.createProduct(product);

    List<ProductDTO> products = productService.getProducts();

    Assertions.assertEquals(1, products.size());
    Assertions.assertEquals("Table", products.get(0).name);
  }

  @Test
  public void testUpdateProduct() {
    ProductEntity product = new ProductEntity();
    product.name = "Table";
    product.value = new BigDecimal("100.00");
    product.code = "TBL";
    productService.createProduct(product);

    ProductEntity update = new ProductEntity();
    update.name = "Updated Table";
    update.value = new BigDecimal("150.00");
    update.code = "TBL_UPD";

    ProductEntity updatedProduct = productService.updateProduct(product.id, update);

    Assertions.assertEquals("Updated Table", updatedProduct.name);
    Assertions.assertEquals(new BigDecimal("150.00"), updatedProduct.value);
  }

  @Test
  public void testDeleteProduct() {
    ProductEntity product = new ProductEntity();
    product.name = "Table";
    product.value = new BigDecimal("100.00");
    product.code = "TBL";
    productService.createProduct(product);

    productService.deleteProduct(product.id);

    Assertions.assertThrows(AppException.class, () -> productService.findById(product.id));
  }

  @Test
  public void testAddRawMaterial() {
    ProductEntity product = new ProductEntity();
    product.name = "Table";
    product.value = new BigDecimal("100.00");
    product.code = "TBL";
    productService.createProduct(product);

    RawMaterialEntity wood = new RawMaterialEntity();
    wood.name = "Wood";
    wood.stockQuantity = 100;
    rawMaterialService.create(wood);

    productService.addRawMaterial(product.id, wood.id, 10);

    ProductEntity foundProduct = productService.findById(product.id);
    Assertions.assertEquals(1, foundProduct.rawMaterials.size());
    Assertions.assertEquals("Wood", foundProduct.rawMaterials.get(0).rawMaterial.name);
    Assertions.assertEquals(10, foundProduct.rawMaterials.get(0).quantity);
  }

  @Test
  public void testAddDuplicateRawMaterial() {
    ProductEntity product = new ProductEntity();
    product.name = "Table";
    product.value = new BigDecimal("100.00");
    product.code = "TBL";
    productService.createProduct(product);

    RawMaterialEntity wood = new RawMaterialEntity();
    wood.name = "Wood";
    wood.stockQuantity = 100;
    rawMaterialService.create(wood);

    productService.addRawMaterial(product.id, wood.id, 10);

    Assertions.assertThrows(AppException.class, () -> {
      productService.addRawMaterial(product.id, wood.id, 5);
    });
  }

  @Test
  @TestTransaction
  public void testDeleteRawMaterialFromProduct() {
    ProductEntity product = new ProductEntity();
    product.name = "Table";
    product.value = new BigDecimal("100.00");
    product.code = "TBL";
    productService.createProduct(product);

    RawMaterialEntity wood = new RawMaterialEntity();
    wood.name = "Wood";
    wood.stockQuantity = 100;
    rawMaterialService.create(wood);

    productService.addRawMaterial(product.id, wood.id, 10);
    ProductEntity foundProduct = productService.findById(product.id);
    Long prId = foundProduct.rawMaterials.get(0).id;

    productService.deleteRawMaterialFromProduct(prId);

    foundProduct = productService.findById(product.id);
    Assertions.assertEquals(0, foundProduct.rawMaterials.size());
  }

  @Test
  @TestTransaction
  public void testUpdateRawMaterialFromProduct() {
    ProductEntity product = new ProductEntity();
    product.name = "Table";
    product.value = new BigDecimal("100.00");
    product.code = "TBL";
    productService.createProduct(product);

    RawMaterialEntity wood = new RawMaterialEntity();
    wood.name = "Wood";
    wood.stockQuantity = 100;
    rawMaterialService.create(wood);

    productService.addRawMaterial(product.id, wood.id, 10);
    ProductEntity foundProduct = productService.findById(product.id);
    Long prId = foundProduct.rawMaterials.get(0).id;

    org.acme.dto.ProductionUpdateRawMaterialDTO updateStatus = new org.acme.dto.ProductionUpdateRawMaterialDTO();
    updateStatus.quantity = 20;

    productService.updateRawMaterialFromProduct(prId, updateStatus);

    foundProduct = productService.findById(product.id);
    Assertions.assertEquals(20, foundProduct.rawMaterials.get(0).quantity);
  }
}
