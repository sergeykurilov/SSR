import express from 'express'
import React from "react";
import {renderToString} from "react-dom/server";
import {Home} from "./src/pages/Home";
import {StaticRouter} from "react-router-dom";
import App from "./src/App";
import {readFile} from "fs";
import {resolve} from "path";
import {ServerStyleSheet} from "styled-components";

const app = express()

app.use(express.static('./build', {index: false}))

app.get('/*', (req, res) => {
    const sheet = new ServerStyleSheet()

    const reactApp = renderToString(
        sheet.collectStyles(
            <StaticRouter location={req.url}>
                <App/>
            </StaticRouter>
        )
    );

    const templateFile = resolve('./build/index.html')
    readFile(templateFile, 'utf8', (err, data) => {
        if(err){
            return res.status(500).send(err)
        }

        return res.send(
            data.replace('<div id="root"></div>', `<div id="root">${reactApp}</div>`)
                .replace('{{styles}}', sheet.getStyleTags)
        )
    })
    // return res.send(`
    //     <html>
    //         <body>
    //             <div id="root">
    //                 ${reactApp}
    //             </div>
    //         </body>
    //     </html>
    // `)
})
app.listen(8080, () => {
    console.log('server listening on port 8080')
})
