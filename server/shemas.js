'use strict'

module.exports = function (mongoose){
    return {
        userSchema: new mongoose.Schema({
            online: Boolean,
            role: Number,
            login: { type: String, trim: true, lowercase: true, unique: true },
            password: { type: String, required: true},
            email: { type: String, trim: true, lowercase: true, unique: true },
            firstName: { type: String, trim: true },
            lastName: { type: String, trim: true },
            picture: { type: String, trim: true },
            tests: [ Schema.Types.ObjectId ],
            students: [ Schema.Types.ObjectId ],
            teachers: [ Schema.Types.ObjectId ],
            group: String,
            course: {type: Number, min: 1}  
        },
        {
            collection: 'user' 
        }),

        questionSchema: new mongoose.Schema({
            testId:  Schema.Types.ObjectId,
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
            questions: [ Schema.Types.ObjectId ],
            teacherId: Schema.Types.ObjectId,
            testName: String,
            description: String,
            studentsAssigned: [ Schema.Types.ObjectId ],
            active: Boolean
        }, 
        {
            collection: 'test'
        }),
        
        studentTestSchema: new mongoose.Schema({
            studentId: Schema.Types.ObjectId,
            testId: Schema.Types.ObjectId,
            passed: Boolean,
            grade: Number
        }, 
        {
            collection: 'student-test'
        })
    };
}