declare module "*.vue" {
  import { defineComponent } from "vue";
  const component: ReturnType<typeof defineComponent>;
  export default component;
}

declare namespace NodeJS {
  interface Process {
    env: {
      readonly NODE_ENV: "development" | "production";
    };
  }
}
