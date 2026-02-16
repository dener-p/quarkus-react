package org.acme.service;

import org.acme.dto.ProductionSuggestionDTO;
import org.acme.entity.ProductEntity;
import org.acme.entity.ProductRawMaterialEntity;
import org.acme.entity.RawMaterialEntity;
import org.acme.exception.AppException;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class ProductionService {
  public ProductRawMaterialEntity findById(Long id) {
    return (ProductRawMaterialEntity) ProductRawMaterialEntity.findByIdOptional(id)
        .orElseThrow(() -> new AppException("Material não encontrado no produto.", Response.Status.BAD_REQUEST));
  }

  public List<ProductionSuggestionDTO.ProductSuggestionDTO> getProductionSuggestions() {

    List<ProductEntity> products = ProductEntity.listAll();
    List<RawMaterialEntity> rawMaterials = RawMaterialEntity.listAll();

    Map<Long, Integer> originalStock = new HashMap<>();
    for (RawMaterialEntity rm : rawMaterials) {
      originalStock.put(rm.id, rm.stockQuantity);
    }

    BigDecimal bestProfit = BigDecimal.ZERO;
    List<ProductionSuggestionDTO.ProductSuggestionDTO> bestPlan = new ArrayList<>();

    // Try each product as first priority
    for (ProductEntity primary : products) {

      Map<Long, Integer> availableStock = new HashMap<>(originalStock);
      List<ProductionSuggestionDTO.ProductSuggestionDTO> currentPlan = new ArrayList<>();
      BigDecimal totalProfit = BigDecimal.ZERO;

      // Produce primary first
      totalProfit = produceProduct(primary, availableStock, currentPlan, totalProfit);

      // Then produce others
      for (ProductEntity other : products) {
        if (other.id.equals(primary.id))
          continue;
        totalProfit = produceProduct(other, availableStock, currentPlan, totalProfit);
      }

      if (totalProfit.compareTo(bestProfit) > 0) {
        bestProfit = totalProfit;
        bestPlan = currentPlan;
      }
    }

    bestPlan.sort((a, b) -> b.value.compareTo(a.value));
    return bestPlan;
  }

  public List<ProductionSuggestionDTO.ProductSuggestionDTO> getProduction() {
    List<ProductEntity> products = ProductEntity.listAll();
    List<RawMaterialEntity> rawMaterials = RawMaterialEntity.listAll();

    List<ProductionSuggestionDTO.ProductSuggestionDTO> suggestions = new ArrayList<>();
    Map<Long, Integer> originalStock = new HashMap<>();
    for (RawMaterialEntity rm : rawMaterials) {
      originalStock.put(rm.id, rm.stockQuantity);
    }

    for (ProductEntity product : products) {
      Map<Long, Integer> availableStock = new HashMap<>(originalStock);
      BigDecimal totalProfit = BigDecimal.ZERO;

      totalProfit = produceProduct(product, availableStock, suggestions, totalProfit);

    }
    return suggestions;
  }

  private BigDecimal produceProduct(
      ProductEntity product,
      Map<Long, Integer> stock,
      List<ProductionSuggestionDTO.ProductSuggestionDTO> plan,
      BigDecimal totalProfit) {

    if (product.rawMaterials == null || product.rawMaterials.isEmpty())
      return totalProfit;

    int maxProducible = Integer.MAX_VALUE;

    for (ProductRawMaterialEntity prm : product.rawMaterials) {
      int available = stock.getOrDefault(prm.rawMaterial.id, 0);
      int possible = available / prm.quantity;
      maxProducible = Math.min(maxProducible, possible);
    }

    if (maxProducible <= 0)
      return totalProfit;

    for (ProductRawMaterialEntity prm : product.rawMaterials) {
      long id = prm.rawMaterial.id;
      stock.put(id, stock.get(id) - prm.quantity * maxProducible);
    }

    BigDecimal profit = product.value.multiply(BigDecimal.valueOf(maxProducible));
    totalProfit = totalProfit.add(profit);

    plan.add(new ProductionSuggestionDTO.ProductSuggestionDTO(
        product.name,
        maxProducible,
        profit));

    return totalProfit;
  }

}
