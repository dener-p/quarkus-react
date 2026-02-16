package org.acme.service;

import org.acme.entity.ProductRawMaterialEntity;
import org.acme.entity.RawMaterialEntity;
import org.acme.exception.AppException;

import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.util.List;

@ApplicationScoped
public class RawMaterialService {

  public List<RawMaterialEntity> getAll() {
    return RawMaterialEntity.findAll(Sort.by("id")).list();
  }

  public RawMaterialEntity findById(Long id) {
    return (RawMaterialEntity) RawMaterialEntity.findByIdOptional(id)
        .orElseThrow(() -> new AppException("Matéria-prima não encontrada.", Response.Status.BAD_REQUEST));

  }

  @Transactional
  public void create(RawMaterialEntity rawMaterial) {
    rawMaterial.persist();
  }

  @Transactional
  public RawMaterialEntity update(Long id, RawMaterialEntity rawMaterial) {
    RawMaterialEntity entity = RawMaterialEntity.findById(id);
    if (entity == null) {
      throw new RuntimeException("Matéria-prima não encontrada.");
    }
    entity.name = rawMaterial.name;
    entity.stockQuantity = rawMaterial.stockQuantity;
    return entity;
  }

  @Transactional
  public void delete(Long id) {
    var association = ProductRawMaterialEntity.find("rawMaterial.id", id).firstResult();

    if (association != null) {
      throw new AppException(
          "Não é possível deletar: A matéria-prima está sendo utilizada em algum produto.",
          Response.Status.BAD_REQUEST);
    }

    RawMaterialEntity.deleteById(id);
  }
}
