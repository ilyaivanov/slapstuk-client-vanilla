import { cls, css, dom } from "./infra";
import * as app from './app';
css("body", {
  margin: "0",
  fontFamily: `"Roboto", "Source Sans Pro", "Trebuchet MS", "Lucida Grande", "Bitstream Vera Sans", "Helvetica Neue", sans-serif`,
});

css("*", {
  boxSizing: "border-box",
});
app.init();