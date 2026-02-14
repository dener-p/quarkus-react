package org.acme.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductDTO {
  public Long productId;
  public String name;
  public String code;
  public BigDecimal value;
  public List<ProductMaterialDTO> rawMaterials;
}
