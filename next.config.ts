import type { NextConfig } from "next";
// import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
    /* config options here */
    output: "export",
    trailingSlash: true,
    basePath: "/panel",
    assetPrefix: "/panel/",
    images: { unoptimized: true },
};
export default nextConfig;

// export default withFlowbiteReact(nextConfig);
