import { cssText, dom, styles, anim } from "../infra";
import { DivDefinition, findById } from "../infra/dom";

const animationSpeed = 2000;
cssText(`

.container{
    display: flex;
    flex-direaction: row;
    align-items: flex-start;
}
.box{
    font-size: 60px;
    width: 200px;
    background-color:rgb(128, 128, 128);
    margin-left: 20px;
    display: inline-block;
    transition: height ${animationSpeed}ms ease-out;
    overflow: hidden;
}
`);

let isFirstShown = true;
let isSecondShown = false;
export const init = (parent: HTMLElement) => {
  parent.appendChild(
    dom.div({
      children: [
        {
          className: "container" as any,
          children: [firstBox, secondBox],
        },
        {
          type: "button",
          style: { ...styles.absoluteTopLeft(400, 70) },
          children: "toggle first",
          on: {
            click: () => {
              isFirstShown = !isFirstShown;
              if (isFirstShown)
                anim.openElementHeight(
                  dom.findById("first-box"),
                  "Some long-long text indeed",
                  animationSpeed
                );
              else
                anim.collapseElementHeight(
                  dom.findById("first-box"),
                  animationSpeed
                );
            },
          },
        },
        {
          type: "button",
          style: { ...styles.absoluteTopLeft(400, 300) },
          children: "toggle second",
          on: {
            click: () => {
              isSecondShown = !isSecondShown;
              if (isSecondShown)
                anim.openElementHeight(
                  dom.findById("second-box"),
                  "some another text indeed",
                  animationSpeed
                );
              else
                anim.collapseElementHeight(
                  dom.findById("second-box"),
                  animationSpeed
                );
            },
          },
        },
      ],
    })
  );
};

const firstBox: DivDefinition = {
  id: "first-box",
  className: "box" as any,

  children: "Some long-long text indeed",
};

const secondBox: DivDefinition = {
  id: "second-box",
  className: "box" as any,
};
