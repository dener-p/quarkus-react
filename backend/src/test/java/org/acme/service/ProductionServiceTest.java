package org.acme.service;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.acme.dto.ProductionSuggestionDTO;
import org.acme.entity.ProductEntity;
import org.acme.entity.RawMaterialEntity;
import org.acme.exception.AppException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

@QuarkusTest
public class ProductionServiceTest {

    @Inject
    ProductionService productionService;

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
    public void testGetProductionSuggestions() {
        // Create Raw Material
        RawMaterialEntity wood = new RawMaterialEntity();
        wood.name = "Wood";
        wood.stockQuantity = 20;
        rawMaterialService.create(wood);

        // Create Product
        ProductEntity table = new ProductEntity();
        table.name = "Table";
        table.value = new BigDecimal("100.00");
        table.code = "TBL";
        productService.createProduct(table);

        // Link them
        productService.addRawMaterial(table.id, wood.id, 10);

        List<ProductionSuggestionDTO.ProductSuggestionDTO> suggestions = productionService.getProductionSuggestions();

        Assertions.assertFalse(suggestions.isEmpty());
        // 20 wood / 10 per table = 2 tables
        Assertions.assertEquals(2, suggestions.get(0).quantity);
        Assertions.assertEquals(new BigDecimal("200.00"), suggestions.get(0).value);
    }

    @Test
    public void testGetProduction() {
         // Create Raw Material
        RawMaterialEntity wood = new RawMaterialEntity();
        wood.name = "Wood";
        wood.stockQuantity = 10;
        rawMaterialService.create(wood);

        // Create Product
        ProductEntity table = new ProductEntity();
        table.name = "Table";
        table.value = new BigDecimal("50.00");
        table.code = "TBL";
        productService.createProduct(table);

        // Link them
        productService.addRawMaterial(table.id, wood.id, 5);

        List<ProductionSuggestionDTO.ProductSuggestionDTO> suggestions = productionService.getProduction();

        Assertions.assertFalse(suggestions.isEmpty());
        Assertions.assertEquals(2, suggestions.get(0).quantity);
        Assertions.assertEquals(new BigDecimal("100.00"), suggestions.get(0).value);
    }

    @Test
    public void testFindByIdNotFound() {
        Assertions.assertThrows(AppException.class, () -> productionService.findById(999L));
    }
}
