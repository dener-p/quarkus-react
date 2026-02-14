package org.acme.service;

import org.acme.dto.ProductDTO;
import org.acme.dto.ProductMaterialDTO;
import org.acme.entity.ProductEntity;
import org.acme.entity.ProductRawMaterialEntity;
import org.acme.entity.RawMaterialEntity;
import org.acme.exception.ProductNotFoundException;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProductService {

  public ProductEntity createProduct(ProductEntity productEntity) {
    ProductEntity.persist(productEntity);
    return productEntity;
  }

  public List<ProductDTO> getProducts() {

    var products = ProductEntity.<ProductEntity>findAll().list();

    return products.stream().map(product -> {

      ProductDTO dto = new ProductDTO();
      dto.productId = product.productId;
      dto.name = product.name;
      dto.code = product.code;
      dto.value = product.value;

      dto.rawMaterials = product.rawMaterials.stream()
          .map(raw -> {
            ProductMaterialDTO materialDTO = new ProductMaterialDTO();
            materialDTO.name = raw.rawMaterial.name;
            materialDTO.quantity = raw.quantity;
            return materialDTO;
          })
          .toList();

      return dto;
    }).toList();
  }

  // public ProductDTO findById(Long productId) {
  //
  // ProductEntity product =
  // ProductEntity.<ProductEntity>findByIdOptional(productId)
  // .orElseThrow(ProductNotFoundException::new);
  //
  // ProductDTO dto = new ProductDTO();
  // dto.productId = product.productId;
  // dto.name = product.name;
  //
  // dto.rawMaterials = product.rawMaterials.stream()
  // .map(raw -> {
  // ProductMaterialDTO materialDTO = new ProductMaterialDTO();
  // materialDTO.name = raw.rawMaterial.name;
  // materialDTO.quantity = raw.quantity;
  // return materialDTO;
  // })
  // .toList();
  //
  // return dto;
  // }
  public ProductEntity findById(Long productId) {
    return (ProductEntity) ProductEntity.findByIdOptional(productId)
        .orElseThrow(ProductNotFoundException::new);
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
    // this should just mark as deleted but lets do the old way
    ProductRawMaterialEntity.delete("product_id", productId);
    ProductEntity.deleteById(productId);
  }

  public void deleteRawMaterial(Long rawMaterialId) {
    // this should just mark as deleted but lets do the old way
    ProductRawMaterialEntity.delete("raw_material_id", rawMaterialId);
    RawMaterialEntity.deleteById(rawMaterialId);
  }

  @jakarta.transaction.Transactional
  public void addRawMaterial(Long productId, Long rawMaterialId, Integer quantity) {
    ProductEntity product = findById(productId);
    RawMaterialEntity rawMaterial = RawMaterialEntity.findById(rawMaterialId);

    if (rawMaterial == null) {
      // TODO: add expetion
      throw new RuntimeException("RawMaterial not found");
    }

    if (product.rawMaterials == null) {
      product.rawMaterials = new java.util.ArrayList<>();
    }

    var existingLink = product.rawMaterials.stream()
        .filter(rm -> rm.rawMaterial.id.equals(rawMaterialId))
        .findFirst();

    if (existingLink.isPresent()) {
      existingLink.get().quantity += quantity;
    } else {
      ProductRawMaterialEntity link = new ProductRawMaterialEntity();
      link.product = product;
      link.rawMaterial = rawMaterial;
      link.quantity = quantity;
      product.rawMaterials.add(link);
      link.persist();
    }

    product.persist();
  }

}
