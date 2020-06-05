/*
 * We are transpiling everything imported by our input files the in the ./frontend folder
 * (JSX/JS/CSS/Images), minifying it and then putting it in the ./static/dist folder.
 */

const path = require("path");

module.exports = {
    entry: {
        jobs: path.join(__dirname, "/frontend/jobs.js")
    },
    module: {
        rules: [
            // Convert JSX (HTML in JavaScript) to JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            // Take care of images which are imported by JS
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                loader: "file-loader",

                options: {
                    name: "[name].[ext]",
                    outputPath: "../../static/dist/img"
                }
            },
            {
                test: /\.(svg|ttf|eot|woff|woff2)$/,
                // only process modules with this loader
                // if they live under a 'fonts' or 'pficon' directory
                include: [
                    path.resolve(
                        __dirname,
                        "node_modules/patternfly/dist/fonts"
                    ),
                    path.resolve(
                        __dirname,
                        "node_modules/@patternfly/react-core/dist/styles/assets/fonts"
                    ),
                    path.resolve(
                        __dirname,
                        "node_modules/@patternfly/react-core/dist/styles/assets/pficon"
                    ),
                    path.resolve(
                        __dirname,
                        "node_modules/@patternfly/patternfly/assets/fonts"
                    ),
                    path.resolve(
                        __dirname,
                        "node_modules/@patternfly/patternfly/assets/pficon"
                    )
                ],
                use: {
                    loader: "file-loader",
                    options: {
                        outputPath: "../../static/dist/fonts",
                        name: "[name].[ext]"
                    }
                }
            },
            // CSS, maybe add SCSS if needed later
            {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, "frontend"),
                    path.resolve(__dirname, "node_modules/patternfly"),
                    path.resolve(
                        __dirname,
                        "node_modules/@patternfly/patternfly"
                    ),
                    path.resolve(
                        __dirname,
                        "node_modules/@patternfly/react-styles/css"
                    ),
                    path.resolve(
                        __dirname,
                        "node_modules/@patternfly/react-core/dist/styles/base.css"
                    ),
                    path.resolve(
                        __dirname,
                        "node_modules/@patternfly/react-core/dist/esm/@patternfly/patternfly"
                    ),
                    path.resolve(
                        __dirname,
                        "node_modules/@patternfly/react-core/node_modules/@patternfly/react-styles/css"
                    ),
                    path.resolve(
                        __dirname,
                        "node_modules/@patternfly/react-table/node_modules/@patternfly/react-styles/css"
                    ),
                    path.resolve(
                        __dirname,
                        "node_modules/@patternfly/react-inline-edit-extension/node_modules/@patternfly/react-styles/css"
                    )
                ],
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    output: {
        path: __dirname + "/static/dist",
        filename: "[name].bundle.js"
    }
};
