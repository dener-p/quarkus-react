package org.acme.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class ProductEntity extends PanacheEntityBase {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long productId;

  public String code;

  public String name;

  @Column(precision = 12, scale = 2)
  public BigDecimal value;

  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  public List<ProductRawMaterialEntity> rawMaterials = new ArrayList<>();
}
