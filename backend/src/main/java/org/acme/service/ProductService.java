package org.acme.service;

import org.acme.dto.ProductDTO;
import org.acme.dto.ProductMaterialDTO;
import org.acme.entity.ProductEntity;
import org.acme.entity.ProductRawMaterialEntity;
import org.acme.entity.RawMaterialEntity;
import org.acme.exception.AppException;

import io.quarkus.panache.common.Sort;

import java.util.List;
import jakarta.ws.rs.core.Response;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class ProductService {

  @Inject
  RawMaterialService rawMaterialService;

  public ProductEntity createProduct(ProductEntity productEntity) {
    ProductEntity.persist(productEntity);
    return productEntity;
  }

  public List<ProductDTO> getProducts() {

    var products = ProductEntity.<ProductEntity>findAll(Sort.by("id")).list();

    return products.stream().map(product -> {

      ProductDTO dto = new ProductDTO();
      dto.productId = product.id;
      dto.name = product.name;
      dto.code = product.code;
      dto.value = product.value;

      dto.rawMaterials = product.rawMaterials.stream()
          .map(raw -> {
            ProductMaterialDTO materialDTO = new ProductMaterialDTO();
            materialDTO.name = raw.rawMaterial.name;
            materialDTO.quantity = raw.quantity;
            materialDTO.id = raw.id;
            return materialDTO;
          })
          .toList();

      return dto;
    }).toList();
  }

  public ProductEntity findById(Long productId) {
    return (ProductEntity) ProductEntity.findByIdOptional(productId)
        .orElseThrow(() -> new AppException("Produto não encontrado.", Response.Status.BAD_REQUEST));
  }

  public ProductEntity updateProduct(Long productId, ProductEntity productEntity) {
    var product = findById(productId);

    product.name = productEntity.name;
    product.value = productEntity.value;
    product.code = productEntity.code;

    ProductEntity.persist(product);
    return product;

  }

  public void deleteProduct(Long productId) {
    var product = findById(productId);
    // cascate = does not need to delete the ProductRawMaterialEntity...
    product.delete();

  }

  public void deleteRawMaterialFromProduct(Long id) {
    var deleted = ProductRawMaterialEntity.deleteById(id);
    if (!deleted) {
      throw new AppException("Não foi possível deletar!", Response.Status.BAD_GATEWAY);
    }
  }

  public void addRawMaterial(Long productId, Long rawMaterialId, Integer quantity) {
    ProductEntity product = findById(productId);
    RawMaterialEntity rawMaterial = rawMaterialService.findById(rawMaterialId);

    var exists = ProductRawMaterialEntity.find(
        "product.id = ?1 and rawMaterial.id = ?2",
        productId,
        rawMaterialId).firstResultOptional();

    if (exists.isPresent()) {
      throw new AppException("Materia Prima já existe no produto: '" + product.name + "'", Response.Status.BAD_REQUEST);
    }

    ProductRawMaterialEntity link = new ProductRawMaterialEntity();
    link.product = product;
    link.rawMaterial = rawMaterial;
    link.quantity = quantity;
    product.rawMaterials.add(link);
    link.persist();

    product.persist();
  }

}
