//to check if the server is running
package com.swe481.backend.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * HealthController is a simple controller that provides a health check endpoint for the backend service.
 * 
*/
@RestController
@RequestMapping("/api")
public class HealthController {

  /**
   * Logic: This method handles GET requests to the /health endpoint. It returns a JSON response containing the status of the service and the name of the service.
   * Params: None
   * Returns: A Map<String, Object> containing the status and service name.
   */
  @GetMapping("/health")
  public Map<String, Object> health() {
    return Map.of(
    "status", "UP",
    "service", "backend"
);
  }
}
