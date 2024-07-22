const Document = require('../models/documentModel');
const mongoose = require('mongoose');

exports.getDocuments = async (req,res) =>{

    try{
        const documents = await Document.find({user:req.user.id});
        res.status(201).json({
            success: true,
            documents
        });
    } catch (error){
        res.status(500).json({message: 'Server error'});
    }
};

exports.createDocument = async(req,res) => {
    const {title} = req.body;

    try{
        const document = new Document({
            title,
            user: req.user.id,
        });

        const createdDocument = await document.save();
        res.status(201).json({
            success: true,
            createdDocument
        });
    }catch (error){
        console.error('Create Document error:', error);
        res.status(500).json({message: 'Server error'});
    }
};

exports.getDocumentById = async (req, res) => {
    const documentId = req.params.id;
    console.log('Received document ID:', documentId);

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
        return res.status(400).json({ message: 'Invalid document ID' });
    }
    try {
      const document = await Document.findById(req.params.id);
  
      if (document && document.user.equals(req.user.id)) {
        res.json(document);
      } else {
        res.status(404).json({ message: 'Document not found' });
      }
    } catch (error) {
        console.error('Get Document By ID error:', error);
        res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.updateDocument = async (req, res) => {
    try {
      const document = await Document.findById(req.params.id);
  
      if (document && document.user.equals(req.user.id)) {
        document.title = req.body.title || document.title;
        document.content = req.body.content || document.content;
  
        const updatedDocument = await document.save();
        res.json(updatedDocument);
      } else {
        res.status(404).json({ message: 'Document not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.deleteDocument = async (req, res) => {
    try {
      const document = await Document.findById(req.params.id);
  
      if (document && document.user.equals(req.user.id)) {
        await document.deleteOne();
        res.json({ message: 'Document removed' });
      } else {
        res.status(404).json({ message: 'Document not found' });
      }
    } catch (error) {
        console.error('Delete Document error:', error);
        res.status(500).json({ message: 'Server error' });
    }
  };