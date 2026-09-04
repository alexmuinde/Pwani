import mongoose from 'mongoose';

// Existing Upsert Controller
export const genericUpsert = (Model) => async (req, res, next) => {
  try {
    const { _id, ...updateData } = req.body;
    const docId = req.params.id || _id;

    const query = docId && mongoose.Types.ObjectId.isValid(docId) 
      ? { _id: docId } 
      : { _id: new mongoose.Types.ObjectId() };

    const updatedDoc = await Model.findOneAndUpdate(
      query,
      {
        $set: updateData,
        ...(req.user?.id && { userReference: req.user.id }),
      },
      {
        returnDocument: 'after',
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json(updatedDoc);
  } catch (error) {
    next(error);
  }
};

// Existing Get Document Controller
export const genericGetDoc = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found!" });
    }
    res.status(200).json(doc);
  } catch (error) {
    next(error);
  }
};

// Generic Fetch All User Documents Controller
export const getUserDocuments = (modelsMap) => async (req, res, next) => {
  try {
    const userId = req.params.id;

    const fetchPromises = Object.entries(modelsMap).map(async ([docType, Model]) => {
      const docs = await Model.find({ userReference: userId })
        .populate('userReference', 'username')
        .lean();
      return docs.map((doc) => ({ ...doc, docType }));
    });

    const results = await Promise.all(fetchPromises);
    const allDocs = results.flat().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.status(200).json(allDocs);
  } catch (error) {
    next(error);
  }
};

// Generic Fetch ALL Created Documents Controller (All Users)
export const getAllDocuments = (modelsMap) => async (req, res, next) => {
  try {
    const fetchPromises = Object.entries(modelsMap).map(async ([docType, Model]) => {
      const docs = await Model.find()
        .populate('userReference', 'username')
        .lean();
      return docs.map((doc) => ({ ...doc, docType }));
    });

    const results = await Promise.all(fetchPromises);
    const allDocs = results.flat().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.status(200).json(allDocs);
  } catch (error) {
    next(error);
  }
};

// Generic Search Documents Controller across all dynamic fields
export const searchAllDocuments = (modelsMap) => async (req, res, next) => {
  try {
    const { searchTerm } = req.query;
    if (!searchTerm) {
      return res.status(200).json([]);
    }

    const regex = new RegExp(searchTerm, 'i');

    const fetchPromises = Object.entries(modelsMap).map(async ([docType, Model]) => {
      // Retrieve documents and lean convert for field inspection
      const docs = await Model.find()
        .populate('userReference', 'username')
        .lean();

      // Filter documents where any string/number field matches the search regex
      const matchingDocs = docs.filter((doc) => {
        return Object.entries(doc).some(([key, val]) => {
          if (['_id', '__v', 'userReference', 'createdAt', 'updatedAt'].includes(key)) return false;
          if (val === null || val === undefined) return false;
          return regex.test(String(val));
        });
      });

      return matchingDocs.map((doc) => ({ ...doc, docType }));
    });

    const results = await Promise.all(fetchPromises);
    const sortedResults = results.flat().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.status(200).json(sortedResults);
  } catch (error) {
    next(error);
  }
};