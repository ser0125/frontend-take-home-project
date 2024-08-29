beforeEach(() => {
  cy.visit("https://frontend-take-home-project.vercel.app/");
});
describe("CanvasDrawer Component", () => {
  it("should select the drawing tool and draw on the canvas", () => {
    cy.get('[data-testid="drawer-button"]').click();
    cy.get("canvas")
      .trigger("mousedown", { clientX: 50, clientY: 50 })
      .trigger("mousedown", { clientX: 450, clientY: 250 })
      .trigger("mousemove", { clientX: 200, clientY: 200 })
      .trigger("mouseup");
  });

  it("should select the textbox tool, add text and draw it on the canvas", () => {
    cy.get('[data-testid="textbox-button"]').click();
    cy.get("canvas").click(100, 100);
    cy.get('input[type="text"]').type("Hello World{enter}");
  });

  it("should select the eraser tool and erase part of the canvas", () => {
    cy.get('[data-testid="drawer-button"]').click();

    cy.get("canvas")
      .trigger("mousedown", { clientX: 50, clientY: 50 })
      .trigger("mousedown", { clientX: 450, clientY: 250 })
      .trigger("mousemove", { clientX: 200, clientY: 200 })
      .trigger("mouseup");

    cy.get('[data-testid="eraser-button"]').click();
    cy.wait(1000);

    cy.get("canvas")
      .trigger("mousedown", { clientX: 50, clientY: 50 })
      .trigger("mousedown", { clientX: 450, clientY: 250 })
      .trigger("mousemove", { clientX: 200, clientY: 200 })
      .trigger("mouseup");
  });
  it("should undo the last action", () => {
    cy.get('[data-testid="drawer-button"]').click();

    cy.get("canvas")
      .trigger("mousedown", { clientX: 50, clientY: 50 })
      .trigger("mousedown", { clientX: 450, clientY: 250 })
      .trigger("mousemove", { clientX: 200, clientY: 200 })
      .trigger("mouseup");

    cy.get("canvas")
      .trigger("mousedown", { clientX: 100, clientY: 50 })
      .trigger("mousedown", { clientX: 650, clientY: 450 })
      .trigger("mousemove", { clientX: 200, clientY: 200 })
      .trigger("mouseup");

    cy.get('[data-testid="undo-button"]').click();
  });

  it.only("should clear the canvas", () => {
    cy.get('[data-testid="drawer-button"]').click();
    cy.get("canvas")
      .trigger("mousedown", { clientX: 50, clientY: 50 })
      .trigger("mousedown", { clientX: 450, clientY: 250 })
      .trigger("mousemove", { clientX: 200, clientY: 200 })
      .trigger("mouseup");

    cy.get("canvas")
      .trigger("mousedown", { clientX: 100, clientY: 50 })
      .trigger("mousedown", { clientX: 650, clientY: 450 })
      .trigger("mousemove", { clientX: 200, clientY: 200 })
      .trigger("mouseup");

    cy.get('[data-testid="clear-button"]').click();
  });
});
