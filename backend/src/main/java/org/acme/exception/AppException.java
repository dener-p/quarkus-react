package org.acme.exception;

import jakarta.ws.rs.core.Response;

public class AppException extends RuntimeException {
  private final Response.Status status;

  public AppException(String message, Response.Status status) {
    super(message);
    this.status = status;
  }

  public Response.Status getStatus() {
    return status;
  }
}
