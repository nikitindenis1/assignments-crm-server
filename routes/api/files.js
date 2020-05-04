const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const client = require("filestack-js").init("AWfbGrzSdiFuyzc179CQGz");

const Backendless = require('backendless')

Backendless.initApp('0C7F99A6-3715-126A-FF3C-3387261D5C00', '957C469D-E5DE-4C1D-8A8B-A3BE62BF1CD2')

//@route GET api/files/upload
//@desc upload files
//@access Private

router.post('/upload', auth, async (req,res) => {
    console.log(req.body)
    try {
     await  Backendless.Files.upload(req.body, '/myFiles', true).then(result => {
         console.log(result, 'la')
     })
     
    
    } catch (error) {
        
    }
})

module.exports = router;
