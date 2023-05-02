const e = Component;
function Head() {
  e.create("main", {
    children: [
      e.create("p"),
      e.create("p"),
      e.create("p"),
      e.create("p"),
      e.create("div", {
        children: [
          e.create("h1", { children: "Hello!" }),
          e.create("h2", { children: "There!" }),
          e.create("div", {
            children: [e.create("h3", { children: "You!" })],
          }),
        ],
      }),
    ],
  });
}
Head();
e.render(document.getElementById("app"));
