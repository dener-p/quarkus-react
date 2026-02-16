package org.acme.controller;

import java.util.List;

import org.acme.dto.ProductionSuggestionDTO;
import org.acme.service.ProductionService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/production")
public class ProductionController {

  @Inject
  ProductionService productionService;

  @GET
  @Path("/")
  @Produces(MediaType.APPLICATION_JSON)
  public List<ProductionSuggestionDTO.ProductSuggestionDTO> getProduction() {
    return productionService.getProduction();
  }

  @GET
  @Path("/suggestion")
  @Produces(MediaType.APPLICATION_JSON)
  public List<ProductionSuggestionDTO.ProductSuggestionDTO> getSuggestion() {
    return productionService.getProductionSuggestions();
  }
}
