({
    optimize: "none",
    preserveLicenseComments: false,
    name: "node_modules/almond/almond.js",
    baseUrl: ".",
    paths: {
        ace : "../../lib/ace",
        demo: "../../demo/kitchen-sink"
    },
    packages: [
    ],
    include: [
        "ace/ace"
    ],
    exclude: [
    ],
    out: "./packed.js",
    useStrict: true,
    wrap: false
})