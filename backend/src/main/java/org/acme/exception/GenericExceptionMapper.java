package org.acme.exception;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class GenericExceptionMapper implements ExceptionMapper<AppException> {

  public record ErrorResponse(String msg) {
  }

  @Override
  public Response toResponse(AppException ex) {
    return Response.status(ex.getStatus())
        .entity(new ErrorResponse(ex.getMessage()))
        .build();
  }
}
