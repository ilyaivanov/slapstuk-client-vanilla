describe("default appp", () => {
  it("should have zero in a button", () => {
    cy.viewport(500, 400);
    cy.visit("/");

    cy.get("#but")
    .should("have.text", "0")
    .click()
    .should("have.text", "1");
  });
});
