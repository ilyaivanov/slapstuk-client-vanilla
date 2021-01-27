import { cls } from "../../src/infra/keys";
    
describe("foo", () => {
  it("sample", () => {


    cy.viewport(400, 400);
    cy.visit("/");

    cy.get(".sidebar-plus-icon")
      .click()
      .get(`.${cls.sidebarRowInputField}`)
      .type("My New Name")
      .trigger("keyup", { key: "Enter" })
      .window()
      .trigger("mousedown", 50, 80)
      .trigger("mousemove", 60, 70);
  });
});
