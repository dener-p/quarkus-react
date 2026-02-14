package org.acme.controller;

import org.acme.dto.AddRawMaterialDTO;
import org.acme.entity.ProductEntity;
import org.acme.service.ProductService;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductController {
  private final ProductService productService;

  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  @GET
  public Response getProducts() {
    return Response.ok(productService.getProducts()).build();
  }

  @GET
  @Path("/{id}")
  public Response getProduct(@PathParam("id") Long productId) {
    return Response.ok(productService.findById(productId)).build();
  }

  @POST
  @Transactional
  public Response createProduct(ProductEntity productEntity) {
    return Response.ok(productService.createProduct(productEntity)).build();
  }

  @PATCH
  @Path("/{id}")
  @Transactional
  public Response updateProduct(@PathParam("id") Long productId, ProductEntity productEntity) {
    return Response.ok(productService.updateProduct(productId, productEntity)).build();
  }

  @DELETE
  @Path("/{id}")
  @Transactional
  public Response deleteProduct(@PathParam("id") Long productId) {
    productService.deleteProduct(productId);
    return Response.noContent().build();
  }

  @POST
  @Path("/{id}/raw-materials")
  public Response addRawMaterial(@PathParam("id") Long productId, AddRawMaterialDTO dto) {
    productService.addRawMaterial(productId, dto.rawMaterialId, dto.quantity);
    return Response.ok().build();
  }
}
