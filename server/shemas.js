'use strict'

module.exports = function (mongoose){
    return {
        userSchema: new mongoose.Schema({
            online: Boolean,
            role: Number,
            email: { type: String, trim: true, lowercase: true, unique: true, required: true },
            firstName: { type: String, trim: true },
            lastName: { type: String, trim: true },
            picture: { type: String, trim: true },
            tests: [ mongoose.Schema.Types.ObjectId ],
            students: [ mongoose.Schema.Types.ObjectId ],
            teachers: [ mongoose.Schema.Types.ObjectId ],
            group: String,
            course: {type: Number, min: -1}  
        },
        {
            collection: 'user' 
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
            collection: 'question'
        }),
        
        testSchema: new mongoose.Schema({
            questions: [ mongoose.Schema.Types.ObjectId ],
            teacherId: mongoose.Schema.Types.ObjectId,
            testName: String,
            description: String,
            studentsAssigned: [ mongoose.Schema.Types.ObjectId ],
            active: Boolean
        }, 
        {
            collection: 'test'
        }),
        
        studentTestSchema: new mongoose.Schema({
            studentId: mongoose.Schema.Types.ObjectId,
            testId: mongoose.Schema.Types.ObjectId,
            passed: Boolean,
            grade: Number
        }, 
        {
            collection: 'student-test'
        })
    };
};