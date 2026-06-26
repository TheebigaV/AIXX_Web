// svg.d.ts
declare module "*.svg" {
  import * as React from "react";
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const src: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export { ReactComponent };
  export default src;
}
