package org.acme.service;

import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.acme.entity.RawMaterialEntity;
import org.acme.entity.ProductEntity;
import org.acme.exception.AppException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

@QuarkusTest
public class RawMaterialServiceTest {

  @Inject
  RawMaterialService rawMaterialService;

  @Inject
  ProductService productService;

  @BeforeEach
  @Transactional
  public void setup() {
    org.acme.entity.ProductRawMaterialEntity.deleteAll();
    ProductEntity.deleteAll();
    RawMaterialEntity.deleteAll();
  }

  @Test
  public void testCreateRawMaterial() {
    RawMaterialEntity wood = new RawMaterialEntity();
    wood.name = "Wood";
    wood.stockQuantity = 100;

    rawMaterialService.create(wood);

    Assertions.assertNotNull(wood.id);
    Assertions.assertEquals("Wood", wood.name);
  }

  @Test
  public void testGetAllRawMaterials() {
    RawMaterialEntity wood = new RawMaterialEntity();
    wood.name = "Wood";
    wood.stockQuantity = 100;
    rawMaterialService.create(wood);

    List<RawMaterialEntity> materials = rawMaterialService.getAll();

    Assertions.assertEquals(1, materials.size());
    Assertions.assertEquals("Wood", materials.get(0).name);
  }

  @Test
  public void testUpdateRawMaterial() {
    RawMaterialEntity wood = new RawMaterialEntity();
    wood.name = "Wood";
    wood.stockQuantity = 100;
    rawMaterialService.create(wood);

    RawMaterialEntity update = new RawMaterialEntity();
    update.name = "Oak Wood";
    update.stockQuantity = 200;

    RawMaterialEntity updatedMaterial = rawMaterialService.update(wood.id, update);

    Assertions.assertEquals("Oak Wood", updatedMaterial.name);
    Assertions.assertEquals(200, updatedMaterial.stockQuantity);
  }

  @Test
  public void testDeleteRawMaterial() {
    RawMaterialEntity wood = new RawMaterialEntity();
    wood.name = "Wood";
    wood.stockQuantity = 100;
    rawMaterialService.create(wood);

    rawMaterialService.delete(wood.id);

    Assertions.assertThrows(AppException.class, () -> rawMaterialService.findById(wood.id));
  }

  @Test
  public void testDeleteRawMaterialInUse() {
    RawMaterialEntity wood = new RawMaterialEntity();
    wood.name = "Wood";
    wood.stockQuantity = 100;
    rawMaterialService.create(wood);

    ProductEntity table = new ProductEntity();
    table.name = "Table";
    table.value = new BigDecimal("100.00");
    table.code = "TBL";
    productService.createProduct(table);

    productService.addRawMaterial(table.id, wood.id, 10);

    Assertions.assertThrows(AppException.class, () -> rawMaterialService.delete(wood.id));
  }

  @Test
  public void testFindByIdNotFound() {
    Assertions.assertThrows(AppException.class, () -> rawMaterialService.findById(999L));
  }
}
