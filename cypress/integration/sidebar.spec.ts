describe("foo", () => {
  it("sample", () => {
    cy.viewport(400, 400);
    cy.visit("/");

    cy.get(".sidebar-plus-icon").click().trigger("click", 50, 50, {force: true});
  });
});
