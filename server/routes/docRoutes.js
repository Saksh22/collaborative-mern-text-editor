const express = require('express');
const {getDocumentById, getDocuments,createDocument,deleteDocument,updateDocument} = require('../controllers/documentController');
const router = express.Router();
const {Authorized} = require('../middleware/authMiddleware');

const logRequestParams = (req, res, next) => {
    console.log('Request params:', req.params);
    next();
  };

router.route('/').get(Authorized, getDocuments).post(Authorized, createDocument);
router.route('/:id').get(logRequestParams,Authorized, getDocumentById).put(Authorized, updateDocument).delete(Authorized, deleteDocument);

module.exports=router;


