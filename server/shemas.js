'use strict';

module.exports = function (mongoose) {
    return {
        userSchema: new mongoose.Schema({
            online: { type: Boolean, default: false },
            role: { type: Number, default: 1 },
            email: { type: String, trim: true, lowercase: true, unique: true, required: true },
            firstName: { type: String, trim: true, required: true },
            lastName: { type: String, trim: true, required: true },
            picture: { type: String, trim: true, default: '' },
            tests: [ mongoose.Schema.Types.ObjectId ],
            students: [ mongoose.Schema.Types.ObjectId ],
            teachers: [ mongoose.Schema.Types.ObjectId ],
            group: { type: String, default: '-1' },
            course: { type: Number, default: -1 }
        },
        {
            collection: 'users'
        }),

        questionSchema: new mongoose.Schema({
            testId:  mongoose.Schema.Types.ObjectId,
            questionText: String,
            answers: [String],
            questionType: Number,
            additionPicture: {type: String, trim: true},
            rightAnswers: [Number],
            questionCost: Number
        },
        {
            collection: 'questions'
        }),
        
        testSchema: new mongoose.Schema({
            questions: [ mongoose.Schema.Types.ObjectId ],
            teacherId: mongoose.Schema.Types.ObjectId,
            testName: String,
            description: String,
            studentsAssigned: [ mongoose.Schema.Types.ObjectId ],
            active: Boolean,
            start: { type: Date, default: new Date()},
            finish: { type: Date, default: new Date() }
        },
        {
            collection: 'tests'
        }),
        
        studentTestSchema: new mongoose.Schema({
            studentId: mongoose.Schema.Types.ObjectId,
            testId: mongoose.Schema.Types.ObjectId,
            passed: Boolean,
            grade: Number
        },
        {
            collection: 'student-tests'
        }),
        
        newsSchema: new mongoose.Schema({
            text: { type: String },
            date: { type: Date, default: Date.now },
            link: { type: String, trim: true },
            userId: { type: mongoose.Schema.Types.ObjectId },
            linkText: { type: String }
        }, {
            collection: 'news'
        })
    };
};