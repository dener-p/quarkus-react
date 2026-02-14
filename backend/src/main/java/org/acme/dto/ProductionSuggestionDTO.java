package org.acme.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductionSuggestionDTO {
    public List<ProductSuggestionDTO> products;
    public BigDecimal totalValue;

    public static class ProductSuggestionDTO {
        public String productName;
        public Integer quantity;
        public BigDecimal value;

        public ProductSuggestionDTO(String productName, Integer quantity, BigDecimal value) {
            this.productName = productName;
            this.quantity = quantity;
            this.value = value;
        }
    }
}
