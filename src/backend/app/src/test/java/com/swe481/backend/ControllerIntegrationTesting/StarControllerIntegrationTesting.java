package com.swe481.backend.ControllerIntegrationTesting;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

/**

* Integration test for StarController - getStar
  */
  @SpringBootTest
  @AutoConfigureMockMvc
  class StarControllerIntegrationTesting {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void getStar_shouldReturn200() throws Exception {


   String starId = "nm1651765";

   MvcResult result = mockMvc.perform(
           get("/api/stars/{starId}", starId)
   ).andReturn();

   assertEquals(200, result.getResponse().getStatus());


  }

  @Test
  void getStarMovies_shouldReturn200() throws Exception {


   String starId = "nm1651765";

   MvcResult result = mockMvc.perform(
           get("/api/stars/{starId}/movies", starId)
   ).andReturn();

   assertEquals(200, result.getResponse().getStatus());


  }
  }
