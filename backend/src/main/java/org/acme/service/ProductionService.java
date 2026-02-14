package org.acme.service;

import org.acme.dto.ProductionSuggestionDTO;
import org.acme.entity.ProductEntity;
import org.acme.entity.ProductRawMaterialEntity;
import org.acme.entity.RawMaterialEntity;

import jakarta.enterprise.context.ApplicationScoped;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class ProductionService {

  public List<ProductionSuggestionDTO.ProductSuggestionDTO> getProductionSuggestions() {

    // 1. Fetch all products and sort by value (highest first)
    List<ProductEntity> products = ProductEntity.listAll();
    products.sort(Comparator.comparing((ProductEntity p) -> p.value).reversed());

    // 2. Fetch all raw materials and map their stock
    List<RawMaterialEntity> rawMaterials = RawMaterialEntity.listAll();
    Map<Long, Integer> availableStock = new HashMap<>();
    for (RawMaterialEntity rm : rawMaterials) {
      availableStock.put(rm.id, rm.stockQuantity);
    }

    List<ProductionSuggestionDTO.ProductSuggestionDTO> suggestions = new ArrayList<>();

    // 3. Calculate max production for each product
    for (ProductEntity product : products) {
      if (product.rawMaterials == null || product.rawMaterials.isEmpty()) {
        continue;
      }

      int maxProducible = Integer.MAX_VALUE;

      for (ProductRawMaterialEntity prm : product.rawMaterials) {
        Integer currentStock = availableStock.getOrDefault(prm.rawMaterial.id, 0);

        if (prm.quantity > 0) {
          int possibleWithThisMaterial = currentStock / prm.quantity;
          maxProducible = Math.min(maxProducible, possibleWithThisMaterial);
        }
      }

      if (maxProducible > 0) {

        BigDecimal totalProductValue = product.value.multiply(BigDecimal.valueOf(maxProducible));

        suggestions.add(new ProductionSuggestionDTO.ProductSuggestionDTO(
            product.name,
            maxProducible,
            totalProductValue));

        // Deduct stock

      }
    }

    return suggestions;
  }
}
