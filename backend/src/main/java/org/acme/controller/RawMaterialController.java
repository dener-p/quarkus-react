package org.acme.controller;

import org.acme.entity.RawMaterialEntity;
import org.acme.service.RawMaterialService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

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
    public Response create(RawMaterialEntity rawMaterial) {
        return Response.status(Response.Status.CREATED).entity(rawMaterialService.create(rawMaterial)).build();
    }

    @PUT
    @Path("/{id}")
    public RawMaterialEntity update(@PathParam("id") Long id, RawMaterialEntity rawMaterial) {
        return rawMaterialService.update(id, rawMaterial);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        rawMaterialService.delete(id);
        return Response.noContent().build();
    }
}
