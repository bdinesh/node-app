const mongoose = require('mongoose');
const Store = mongoose.model('Store');
// for handling multipart/form-data
const multer = require('multer');
// for image manipulation
const jimp = require('jimp');
// for generating unique identifier
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');

        if (isPhoto) {
            next(null, true);
        } else {
            next({
                message: 'That file type isn\'t allowed'
            }, false);
        }
    }
};

exports.homePage = (req, res) => {
    res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', {
        title: 'Add Store'
    });
};

// this middleware adds the uploaded file to req object
exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    if (!req.file) {
        next(); // skip to next middleware

        return;
    }

    const extension = req.file.mimetype.split('/')[1];

    req.body.photo = `${uuid.v4()}.${extension}`;

    // resize photo
    const photo = await jimp.read(req.file.buffer);

    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
};

exports.createStore = async (req, res) => {
    req.body.author = req.user._id;
    const store = await (new Store(req.body)).save();

    req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
    res.redirect(`/stores/${store.slug}`);
};

exports.getStores = async (req, res) => {
    const stores = await Store.find();

    res.render('stores', {
        title: 'Stores',
        stores
    });
};

const confirmOwer = (store, user) => {
    if (!store.author.equals(user._id)) {
        return false;
    } else {
        return true;
    }
};


exports.editStore = async (req, res) => {
    const store = await Store.findById(req.params.id);

    if (confirmOwer(store, req.user)) {
        res.render('editStore', {
            title: `Edit ${store.name}`,
            store
        });
    } else {
        req.flash('error', 'You must own a store in order to edit it');
        res.redirect('/stores');
    }
};

exports.updateStore = async (req, res) => {
    req.body.location.type = 'Point';

    const store = await Store
        .findOneAndUpdate({
            _id: req.params.id
        }, req.body, {
            new: true,
            runValidators: true
        })
        .exec();

    req.flash('success', `Successfully updated ${store.name}. <a href="/store/${store.slug}">View Store</a>`);
    res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async (req, res, next) => {
    const store = await Store
        .findOne({
            slug: req.params.slug
        })
        .populate('author');

    if (!store) {
        return next();
    }

    res.render('store', {
        store,
        title: store.name
    });
};

exports.getStoresByTag = async (req, res) => {
    const tag = req.params.tag;
    const tagQuery = tag || {
        $exists: true
    };
    const tagsPromise = Store.getTagsList();
    const storesPromise = Store.find({
        tags: tagQuery
    });
    const [ tags, stores ] = await Promise.all([ tagsPromise, storesPromise ]);

    res.render('tags', {
        tags,
        title: 'Tags',
        tag,
        stores
    });
};

exports.searchStores = async (req, res) => {
    const stores = await Store
        .find({
            $text: {
                $search: req.query.q
            }
        }, {
            score: {
                $meta: 'textScore'
            }
        })
        .sort({
            score: {
                $meta: 'textScore'
            }
        })
        .limit(5);

    res.json(stores);
};