package org.acme.controller;

import org.acme.entity.RawMaterialEntity;
import org.acme.service.RawMaterialService;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialController {

  @Inject
  RawMaterialService rawMaterialService;

  @GET
  public List<RawMaterialEntity> getAll() {
    return rawMaterialService.getAll();
  }

  @GET
  @Path("/{id}")
  public RawMaterialEntity get(@PathParam("id") Long id) {
    return rawMaterialService.findById(id);
  }

  @POST
  @Transactional
  public Response create(RawMaterialEntity rawMaterial) {
    rawMaterialService.create(rawMaterial);
    Map<String, String> response = new HashMap<>();
    response.put("msg", "Materia prima registrada com sucesso!.");
    return Response.status(Response.Status.CREATED).entity(response).build();
  }

  @PATCH
  @Path("/{id}")
  @Transactional
  public RawMaterialEntity update(@PathParam("id") Long id, RawMaterialEntity rawMaterial) {
    return rawMaterialService.update(id, rawMaterial);
  }

  @DELETE
  @Path("/{id}")
  @Transactional
  public Response delete(@PathParam("id") Long id) {
    rawMaterialService.delete(id);
    Map<String, String> response = new HashMap<>();
    response.put("msg", "Materia prima removida com sucesso!.");
    return Response.ok(response).build();
  }
}
