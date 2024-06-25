const { Course } = require('../models/Course');

//TODO replace with real data service according to exam description

async function getAll() {
    return Course.find().lean();
}

async function getById(id) {
    return Course.findById(id).lean();
}

async function createCourse(data, authorId) {

    const record = new Course({
        title: data.title,
        type: data.type,
        certificate: data.certificate,
        image: data.image,
        description: data.description,
        price: data.price,
        author: authorId
    });

    await record.save();

    return record;
}

async function updateCourse(id, data, userId) {

    const record = await Course.findById(id);

    if (!record) {
        throw new Error('Record not found' + id);
    }

    if (record.author.toString() != userId) {
        throw new Error('Access Denied!');
    }

    record.title = data.title;
    record.type = data.type;
    record.certificate = data.certificate;
    record.image = data.image;
    record.description = data.description;
    record.price = data.price;
    record.author = authorId

    await record.save();
    return record;

}

async function deleteCourseById(id, userId) {

    const record = await Course.findById(id);

    if (!record) {
        throw new ReferenceError('Record not found' + id);
    }

    if (record.author.toString() != userId) {
        throw new Error('Access Denied!');
    }

    await Course.findByIdAndDelete(id);
}

async function getMySignUp(userId) {
    return Course.find({signUpList : userId}).lean();
}

async function getMyCreatedCourses(userId) {
    return Course.find({owner: userId}).lean();
}

module.exports = {
    getAll,
    getById,
    updateCourse,
    createCourse,
    deleteCourseById,
    getMySignUp,
    getMyCreatedCourses
};