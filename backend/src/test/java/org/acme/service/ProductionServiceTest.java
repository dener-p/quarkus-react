package org.acme.service;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.acme.dto.ProductionSuggestionDTO;
import org.acme.entity.ProductEntity;
import org.acme.entity.RawMaterialEntity;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

@QuarkusTest
public class ProductionServiceTest {

  @Inject
  ProductService productService;

  @Inject
  RawMaterialService rawMaterialService;

  @Inject
  ProductionService productionService;

  @BeforeEach
  @Transactional
  public void setup() {
    // Clean up
    ProductEntity.deleteAll();
    RawMaterialEntity.deleteAll();
  }

  @Test
  public void testProductionSuggestion() {
    // 1. Create Raw Materials
    RawMaterialEntity wood = new RawMaterialEntity();
    wood.name = "Wood";
    wood.stockQuantity = 100;
    rawMaterialService.create(wood);

    RawMaterialEntity iron = new RawMaterialEntity();
    iron.name = "Iron";
    iron.stockQuantity = 50;
    rawMaterialService.create(iron);

    // 2. Create Products
    ProductEntity table = new ProductEntity();
    table.name = "Table";
    table.value = new BigDecimal("100.00");
    table.code = "TBL";
    productService.createProduct(table);
    // Table needs 10 Wood and 2 Iron
    productService.addRawMaterial(table.productId, wood.id, 10);
    productService.addRawMaterial(table.productId, iron.id, 2);

    ProductEntity chair = new ProductEntity();
    chair.name = "Chair";
    chair.value = new BigDecimal("50.00");
    chair.code = "CHR";
    productService.createProduct(chair);
    // Chair needs 5 Wood
    productService.addRawMaterial(chair.productId, wood.id, 5);

    // 3. Test Suggestion
    // Stock: Wood 100, Iron 50
    // Table (Val 100): Needs 10 Wood, 2 Iron.
    // Chair (Val 50): Needs 5 Wood.

    // Prioritize Table (High value).
    // Max Tables = min(100/10, 50/2) = min(10, 25) = 10 Tables.
    // Wood used: 10 * 10 = 100. Remaining: 0.
    // Iron used: 10 * 2 = 20. Remaining: 30.

    // Remaining Stock: Wood 0, Iron 30.
    // Max Chairs = min(0/5) = 0.

    ProductionSuggestionDTO suggestion = productionService.getProductionSuggestion();

    Assertions.assertEquals(1, suggestion.products.size());
    Assertions.assertEquals("Table", suggestion.products.get(0).productName);
    Assertions.assertEquals(10, suggestion.products.get(0).quantity);

    // Total Value = 10 * 100 = 1000
    Assertions.assertEquals(0, new BigDecimal("1000.00").compareTo(suggestion.totalValue));
  }

  @Test
  public void testProductionSuggestionMixed() {
    // 1. Create Raw Materials
    RawMaterialEntity wood = new RawMaterialEntity();
    wood.name = "Wood";
    wood.stockQuantity = 100;
    rawMaterialService.create(wood);

    // 2. Create Products
    ProductEntity highVal = new ProductEntity();
    highVal.name = "HighVal";
    highVal.value = new BigDecimal("100.00");
    productService.createProduct(highVal);
    productService.addRawMaterial(highVal.productId, wood.id, 20); // Needs 20 wood

    ProductEntity lowVal = new ProductEntity();
    lowVal.name = "LowVal";
    lowVal.value = new BigDecimal("10.00");
    productService.createProduct(lowVal);
    productService.addRawMaterial(lowVal.productId, wood.id, 5); // Needs 5 wood

    // Stock: 100 Wood.
    // HighVal (100): Needs 20. Max 5.
    // Used: 5 * 20 = 100. Remaining: 0.
    // LowVal (10): Needs 5. Max 0.

    // Wait, what if we have stock for both?
    // Stock: 110 Wood.
    // HighVal (100): Needs 20. Max 5 (capped by stock? No, 110/20 = 5.5 -> 5). Used
    // 100. Rem 10.
    // LowVal (10): Needs 5. Max 10/5 = 2.

    // Let's update stock to 110
    wood.stockQuantity = 110;
    rawMaterialService.update(wood.id, wood);

    ProductionSuggestionDTO suggestion = productionService.getProductionSuggestion();

    Assertions.assertEquals(2, suggestion.products.size());

    // First should be HighVal (sorted by value)
    Assertions.assertEquals("HighVal", suggestion.products.get(0).productName);
    Assertions.assertEquals(5, suggestion.products.get(0).quantity);

    // Second should be LowVal
    Assertions.assertEquals("LowVal", suggestion.products.get(1).productName);
    Assertions.assertEquals(2, suggestion.products.get(1).quantity);

    // Total Value = (5 * 100) + (2 * 10) = 520
    Assertions.assertEquals(0, new BigDecimal("520.00").compareTo(suggestion.totalValue));
  }
}
