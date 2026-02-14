package org.acme.service;

import org.acme.entity.RawMaterialEntity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class RawMaterialService {

    public List<RawMaterialEntity> getAll() {
        return RawMaterialEntity.listAll();
    }

    public RawMaterialEntity findById(Long id) {
        return RawMaterialEntity.findById(id);
    }

    @Transactional
    public RawMaterialEntity create(RawMaterialEntity rawMaterial) {
        rawMaterial.persist();
        return rawMaterial;
    }

    @Transactional
    public RawMaterialEntity update(Long id, RawMaterialEntity rawMaterial) {
        RawMaterialEntity entity = RawMaterialEntity.findById(id);
        if (entity == null) {
            throw new RuntimeException("RawMaterial not found");
        }
        entity.name = rawMaterial.name;
        entity.stockQuantity = rawMaterial.stockQuantity;
        return entity;
    }

    @Transactional
    public void delete(Long id) {
        RawMaterialEntity.deleteById(id);
    }
}
