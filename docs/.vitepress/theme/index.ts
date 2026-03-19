import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import HomePage from "./HomePage.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component("HomePage", HomePage);
  },
};
