package org.acme.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "product_raw_materials")
public class ProductRawMaterialEntity extends PanacheEntityBase {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_id", nullable = false)
  @com.fasterxml.jackson.annotation.JsonIgnore
  public ProductEntity product;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "raw_material_id", nullable = false)
  public RawMaterialEntity rawMaterial;

  @Column(nullable = false)
  public Integer quantity;

}
